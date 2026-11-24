import { expect, type Page, type TestInfo, test } from '@playwright/test';

// Lightweight smoke test: it checks that the site's main moving parts load without errors
// after a dependency change. It does not read every page or exercise every plugin.
// Each test attaches a screenshot to the Playwright report as evidence that it ran.

const HOME = '/';
const SECTION = '/#/1-introduction/1.0-overview.md';
const QUIZ = '/#/2-version-control/2.2.2-actions.md';

function watchProblems(page: Page, baseURL: string | undefined): string[] {
  const problems: string[] = [];
  const origin = new URL(baseURL ?? 'http://localhost:3000').origin;
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`console: ${msg.text()}`);
  });
  page.on('requestfailed', (req) => {
    if (req.url().startsWith(origin)) problems.push(`requestfailed: ${req.url()} ${req.failure()?.errorText}`);
  });
  page.on('response', (res) => {
    if (res.url().startsWith(origin) && res.status() >= 400) problems.push(`HTTP ${res.status()}: ${res.url()}`);
  });
  return problems;
}

async function snap(page: Page, testInfo: TestInfo, name: string) {
  await testInfo.attach(name, { body: await page.screenshot(), contentType: 'image/png' });
}

test('home page renders the master-record charts', async ({ page, baseURL }, testInfo) => {
  const problems = watchProblems(page, baseURL);
  await page.goto(HOME);
  await expect(page.locator('.markdown-section canvas').first()).toBeVisible();
  await page.waitForLoadState('networkidle');
  await snap(page, testInfo, 'home');
  expect(problems).toEqual([]);
});

test('a section page renders with a title', async ({ page, baseURL }, testInfo) => {
  const problems = watchProblems(page, baseURL);
  await page.goto(SECTION);
  const h1 = page.locator('.markdown-section h1').first();
  await expect(h1).toBeVisible();
  await expect(h1).not.toHaveText(/404/);
  await page.waitForLoadState('networkidle');
  await snap(page, testInfo, 'section');
  expect(problems).toEqual([]);
});

test('the quiz page renders its quizdown component', async ({ page, baseURL }, testInfo) => {
  const problems = watchProblems(page, baseURL);
  await page.goto(QUIZ);
  // Quizdown mounts in a shadow root, so assert on its question and answer choices.
  const quiz = page.locator('.quizdown').first();
  await expect(quiz.getByRole('heading', { name: /^Q1/ })).toBeVisible();
  await expect(quiz.getByRole('radio').first()).toBeVisible();
  await quiz.scrollIntoViewIfNeeded();
  await page.waitForLoadState('networkidle');
  await snap(page, testInfo, 'quiz');
  expect(problems).toEqual([]);
});

test('the sidebar opens and closes', async ({ page, baseURL }, testInfo) => {
  const problems = watchProblems(page, baseURL);
  await page.goto(SECTION);
  const sidebar = page.locator('.sidebar');
  const toggle = page.locator('.sidebar-toggle-button');
  await expect(toggle).toBeVisible();
  const startedVisible = await sidebar.isVisible();
  await toggle.click();
  await expect.poll(() => sidebar.isVisible()).toBe(!startedVisible);
  await snap(page, testInfo, 'sidebar-toggled');
  await toggle.click();
  await expect.poll(() => sidebar.isVisible()).toBe(startedVisible);
  await snap(page, testInfo, 'sidebar-restored');
  expect(problems).toEqual([]);
});

test('dark and light mode switch', async ({ page, baseURL }, testInfo) => {
  const problems = watchProblems(page, baseURL);
  // Start from a known theme so the first click always switches to dark.
  await page.addInitScript(() => localStorage.setItem('dark_mode', 'false'));
  await page.goto(SECTION);
  const root = page.locator('html');
  const label = page.locator('label[for="dark_mode_switch"]');
  await expect(root).toHaveAttribute('data-theme', 'light');
  await label.click();
  await expect(root).toHaveAttribute('data-theme', 'dark');
  await snap(page, testInfo, 'dark');
  await label.click();
  await expect(root).toHaveAttribute('data-theme', 'light');
  await snap(page, testInfo, 'light');
  expect(problems).toEqual([]);
});
