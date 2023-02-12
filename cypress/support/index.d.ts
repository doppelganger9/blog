declare namespace Cypress {
  interface Chainable {
    /**
     * get an element targetting its `data-cy` attribute, as recommended by Cypress best practices.
     * 
     * @example
     * cy.getByDataCy('main-heading')
     * 
     * @see 
     * https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements
     */
    getByDataCy(selector: string): Chainable;

    /**
     * Override window.navigator.language to return some value.
     * 
     * @param target url to visit
     * @param lang language to return when window.navigator.language is called
     * @param options cy.visit() options
     */
    visitWithLang(target: string, lang: string, options?: any): Chainable;

    /**
     * Intercept and mock the Status API
     * 
     * @param status fake status to return
     */
    interceptStatusAPI(status: number): Chainable;

    interceptGiscusAPI(): Chainable;
  }
}