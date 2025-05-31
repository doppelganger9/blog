import { cy, describe, beforeEach, it } from 'local-cypress';
import { builtByFooterShouldBeShown, force404, 
  interceptGiscusAPI, interceptStatusAPI, visitWithLang, articleFooterShouldBeShown } from '../common';

describe(`Privacy Policy page`, () => {
  beforeEach(() => {
    force404(); // for the status indicator
    interceptGiscusAPI();
    interceptStatusAPI(2);
    visitWithLang('/privacy-policy', 'en-US')
  })

  it(`should have the proper title`, () => {
    cy.location('pathname').should('contain', '/privacy-policy')
    cy.get('h1').should('contain', 'Privacy Policy')
  })

  it(`should have the cookie monster gif`, () => {
    cy.get(`img[src*='cookiemonster']`).should('exist')
    cy.get(`img[alt*='Cookie Monster']`).should('exist')
  })

  it(`should have a mailto link`, () => {
    cy.get(`a[href*='mailto:']`)
      .should('exist')
  })

  it(`should have a back link`, () => {
    cy.get(`a[href='/']`).should('exist')
  })

  it(`should show the Article Footer`, () => {
    articleFooterShouldBeShown();
  })

  it(`should show Built-by footer`, () => {
    builtByFooterShouldBeShown();
  })

})

