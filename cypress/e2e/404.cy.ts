import { cy, describe, beforeEach, it } from 'local-cypress';
import { builtByFooterShouldBeShown, aBackLinkShouldBeShownTo, titleBarShouldBeShown, force404, 
  interceptGiscusAPI, interceptStatusAPI, visitWithLang } from '../common';

describe(`The 404 page`, () => {
  beforeEach(() => {
    force404(); // for the status indicator
    interceptGiscusAPI();
    interceptStatusAPI(2);
    visitWithLang('/404', 'en-US', { failOnStatusCode: false });
  });

  it(`should show up for unknown URLs`, () => {
    cy.get('h1').contains(/404/i)
  });

  it(`should show have a TUMBLR TARDIS lost in space GIF`, () => {
    cy.get('img[src*="tumblr"]').should('exist')
    cy.get('img[alt*="TARDIS"]').should('exist')
  });

  it(`should have the "built with" footer`, () => {
    builtByFooterShouldBeShown();
  });

  it(`should have the "David's Blog" Title Bar`, () => {
    titleBarShouldBeShown('h3');
  });

  it(`should have a back link to home`, () => {
    aBackLinkShouldBeShownTo('/');
  });
});
