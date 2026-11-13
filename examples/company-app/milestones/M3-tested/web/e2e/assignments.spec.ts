import { expect, test } from '@playwright/test';

// Seed project from SPEC.md.
const CUSTOMER_PORTAL_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

let employeeId: string | undefined;

// Clean up through the API, even when the test fails, so re-runs start from the same state.
test.afterEach(async ({ request }) => {
  if (!employeeId) return;
  const response = await request.get(`/api/assignments?employeeId=${employeeId}`);
  if (response.ok()) {
    const assignments: { id: string }[] = await response.json();
    for (const a of assignments) await request.delete(`/api/assignments/${a.id}`);
  }
  // assignments-service would also remove them when it consumes employee.deleted.
  await request.delete(`/api/employees/${employeeId}`);
  employeeId = undefined;
});

// Added in 3.4.7. Needs assignments-service behind the proxy (built in 3.3).
test('assign an employee to a project and see it in the list', async ({ page, request }) => {
  const probe = await request.get('/api/assignments');
  expect(probe.status(), 'assignments-service must be running behind the proxy').toBe(200);

  // A fresh employee per run: assigning the same employee to the same project twice is a 409,
  // and allocations across runs would add up past 100%.
  const suffix = `${Date.now()}`;
  const employeeName = `E2E Assignee ${suffix}`;
  const created = await request.post('/api/employees', {
    data: {
      name: employeeName,
      email: `e2e.assignee.${suffix}@example.com`,
      title: 'Engineer',
      department: 'Engineering',
    },
  });
  expect(created.status()).toBe(201);
  employeeId = ((await created.json()) as { id: string }).id;

  await page.goto('/assignments');
  await page.getByRole('link', { name: 'New assignment' }).click();

  await page.getByLabel('Employee').selectOption({ label: employeeName });
  await page.getByLabel('Project').selectOption(CUSTOMER_PORTAL_ID);
  await page.getByLabel('Role').fill('Developer');
  await page.getByLabel('Allocation (%)').fill('25');
  await page.getByLabel('Start date').fill('2026-03-02');
  await page.getByRole('button', { name: 'Create assignment' }).click();

  await expect(page).toHaveURL(/\/assignments$/);
  // The list resolves IDs to names from the Employees and Projects services. `exact`, because
  // the Delete button's label also mentions the project name.
  const row = page.getByRole('row', { name: new RegExp(employeeName) });
  await expect(row).toBeVisible();
  await expect(row.getByRole('cell', { name: 'Customer Portal', exact: true })).toBeVisible();
  await expect(row.getByRole('cell', { name: '25%', exact: true })).toBeVisible();
});
