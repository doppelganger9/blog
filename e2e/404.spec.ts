import { test, expect, visit, mockNetwork, builtByFooterShouldBeShown, aBackLinkShouldBeShownTo, titleBarShouldBeShown } from './fixtures';

test.describe('The 404 page', () => {
  test.beforeEach(async ({ page }) => {
    await mockNetwork(page);
    await visit(page, '/404');
  });

  test('should show up for unknown URLs', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/404/i);
  });

  test('should show have a TUMBLR TARDIS lost in space GIF', async ({ page }) => {
    await expect(page.locator('img[src*="tumblr"]')).toBeAttached();
    await expect(page.locator('img[alt*="TARDIS"]')).toBeAttached();
  });

  test('should have the "built with" footer', async ({ page }) => {
    await builtByFooterShouldBeShown(page);
  });

  test(`should have the "David's Blog" Title Bar`, async ({ page }) => {
    await titleBarShouldBeShown(page, 'h3');
  });

  test('should have a back link to home', async ({ page }) => {
    await aBackLinkShouldBeShownTo(page, '/');
  });
});
