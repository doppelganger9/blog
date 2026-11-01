import { test as base, expect, type Page } from '@playwright/test';
import MCR from 'monocart-coverage-reports';
import { coverageOptions } from './coverage-options';

export { expect };

export const mainFrameworkName = 'Svelte';
export const mainFrameworkURL = 'https://svelte.dev';
export const jamStackFrameworkName = 'SvelteKit';
export const jamStackFrameworkURL = 'https://kit.svelte.dev';

/**
 * Opens a page without waiting for its images, fonts and CDN stylesheets (`load` event):
 * each test runs in a fresh browser context with an empty HTTP cache, and the assertions
 * wait for what they need anyway.
 */
export const visit = (page: Page, url: string) => page.goto(url, { waitUntil: 'domcontentloaded' });

const UPTIME_ROBOT_API = 'https://api.uptimerobot.com/v2/getMonitors';

/**
 * Same network setup as the Cypress `beforeEach` blocks:
 * - every other JSON request answers 404 (`force404`),
 * - Giscus discussions are blocked,
 * - the Uptime Robot status API answers "up" (status 2).
 * Routes registered later win, so a test can override the status API.
 */
export async function mockNetwork(page: Page, { status = 2 }: { status?: number } = {}) {
  await page.route('**/*', (route) =>
    route.request().headers()['accept']?.includes('application/json')
      ? route.fulfill({ status: 404 })
      : route.fallback(),
  );
  await page.route('https://giscus.app/api/discussions**', (route) =>
    route.fulfill({ status: 404, body: 'Giscus Discussions blocked' }),
  );
  await mockStatusAPI(page, status);
}

export async function mockStatusAPI(page: Page, status: number) {
  await page.route(UPTIME_ROBOT_API, (route) =>
    route.fulfill({
      json: { monitors: [{ url: 'https://lacourt.dev', friendly_name: 'Lacourt.dev', status }] },
    }),
  );
}

export async function mockStatusAPIHttpError(page: Page, status: number, message: string) {
  await page.route(UPTIME_ROBOT_API, (route) => route.fulfill({ status, json: { message } }));
}

export const statusAPIResponse = (page: Page) =>
  page.waitForResponse((response) => response.url() === UPTIME_ROBOT_API);

export async function articleFooterShouldBeShown(page: Page) {
  await expect(page.locator('p', { hasText: 'building things with code' }).first()).toBeVisible();
}

export async function builtByFooterShouldBeShown(page: Page) {
  await expect(page.locator('footer')).toContainText(jamStackFrameworkName);
}

export async function aBackLinkShouldBeShownTo(page: Page, target = '/') {
  await expect(page.locator(`a[href='${target}']`).first()).toBeAttached();
}

export async function titleBarShouldBeShown(page: Page, level = 'h1') {
  await expect(page.locator(level, { hasText: `David's Blog` }).first()).toBeVisible();
}

/** counts the reads of navigator.language (the Cypress tests used a cy.stub) */
export async function countLanguageReads(page: Page) {
  await page.addInitScript(() => {
    const original = Object.getOwnPropertyDescriptor(Navigator.prototype, 'language')!.get!;
    (window as any).__languageReads = 0;
    Object.defineProperty(Navigator.prototype, 'language', {
      get() {
        (window as any).__languageReads++;
        return original.call(this);
      },
    });
  });
}

export const languageReads = (page: Page) => page.evaluate(() => (window as any).__languageReads);

// Optional equivalent of Cypress' `blockHosts`, e.g. to work offline:
// BLOCK_HOSTS='fonts.googleapis.com,platform.twitter.com' npm test
// GoatCounter is always blocked: the tests must not count page views (count.js already skips
// 127.0.0.1, but it would still be downloaded by each test).
const blockedHosts = ['gc.zgo.at', '*.goatcounter.com', ...(process.env.BLOCK_HOSTS ?? '').split(',').map((h) => h.trim()).filter(Boolean)];
const isBlocked = (url: string) => {
  const { hostname } = new URL(url);
  return blockedHosts.some((pattern) =>
    pattern.startsWith('*') ? hostname.endsWith(pattern.slice(1)) || hostname.includes(pattern.slice(1)) : hostname === pattern,
  );
};

/** collects the V8 JavaScript coverage of each test when COVERAGE=true */
export const test = base.extend<{ autoCoverage: void; blockHosts: void }>({
  blockHosts: [
    async ({ context }, use) => {
      if (blockedHosts.length) {
        await context.route((url) => isBlocked(url.href), (route) => route.abort('blockedbyclient'));
      }
      await use();
    },
    { auto: true },
  ],
  autoCoverage: [
    async ({ page, browserName }, use) => {
      const enabled = process.env.COVERAGE === 'true' && browserName === 'chromium';
      if (enabled) {
        await page.coverage.startJSCoverage({ resetOnNavigation: false });
      }
      await use();
      if (enabled) {
        const coverage = await page.coverage.stopJSCoverage();
        if (coverage.length) await MCR(coverageOptions).add(coverage); // API-only tests have none
      }
    },
    { auto: true },
  ],
});
