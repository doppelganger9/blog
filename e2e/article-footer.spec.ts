import { test, expect, visit, mockNetwork } from './fixtures';

test.describe('The "Article Footer"', () => {
  const footer = `[data-cy='article-footer']`;

  test.beforeEach(async ({ page }) => {
    await mockNetwork(page);
    await visit(page, '/');
  });

  test(`has David's profile picture`, async ({ page }) => {
    // the Cypress test checked the first of the 7 <img> of the footer (6 are emojis):
    // Playwright's strict mode refuses such an ambiguous locator
    await expect(page.locator(footer).getByRole('img', { name: 'portrait' })).toHaveAttribute('src', /profile-pic/);
  });

  test(`has David's name in it`, async ({ page }) => {
    await expect(page.locator(footer)).toContainText('David Lacourt');
  });

  const links = {
    'Senlis Wikipedia page': 'https://en.wikipedia.org/wiki/Senlis',
    "David's Twitter profile page": 'https://twitter.com/doppelganger9',
    "David's GitHub profile page": 'https://github.com/doppelganger9/',
    "David's Codepen profile page": 'https://codepen.io/doppelganger9/',
    "David's DEV profile page": 'https://dev.to/doppelganger9',
    "David's LinkedIn profile page": 'https://www.linkedin.com/in/davidlacourt/',
    'StackOverflow profile page': 'https://stackoverflow.com/users/526660/doppelganger9',
    "David's GitLab profile page": 'https://gitlab.com/davidlacourt',
    "David's Facebook profile page": 'https://www.facebook.com/david.lacourt',
  };
  for (const [name, href] of Object.entries(links)) {
    test(`has a link to ${name}`, async ({ page }) => {
      await expect(page.locator(`${footer} a[href='${href}']`)).toBeAttached();
    });
  }
});
