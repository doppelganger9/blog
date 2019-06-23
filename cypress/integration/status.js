const statusPageURL = 'status.lacourt.dev';

describe(`The Status component`, () => {

  it(`should be present in the footer`, () => {
    cy.visit('/');
    footerStatusAnchor(cy)
      .should('exist');
  });

  it(`should redirect to the status page`, () => {
    cy.visit('/');
    footerStatusAnchor(cy).click();
    cy.location('host').should('contain', statusPageURL);
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

  it(`should have a 'down" indicator when the status API returns status 9`, () => {
    givenAPIReturnStatus(9);
    visitAndShouldShowWaiting();
    waitForAPIToLoadAndAssertHasClass('down');
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
