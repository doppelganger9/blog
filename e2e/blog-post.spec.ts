import { test, expect, visit, mockNetwork, builtByFooterShouldBeShown, aBackLinkShouldBeShownTo, titleBarShouldBeShown, articleFooterShouldBeShown } from './fixtures';

test.describe('a blog post', () => {
  test.beforeEach(async ({ page }) => {
    await mockNetwork(page);
    await visit(page, '/');
    // no more `.wait(200)` for the hydration: Playwright waits for the click to be actionable
    await page.locator('a > h3').last().click();
    await expect(page.locator('[data-cy=blog-post-content]')).toBeVisible();
  });

  test('should show the title bar in h3', async ({ page }) => {
    await titleBarShouldBeShown(page, 'h3');
  });

  test('should have a back link to blog post list/home', async ({ page }) => {
    await aBackLinkShouldBeShownTo(page, '/');
  });

  test('should show the published date', async ({ page }) => {
    await expect(page.locator('[data-cy=blog-post-date]')).toContainText('2019');
  });

  test('should show the time to read', async ({ page }) => {
    await expect(page.locator('[data-cy=blog-post-readtime]')).toContainText('min read');
  });

  test('should show the categories', async ({ page }) => {
    await expect(page.locator('[data-cy=blog-post-categories]')).toBeAttached();
  });

  test('should show the "written by" footer', async ({ page }) => {
    await articleFooterShouldBeShown(page);
  });

  test('should show the "built with" footer', async ({ page }) => {
    await builtByFooterShouldBeShown(page);
  });

  test('should have replaced all emojis with Twemojis in the content', async ({ page }) => {
    await expect(page.locator('.emoji').first()).toHaveAttribute('src', /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/twemoji\/14\.0\.2\/svg/);
  });

  for (const level of ['h2', 'h3', 'h4']) {
    test(`should have links and ids on Level ${level.slice(1)} headings`, async ({ page }) => {
      const heading = page.locator(`[data-cy=blog-post-content] ${level}`).first();
      await expect(heading).toHaveAttribute('id', /.+/);
      await expect(heading.locator('a').first()).toHaveAttribute('href', /^#.+/);
    });
  }

  test('should have a giscus frame for comments', async ({ page }) => {
    await expect(page.locator('.giscus-frame')).toBeAttached();
  });
});
