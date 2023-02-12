/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("visitWithLang", (target: string, lang: string, options?: any): Cypress.Chainable => {
  return cy.visit(target, {
    ...options,
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'language',
        {
          get: cy
            .stub()
            .returns(lang)
            .as('language')
        }
      );
    },
  });
})

Cypress.Commands.add("getByDataCy", (selector: string): Cypress.Chainable => {
  return cy.get(`[data-cy='${selector}']`)
})

Cypress.Commands.add("interceptStatusAPI", (status: number) => {
  return cy.intercept(
    'POST',
    `https://api.uptimerobot.com/v2/getMonitors`,
    {
      monitors: [
        {
          url: 'https://lacourt.dev',
          friendly_name: 'Lacourt.dev',
          status,
        }
      ]
    }
  ).as('mocked-uptime-getMonitors-API');
});

Cypress.Commands.add("interceptGiscusAPI", () => {
  return cy.intercept(
    'GET',
    `https://giscus.app/api/discussions`,
    (req) => {
      req.reply(res => {
        res.statusCode = 404;
        res.body = 'Giscus Discussions blocked';
      })
  }).as('mocked-giscus-getDiscussions-API');
});
