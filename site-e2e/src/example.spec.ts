import { expect, test } from '@playwright/test';

test('renders the devfolio homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Moon Devfolio/);
  await expect(page.locator('h1')).toContainText(/full-stack engineer|全栈工程师/i);
});
