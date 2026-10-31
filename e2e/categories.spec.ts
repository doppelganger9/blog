import { test, expect, visit, mockNetwork } from './fixtures';

test.describe(`David's Blog app`, () => {
  test.beforeEach(async ({ page }) => {
    await mockNetwork(page);
    await visit(page, '/');
  });

  test('show blog post categories with at least 4 categories', async ({ page }) => {
    await expect(page.locator('[data-cy=categories] li').nth(4)).toBeAttached(); // more than 4
  });

  // skipped in Cypress too: "fails on GitHub Action runner but not locally"
  test.skip('clicking on a category filters the posts list', async ({ page }) => {
    await expect(page.locator('div h3', { hasText: 'On being a dad' }).first()).toBeAttached();
    await page.locator('[data-cy=categories]').getByText('Gaming').click();
    await expect(page.locator('div h3', { hasText: 'On being a dad' })).toHaveCount(0);
  });

  test.skip('clicking on an empty category shows sad face', async ({ page }) => {
    await expect(page.locator('.no-results')).toHaveCount(0);
    await page.locator('[data-cy=categories]').getByText('Music').click();
    await expect(page.locator('.no-results')).toBeAttached();
  });
});
