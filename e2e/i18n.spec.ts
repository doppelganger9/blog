import { test, expect, visit, mockNetwork, countLanguageReads, languageReads } from './fixtures';

test.describe('i18n', () => {
  test.describe(`Given the browser's language is 🇫🇷`, () => {
    test.use({ locale: 'fr-FR' });

    test.beforeEach(async ({ page }) => {
      await mockNetwork(page);
      await countLanguageReads(page);
      await visit(page, '/');
    });

    test('when viewing the home page, then the title bar is in 🇫🇷', async ({ page }) => {
      await expect(page.locator(`[data-cy="title-bar"]`)).toContainText('Le Blog de David');
      expect(await languageReads(page)).toBe(1);
    });

    test('when viewing the home page, then the footer is in 🇫🇷', async ({ page }) => {
      await expect(page.locator(`[data-cy="footer"]`)).toContainText('construit avec');
      expect(await languageReads(page)).toBe(1);
    });

    test('when viewing the home page, then the article footer is in 🇫🇷', async ({ page }) => {
      await expect(page.locator(`[data-cy='article-footer']`)).toContainText('construire des choses avec du code');
      expect(await languageReads(page)).toBe(1);
    });

    test('when viewing the home page, then a button to switch to 🇺🇸 should be visible', async ({ page }) => {
      const button = page.locator('[data-cy=switch-lang-button]');
      await expect(button).toBeVisible();
      await expect(button).toHaveAttribute('aria-label', 'passer en anglais');
    });
  });

  test.describe(`Given the browser's language is 🇺🇸`, () => {
    test.use({ locale: 'en-US' });

    test.beforeEach(async ({ page }) => {
      await mockNetwork(page);
      await countLanguageReads(page);
      await visit(page, '/');
    });

    test('when viewing the home page, then the title bar is in 🇺🇸', async ({ page }) => {
      await expect(page.locator(`[data-cy="title-bar"]`)).toContainText(`David's Blog`);
      expect(await languageReads(page)).toBe(1);
    });

    test('when viewing the home page, then the footer is in 🇺🇸', async ({ page }) => {
      await expect(page.locator(`[data-cy="footer"]`)).toContainText('built with');
      expect(await languageReads(page)).toBe(1);
    });

    test('when viewing the home page, then the article footer is in 🇺🇸', async ({ page }) => {
      await expect(page.locator(`[data-cy='article-footer']`)).toContainText('building things with code');
      expect(await languageReads(page)).toBe(1);
    });

    test('when viewing the home page, then a button to switch to 🇫🇷 should be visible', async ({ page }) => {
      const button = page.locator('[data-cy=switch-lang-button]');
      await expect(button).toBeVisible();
      await expect(button).toHaveAttribute('aria-label', 'switch to french');
    });
  });
});
