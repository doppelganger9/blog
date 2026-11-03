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

// the client-side router renders src/routes/+error.svelte when a link leads nowhere
test.describe('The error page', () => {
  test('shows a 404 when a client-side navigation leads to an unknown page', async ({ page }) => {
    await mockNetwork(page);
    await visit(page, '/');
    await expect(page.locator('[data-cy=blog-posts-list]')).toBeVisible();
    await page.evaluate(() => {
      const a = Object.assign(document.createElement('a'), { href: '/no-such-post', textContent: 'nowhere' });
      a.id = 'nowhere';
      document.body.append(a);
    });
    await page.locator('#nowhere').click();
    await expect(page.locator('h1')).toContainText('404');
    await expect(page.locator('.col-md-9 h3')).toContainText('/no-such-post');
    await expect(page.locator('img[alt*="TARDIS"]')).toBeAttached();
  });
});
