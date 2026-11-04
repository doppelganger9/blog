import { test, expect, mockNetwork, type Page } from './fixtures';

/**
 * Visual regression tests: screenshots compared with the reference images of e2e/__screenshots__.
 * They run in the `visual-desktop` and `visual-mobile` projects only, and only on Linux: fonts
 * are rendered differently on macOS and Windows, so the references are Linux ones (the CI's).
 * After an intended visual change: `npx playwright test --project='visual-*' --update-snapshots`
 * (on Linux, or in the mcr.microsoft.com/playwright Docker image), then review the new images.
 */
test.skip(process.platform !== 'linux', 'reference screenshots are rendered on Linux');

/** opens a page and waits until it no longer changes: web fonts, images and emojis loaded */
async function open(page: Page, url: string) {
  await mockNetwork(page);
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) => (img.complete ? null : new Promise((done) => (img.onload = img.onerror = done)))),
    );
  });
}

test('home, first screen', async ({ page }) => {
  await open(page, '/');
  await expect(page).toHaveScreenshot('home.png');
});

test.describe('a post with figures and tables (2026/10/31)', () => {
  test.beforeEach(async ({ page }) => open(page, '/2026/10/31'));

  test('first screen', async ({ page }) => {
    await expect(page).toHaveScreenshot('post-first-screen.png');
  });

  test('figure', async ({ page }) => {
    await expect(page.locator('.content figure').nth(1)).toHaveScreenshot('post-figure.png');
  });

  test('table', async ({ page }) => {
    await expect(page.locator('.content table').first()).toHaveScreenshot('post-table.png');
  });

  test('contact block', async ({ page }) => {
    await expect(page.locator("[data-cy='blog-post-contact']")).toHaveScreenshot('post-contact.png');
  });
});

test('a post with code blocks (2019/06/21)', async ({ page }) => {
  await open(page, '/2019/06/21');
  await expect(page.locator('.content pre').first()).toHaveScreenshot('post-code.png');
});

test('404 page', async ({ page }) => {
  await open(page, '/404');
  // the TARDIS is an animated GIF from Tumblr
  await expect(page).toHaveScreenshot('404.png', { mask: [page.locator('img[alt*="TARDIS"]')] });
});
