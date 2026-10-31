import { test, expect, visit, mockNetwork, mainFrameworkName, mainFrameworkURL, jamStackFrameworkName, jamStackFrameworkURL } from './fixtures';

test.describe('has a footer', () => {
  test.beforeEach(async ({ page }) => {
    await mockNetwork(page);
    await visit(page, '/');
  });

  test('shows a copyright year', async ({ page }) => {
    await expect(page.locator('footer')).toContainText(String(new Date().getFullYear()));
  });

  test('shows a link to ' + mainFrameworkName, async ({ page }) => {
    await expect(page.locator(`a[href*='${mainFrameworkURL}']`).first()).toContainText(mainFrameworkName);
  });

  test('shows a link to ' + jamStackFrameworkName, async ({ page }) => {
    await expect(page.locator(`a[href*='${jamStackFrameworkURL}']`).first()).toContainText(jamStackFrameworkName);
  });

  test('shows a link to Privacy Policy', async ({ page }) => {
    await expect(page.locator(`a[href*='privacy-policy']`).first()).toContainText('Privacy Policy');
  });

  test('can link to Privacy Policy', async ({ page }) => {
    await page.locator(`a[href*='privacy-policy']`).first().click();
    await expect(page).toHaveURL(/\/privacy-policy/);
    await expect(page.locator('h1')).toContainText('Privacy Policy');
  });
});
