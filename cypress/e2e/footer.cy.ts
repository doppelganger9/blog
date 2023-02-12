import { cy, describe, beforeEach, it } from 'local-cypress';
import { force404, interceptGiscusAPI, interceptStatusAPI, visitWithLang, 
  mainFrameworkName, mainFrameworkURL, jamStackFrameworkName, jamStackFrameworkURL } from '../common';

describe('has a footer', () => {
  beforeEach(() => {
    force404(); // for the status indicator
    interceptGiscusAPI();
    interceptStatusAPI(2);
    visitWithLang('/', 'en-US')
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
