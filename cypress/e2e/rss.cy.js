// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="../support" />

import { force404 } from "../common";

describe(`RSS feed endpoint`, () => {

  beforeEach(() => {
    force404(); // for the status indicator
    cy.request('/rss').as('rss');
  });

  it(`should return HTTP 200 OK`, () => {
    cy.get('@rss').should((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it(`should return application/rss+xml content type`, () => {
    cy.get('@rss').should((response) => {
      expect(response).to.have.property('headers');

      expect(response.headers['content-type']).to.eq('application/rss+xml');
    });
  });

  it(`should contain at least one <item>`, () => {
    cy.get('@rss').should((response) => {
      expect(response).to.have.property('body');

      expect(response.body).to.contain('<item>');
    });
  });

});
