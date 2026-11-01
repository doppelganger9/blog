import { test, expect, visit, mockNetwork } from './fixtures';

// GoatCounter's count.js counts the first page view by itself; the layout counts the
// pages opened afterwards by the client-side router. count.js is replaced by a stub
// that records the calls (page routes take precedence over the blockHosts fixture).
test.describe('Analytics (GoatCounter)', () => {
  test.beforeEach(async ({ page }) => {
    await mockNetwork(page);
    await page.route('https://gc.zgo.at/count.js', (route) =>
      route.fulfill({
        contentType: 'text/javascript',
        body: 'window.goatcounter = { count: (vars) => (window.__counted = window.__counted || []).push(vars) };',
      }),
    );
  });

  test('loads count.js with the GoatCounter endpoint', async ({ page }) => {
    await visit(page, '/');
    const script = page.locator('script[data-goatcounter]');
    await expect(script).toHaveAttribute('src', 'https://gc.zgo.at/count.js');
    await expect(script).toHaveAttribute('data-goatcounter', /^https:\/\/[a-z0-9-]+\.goatcounter\.com\/count$/);
  });

  test('counts the pages opened by client-side navigation', async ({ page }) => {
    await visit(page, '/');
    await page.waitForFunction(() => (window as any).goatcounter?.count);
    await expect.poll(() => page.evaluate(() => (window as any).__counted)).toBeUndefined();

    await page.locator(`a[href*='privacy-policy']`).first().click();
    await expect(page).toHaveURL(/\/privacy-policy/);

    await expect
      .poll(() => page.evaluate(() => (window as any).__counted))
      .toEqual([
        {
          path: '/privacy-policy',
          referrer: expect.stringMatching(/^http:\/\/127\.0\.0\.1:8080\/$/),
          title: 'Privacy Policy',
        },
      ]);
  });

  test('counts the clicks on the contact block links as events', async ({ page }) => {
    await visit(page, '/2023/01/21');
    await page.waitForFunction(() => (window as any).goatcounter?.count);
    await page.locator('[data-cy=blog-post-contact] a[href="#comments"]').click();
    await expect
      .poll(() => page.evaluate(() => (window as any).__counted))
      .toEqual([{ path: 'contact-comments', title: '/2023/01/21', event: true }]);
  });
});
