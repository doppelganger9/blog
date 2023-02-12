// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="../support" />
import { articleFooterShouldBeShown, builtByFooterShouldBeShown, force404 } from '../common';

describe(`Privacy Policy page`, () => {
  beforeEach(() => {
    force404(); // for the status indicator
    cy.interceptGiscusAPI();
    cy.interceptStatusAPI(2);
    cy.visitWithLang('/privacy-policy', 'en-US')
  })

  it(`should have the proper title`, () => {
    cy.location('pathname').should('contain', '/privacy-policy')
    cy.get('h1').should('contain', 'Privacy Policy')
  })

  it(`should have the cookie monster gif`, () => {
    cy.get(`img[src*='cookiemonster']`).should('exist')
    cy.get(`img[alt*='Cookie Monster']`).should('exist')
  })

  it(`should have a maitlo link`, () => {
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

