import { expect, test } from '@playwright/test';

// Covers the employee happy path through the real UI, proxy, service, and database.
test('create an employee and see it in the list', async ({ page }) => {
  // Unique per run, because email must be unique and the database outlives the test.
  const suffix = `${Date.now()}`;
  const name = `Katherine Johnson ${suffix}`;
  const email = `katherine.${suffix}@example.com`;

  await page.goto('/employees');
  await page.getByRole('link', { name: 'New employee' }).click();

  await page.getByLabel('Name').fill(name);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Title').fill('Mathematician');
  await page.getByLabel('Department').fill('Research');
  await page.getByRole('button', { name: 'Create employee' }).click();

  await expect(page).toHaveURL(/\/employees$/);
  const row = page.getByRole('row', { name: new RegExp(name) });
  await expect(row).toBeVisible();
  await expect(row.getByRole('cell', { name: email })).toBeVisible();
});
