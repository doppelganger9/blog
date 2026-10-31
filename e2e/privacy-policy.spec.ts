import { test, expect, visit, mockNetwork, builtByFooterShouldBeShown, articleFooterShouldBeShown } from './fixtures';

test.describe('Privacy Policy page', () => {
  test.beforeEach(async ({ page }) => {
    await mockNetwork(page);
    await visit(page, '/privacy-policy');
  });

  test('should have the proper title', async ({ page }) => {
    await expect(page).toHaveURL(/\/privacy-policy/);
    await expect(page.locator('h1')).toContainText('Privacy Policy');
  });

  test('should have the cookie monster gif', async ({ page }) => {
    await expect(page.locator(`img[src*='cookiemonster']`)).toBeAttached();
    await expect(page.locator(`img[alt*='Cookie Monster']`)).toBeAttached();
  });

  test('should have a mailto link', async ({ page }) => {
    await expect(page.locator(`a[href*='mailto:']`).first()).toBeAttached();
  });

  test('should have a back link', async ({ page }) => {
    await expect(page.locator(`a[href='/']`).first()).toBeAttached();
  });

  test('should show the Article Footer', async ({ page }) => {
    await articleFooterShouldBeShown(page);
  });

  test('should show Built-by footer', async ({ page }) => {
    await builtByFooterShouldBeShown(page);
  });
});
