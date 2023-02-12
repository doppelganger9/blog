import { cy, describe, beforeEach, it } from 'local-cypress';
import { force404, interceptGiscusAPI, interceptStatusAPI, visitWithLang, getByDataCy } from '../common';

describe(`Links & Anchors in blog post markdown titles`, () => {
  beforeEach(() => {
    force404(); // for the status indicator
    interceptGiscusAPI();
    interceptStatusAPI(2);
    visitWithLang('/hello-world', 'en-US')
  });

  it(`should have an <A>nchor`, () => {
    getByDataCy('blog-post-heading').should('contain', `Hello`)
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
