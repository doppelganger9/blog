// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="../support" />
import { jamStackFrameworkName, mainFrameworkName, mainFrameworkURL, jamStackFrameworkURL, force404 } from '../common';

describe('has a footer', () => {
  beforeEach(() => {
    force404(); // for the status indicator
    cy.visitWithLang('/', 'en-US')
  });

  it('shows a copyright year', () => {
    cy.get('footer')
      .should('contain', new Date().getFullYear())
  });
  it('shows a link to ' + mainFrameworkName, () => {
    cy.get('footer')
      .get(`a[href*='${mainFrameworkURL}']`)
      .should('contain', mainFrameworkName)
  });
  it('shows a link to ' + jamStackFrameworkName, () => {
    cy.get('footer')
      .get(`a[href*='${jamStackFrameworkURL}']`)
      .should('contain', jamStackFrameworkName)
  });
  it('shows a link to Privacy Policy', () => {
    cy.get('footer')
      .get(`a[href*='privacy-policy']`)
      .should('contain', 'Privacy Policy')
  });

  it('can link to Privacy Policy', () => {
    cy.get('footer')
      .get(`a[href*='privacy-policy']`)
      .click()
    cy.location('pathname').should('contain', '/privacy-policy')
    cy.get('h1').should('contain', 'Privacy Policy')
  });

});
