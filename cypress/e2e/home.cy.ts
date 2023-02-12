// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="../support" />
import { articleFooterShouldBeShown, builtByFooterShouldBeShown, force404 } from '../common';

describe(`David's Blog app`, () => {
  beforeEach(() => {
    force404(); // for the status indicator
    cy.interceptGiscusAPI();
    cy.interceptStatusAPI(2);
    cy.visitWithLang('/', 'en-US')
  });

  it('has the correct <h1>', () => {
    cy.get('h1').should('contain', `David's Blog`)
  });

  it('show blog posts list as home with at least 4 posts', () => {
    cy.get('div').find('h3').its('length').should('be.gt', 4)
  });

  it('show blog post categories with at least 8 categories', () => {
    cy.get('[data-cy=categories]').find('li').its('length').should('be.gte', 8)
  });

  it('shows the Article Footer', () => {
    articleFooterShouldBeShown();
  })

  it('shows the built with footer', () => {
    builtByFooterShouldBeShown();
  })
});
