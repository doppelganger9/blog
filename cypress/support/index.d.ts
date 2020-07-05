declare namespace Cypress {
    interface Chainable<Subject> {
      /**
       * get an element targetting its `data-cy` attribute, as recommended by Cypress best practices.
       * 
       * @example
       * cy.getByDataCy('main-heading')
       * 
       * @see 
       * https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements
       */
      getByDataCy(): Chainable<any>;

      /**
       * Override window.navigator.language to return some value.
       * 
       * @param target url to visit
       * @param lang language to return when window.navigator.language is called
       * @param options cy.visit() options
       */
      visitWithLang(target: string, lang: string, options = {}): Chainable<any>;
    }
  }
  