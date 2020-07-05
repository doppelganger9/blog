// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="../support" />
import { titleBarShouldBeShown, builtByFooterShouldBeShown, articleFooterShouldBeShown, aBackLinkShouldBeShownTo } from '../common';

describe(`a blog post`, () => {
  
  it(`should show the title bar in h3`, () => {
    cy.server({force404: true}); // for the status indicator
    cy.visitWithLang('/', 'en-US');
    cy.wait(100); // if we don't wait, Sapper hydration will not work propertly. Yeah, I know, I'd prefer not to.
    cy.get(`a > h3`).last().click();
    titleBarShouldBeShown('h3')
  });

  it(`should have a back link to blog post list/home`, () => {
    aBackLinkShouldBeShownTo('/')
  });

  it(`should show the published date in the first <p> following the <h1> article title`, () => {
    cy.get(`h1 + p`)
      .should('exist')
      .should('contain', '2019')
  });

  it(`should show the time to read in a second <p> following the <h1> article title`, () => {
    cy.get(`h1 + p + p`).should('contain', 'min read')
  });

  it(`should show the "written by" footer`, () => {
    articleFooterShouldBeShown()
  });

  it(`should show the "built with" footer`, () => {
    builtByFooterShouldBeShown()
  });

});
