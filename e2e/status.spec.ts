import { test, expect, visit, mockStatusAPI, mockStatusAPIHttpError, statusAPIResponse } from './fixtures';
import type { Page } from '@playwright/test';

const statusPageURL = 'https://stats.uptimerobot.com/ZYDp0hJL8';
const statusIndicator = (page: Page) => page.locator('footer [data-cy="status-indicator"]');

test.describe('The Status component', () => {
  test('should be present in the footer', async ({ page }) => {
    await visit(page, '/');
    await expect(statusIndicator(page)).toBeAttached();
  });

  test('should have a link to redirect to the public UPTIME Robot status page', async ({ page }) => {
    await visit(page, '/');
    await expect(statusIndicator(page)).toHaveAttribute('href', statusPageURL);
  });

  test('should first show a waiting indicator before the API returns its response', async ({ page }) => {
    // the API answers only once the waiting state has been checked: no race
    let answer: () => void = () => {};
    const answered = new Promise<void>((resolve) => (answer = resolve));
    await page.route('https://api.uptimerobot.com/v2/getMonitors', async (route) => {
      await answered;
      await route.fulfill({ json: { monitors: [{ status: 2 }] } });
    });
    await visit(page, '/');
    await expect(statusIndicator(page)).toHaveClass(/waiting/);
    answer();
  });

  const statuses: Array<[number, string]> = [
    [0, 'paused'],
    [1, 'not_checked_yet'],
    [2, 'up'],
    [8, 'seems_down'],
    [9, 'down'],
  ];
  for (const [status, className] of statuses) {
    test(`should have a '${className}' indicator when the status API returns status ${status}`, async ({ page }) => {
      await mockStatusAPI(page, status);
      const response = statusAPIResponse(page);
      await visit(page, '/');
      await response;
      await expect(statusIndicator(page)).toHaveClass(new RegExp(className));
    });
  }

  for (const [httpStatus, message] of [[404, 'Not found'], [500, 'Server error']] as const) {
    test(`should have a 'api-${httpStatus}' indicator when the status API returns HTTP ${httpStatus}`, async ({ page }) => {
      await mockStatusAPIHttpError(page, httpStatus, message);
      const response = statusAPIResponse(page);
      await visit(page, '/');
      await response;
      await expect(statusIndicator(page)).toHaveClass(new RegExp(`api-${httpStatus}`));
    });
  }
});
