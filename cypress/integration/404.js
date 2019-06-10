import { builtByFooterShouldBeShown, aBackLinkShouldBeShownTo, titleBarShouldBeShown } from '../common';

describe(`The 404 page`, () => {

  beforeEach(() => {
    cy.visit('/404', { failOnStatusCode: false })
  });

  it(`should show up for unknown URLs`, () => {
    cy.get('h1').contains(/Not Found/i)
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
