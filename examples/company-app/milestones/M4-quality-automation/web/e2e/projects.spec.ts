import { expect, test } from '@playwright/test';

let projectName: string | undefined;

// Clean up through the API, even when the test fails, so re-runs start from the same state.
test.afterEach(async ({ request }) => {
  if (!projectName) return;
  const response = await request.get('/api/projects');
  if (response.ok()) {
    const projects: { id: string; name: string }[] = await response.json();
    const created = projects.find((p) => p.name === projectName);
    if (created) await request.delete(`/api/projects/${created.id}`);
  }
  projectName = undefined;
});

// Added in 3.4.7: the starter only covered creating an employee.
test('create a project and see it in the list', async ({ page }) => {
  // Project names are unique, and the database outlives the test, so make one per run.
  const name = `E2E Project ${Date.now()}`;
  projectName = name;

  await page.goto('/projects');
  await page.getByRole('link', { name: 'New project' }).click();

  await page.getByLabel('Name').fill(name);
  await page.getByLabel('Description').fill('Created by the Playwright journey');
  await page.getByLabel('Start date').fill('2026-06-01');
  // New projects start as "planned": the status rule (3.4.2) only allows moving forward.
  await expect(page.getByLabel('Status')).toHaveValue('planned');
  await page.getByRole('button', { name: 'Create project' }).click();

  await expect(page).toHaveURL(/\/projects$/);
  const row = page.getByRole('row', { name: new RegExp(name) });
  await expect(row).toBeVisible();
  await expect(row.getByText('planned')).toBeVisible();
});
