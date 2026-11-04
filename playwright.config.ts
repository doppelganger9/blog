import { defineConfig, devices } from '@playwright/test';

const coverage = process.env.COVERAGE === 'true';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : [['list']],
  // merges the V8 coverage collected by each test into coverage/ (lcov + html)
  globalSetup: coverage ? './e2e/coverage-setup.ts' : undefined,
  globalTeardown: coverage ? './e2e/coverage-teardown.ts' : undefined,
  use: {
    baseURL: 'http://127.0.0.1:8080',
    locale: 'en-US',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // visual regression tests (e2e/visual.spec.ts): reference images in e2e/__screenshots__/<project>/
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  expect: {
    toHaveScreenshot: { animations: 'disabled', caret: 'hide', maxDiffPixelRatio: 0.001 },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: /visual\.spec/ },
    { name: 'visual-desktop', use: { ...devices['Desktop Chrome'] }, testMatch: /visual\.spec/ },
    { name: 'visual-mobile', use: { ...devices['Pixel 7'] }, testMatch: /visual\.spec/ },
  ],
  // serves the static build (run `npm run build` first)
  webServer: {
    command: 'npm run serve',
    url: 'http://127.0.0.1:8080',
    reuseExistingServer: !process.env.CI,
  },
});
