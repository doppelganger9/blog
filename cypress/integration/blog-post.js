import { titleBarShouldBeShown, builtByFooterShouldBeShown, articleFooterShouldBeShown, aBackLinkShouldBeShownTo } from '../common';

describe(`a blog post`, () => {
  beforeEach(() => {
    cy.visitWithLang('/', 'en-US').get(`h3:contains('Hello')`).find('a').click()
  });

  it(`should show the title bar in h3`, () => {
    titleBarShouldBeShown('h3')
  });

  it(`should have a back link to blog post list/home`, () => {
    aBackLinkShouldBeShownTo('/')
  });

  it(`should show the published date in the first <p> following the <h1> article title`, () => {
    cy.get(`h1 + p`)
      .should('exist')
      .should('contain', '2019')
  });

  it(`should show the time to read in a second <p> following the <h1> article title`, () => {
    cy.get(`h1 + p + p`).should('contain', 'min read')
  });

  it(`should show the "written by" footer`, () => {
    articleFooterShouldBeShown()
  });

  it(`should show the "built with" footer`, () => {
    builtByFooterShouldBeShown()
  });

});
