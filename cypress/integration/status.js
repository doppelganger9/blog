// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="../support" />
const statusPageURL = 'https://stats.uptimerobot.com/ZYDp0hJL8';

describe(`The Status component`, () => {

  it(`should be present in the footer`, () => {
    cy.visit('/');
    footerStatusAnchor(cy)
      .should('exist');
  });

  it(`should have a link to redirect to the public UPTIME Robot status page`, () => {
    cy.visit('/');
    footerStatusAnchor(cy)
      .should('have.attr', 'href', statusPageURL);
  });

  it(`should first show a waiting indicatorbefore the API returns its response`, () => {
    givenAPIReturnStatus(2);

    cy.visit('/');
    footerStatusAnchor(cy).should('have.class', 'waiting');

    cy.wait('@mocked-uptime-getMonitors-API');
    footerStatusAnchor(cy).should('not.have.class', 'waiting');
  });

  it(`should have a 'paused' indicator when the status API returns status 0`, () => {
    givenAPIReturnStatus(0);
    visitAndShouldShowWaiting();
    waitForAPIToLoadAndAssertHasClass('paused');
  });

  it(`should have a 'not_checked_yet' indicator when the status API returns status 1`, () => {
    givenAPIReturnStatus(1);
    visitAndShouldShowWaiting();
    waitForAPIToLoadAndAssertHasClass('not_checked_yet');
  });

  it(`should have a 'up' indicator when the status API returns status 2`, () => {
    givenAPIReturnStatus(2);
    visitAndShouldShowWaiting();
    waitForAPIToLoadAndAssertHasClass('up');
  });

  it(`should have a 'seems_down' indicator when the status API returns status 8`, () => {
    givenAPIReturnStatus(8);
    visitAndShouldShowWaiting();
    waitForAPIToLoadAndAssertHasClass('seems_down');
  });

  it(`should have a 'down' indicator when the status API returns status 9`, () => {
    givenAPIReturnStatus(9);
    visitAndShouldShowWaiting();
    waitForAPIToLoadAndAssertHasClass('down');
  });

  it(`should have a 'api-404' indicator when the status API returns HTTP 404`, () => {
    givenAPIReturnHTTPStatus(404, 'Not found');
    visitAndShouldShowWaiting();
    waitForAPIToLoadAndAssertHasClass('api-404');
  });

  it(`should have a 'api-500' indicator when the status API returns HTTP 500`, () => {
    givenAPIReturnHTTPStatus(500, 'Server error');
    visitAndShouldShowWaiting();
    waitForAPIToLoadAndAssertHasClass('api-500');
  });

  function givenAPIReturnStatus(status) {
    cy.server();
    cy.route({
      method: 'POST',
      url: `https://api.uptimerobot.com/v2/getMonitors`,
      response: {
        monitors: [
          {
            url: 'https://lacourt.dev',
            friendly_name: 'Lacourt.dev',
            status,
          }
        ]
      }
    }).as('mocked-uptime-getMonitors-API');
  }

  function givenAPIReturnHTTPStatus(status, message = undefined) {
    cy.server();
    cy.route({
      method: 'POST',
      url: `https://api.uptimerobot.com/v2/getMonitors`,
      status,
      ...(message && { response: message})
    }).as('mocked-uptime-getMonitors-API');
  }

  function visitAndShouldShowWaiting() {
    cy.visit('/');
    footerStatusAnchor(cy).should('have.class', 'waiting');
  }

  function waitForAPIToLoadAndAssertHasClass(className) {
    cy.wait('@mocked-uptime-getMonitors-API');
    footerStatusAnchor(cy).should('have.class', className);;
  }

  function footerStatusAnchor(cy) {
    return cy
      .get('footer')
      .get(`[data-cy="status-indicator"]`);
  }

});
