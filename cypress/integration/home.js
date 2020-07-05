// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="../support" />
import { articleFooterShouldBeShown, builtByFooterShouldBeShown } from '../common';

describe(`David's Blog app`, () => {
  beforeEach(() => {
    cy.server({force404: true}); // for the status indicator
    cy.visitWithLang('/', 'en-US')
  });

  it('has the correct <h1>', () => {
    cy.get('h1').should('contain', `David's Blog`)
  });

  it('show blog posts list as home with at least 4 posts', () => {
    cy.get('div').find('h3').its('length').should('be.gt', 4)
  });

  it('shows the Article Footer', () => {
    articleFooterShouldBeShown();
  })

  it('shows the built with footer', () => {
    builtByFooterShouldBeShown();
  })

  // it('navigates to /about', () => {
  //   cy.get('nav a').contains('about').click();
  //   cy.url().should('include', '/about');
  // });

  // it('navigates to /blog', () => {
  //   cy.get('nav a').contains('blog').click();
  //   cy.url().should('include', '/blog');
  // });
});
