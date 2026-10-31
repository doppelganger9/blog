import { test, expect, visit, mockNetwork, builtByFooterShouldBeShown, articleFooterShouldBeShown } from './fixtures';

test.describe(`David's Blog app`, () => {
  test.beforeEach(async ({ page }) => {
    await mockNetwork(page);
    await visit(page, '/');
  });

  test('has the correct <h1>', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(`David's Blog`);
  });

  test('show blog posts list as home with at least 4 posts', async ({ page }) => {
    await expect(page.locator('div h3').nth(4)).toBeAttached(); // more than 4
  });

  test('show blog post categories with at least 8 categories', async ({ page }) => {
    await expect(page.locator('[data-cy=categories] li').nth(7)).toBeAttached(); // at least 8
  });

  test('shows the Article Footer', async ({ page }) => {
    await articleFooterShouldBeShown(page);
  });

  test('shows the built with footer', async ({ page }) => {
    await builtByFooterShouldBeShown(page);
  });
});
