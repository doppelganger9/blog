import { test, expect, visit, mockNetwork } from './fixtures';

test.describe('Links & Anchors in blog post markdown titles', () => {
  test.beforeEach(async ({ page }) => {
    await mockNetwork(page);
    await visit(page, '/hello-world');
  });

  test('should have an <A>nchor', async ({ page }) => {
    await expect(page.locator(`[data-cy='blog-post-heading']`)).toContainText('Hello');
    await expect(page.locator('h2 a').first()).toBeAttached();
  });

  test('should have an id on heading, the same as the href on the <A>nchor', async ({ page }) => {
    await expect(page.locator('h2#hi-')).toBeAttached();
    await expect(page.locator('h2#hi- a[href="#hi-"]')).toBeAttached();
  });

  test('should have an <A>nchor with aria-hidden for a11y', async ({ page }) => {
    await expect(page.locator('a[href="#hi-"]')).toHaveAttribute('aria-hidden', 'true');
  });

  test('should have an <A>nchor with href with #escaped-name', async ({ page }) => {
    await expect(page.locator('#hi- a')).toBeAttached();
  });
});
