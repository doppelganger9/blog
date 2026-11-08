import { test, expect, visit, mockNetwork } from './fixtures';

const related = "[data-cy='blog-post-related']";

test.describe('The "Read next" block', () => {
  test.beforeEach(async ({ page }) => {
    await mockNetwork(page);
  });

  test('suggests 3 related posts, in the language of the post', async ({ page }) => {
    await visit(page, '/2026/10/31');
    await expect(page.locator(`${related} h2`)).toHaveText('À lire aussi');
    await expect(page.locator(`${related} li`)).toHaveCount(3);
    // the closest post shares the most tags (Cypress, Quality, CI/CD)
    await expect(page.locator(`${related} a`).first()).toHaveAttribute('href', '/2020/07/05');
    await expect(page.locator(`${related} a[href='/2026/10/31']`)).toHaveCount(0);
  });

  test('is prerendered: a direct visit does not download the related posts', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (request) => request.url().includes('/related/') && requests.push(request.url()));
    await visit(page, '/2019/06/21');
    await expect(page.locator(`${related} h2`)).toHaveText('Read next');
    expect(requests).toEqual([]);
  });

  test('follows client-side navigations', async ({ page }) => {
    await visit(page, '/2026/10/31');
    await page.locator(`${related} a`).first().click();
    await expect(page).toHaveURL(/\/2020\/07\/05$/);
    await expect(page.locator(`${related} h2`)).toHaveText('Read next');
    await expect(page.locator(`${related} a[href='/2020/07/05']`)).toHaveCount(0);
  });
});
