// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="../support" />

import { force404 } from "../common";

describe(`Links & Anchors in blog post markdown titles`, () => {
  beforeEach(() => {
    force404(); // for the status indicator
    cy.interceptGiscusAPI();
    cy.interceptStatusAPI(2);
    cy.visitWithLang('/hello-world', 'en-US')
  });

  it(`should have an <A>nchor`, () => {
    cy.getByDataCy('blog-post-heading').should('contain', `Hello`)
    cy.get('h2 a').should('exist');
  });

  it(`should have an id on heading, the same as the href on the <A>nchor`, () => {
    cy.get('h2#hi-').should('exist');
    cy.get('h2#hi- a[href="#hi-"]').should('exist');
  });

  it(`should have an <A>nchor with aria-hidden for a11y`, () => {
    cy.get('a[href="#hi-"]').should('exist').should("have.attr", "aria-hidden", "true");
  });

  it(`should have an <A>nchor with href with #escaped-name`, () => {
    cy.get('#hi-').find('a').should('exist');
  });

});
