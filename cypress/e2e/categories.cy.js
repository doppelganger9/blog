// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="../support" />
import { force404 } from '../common';

describe(`David's Blog app`, () => {
  beforeEach(() => {
    force404(); // for the status indicator
    cy.visitWithLang('/', 'en-US')
  });

  it('show blog post categories with at least 4 categories', () => {
    cy.get('[data-cy=categories]').find('li').its('length').should('be.gt', 4)
  });

  it('clicking on a category filters the posts list', () => {
    cy.get('div').find('h3').contains('On being a dad').should('exist');
    cy.get('[data-cy=categories]').contains('Gaming').click();
    cy.get('div').find('h3').contains('On being a dad').should('not.exist');
  })

  it('clicking on an empty category shows sad face', () => {
    cy.get('.no-results').should('not.exist');
    cy.get('[data-cy=categories]').contains('Music').click();
    cy.get('.no-results').should('exist');
  })
});
