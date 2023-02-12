import { cy, describe, beforeEach, it } from 'local-cypress';
import { force404, interceptGiscusAPI, interceptStatusAPI, visitWithLang } from '../common';

// TODO
// when browser locale is fr-FR,
//    some labels should be french (title, footer, etc.)
//    the Lang switcher should be set on french
// when browser locale is en-US
//    some labels should be english (title, footer, etc.)
//    the Lang switcher should be set on english
// when toggling the Lang with the switch, labels should change.
// filtering posts by Lang?

describe(`i18n`, () => {

  describe(`Given the browser's language is 🇫🇷`, () => {
    beforeEach(() => {
      force404(); // for the status indicator
      interceptGiscusAPI();
      interceptStatusAPI(2);  
      visitWithLang('/', 'fr-FR');
    });
    it(`when viewing the home page, then the title bar is in 🇫🇷`, () => {
      cy
        .get(`[data-cy="title-bar"]`)
        .should('exist')
        .should('contain', 'Le Blog de David');
      cy.get('@language').should('have.been.calledOnce');
    });

    it(`when viewing the home page, then the footer is in 🇫🇷`, () => {
      cy
        .get(`[data-cy="footer"]`)
        .should('exist')
        .should('contain', 'construit avec');
      cy.get('@language').should('have.been.calledOnce');
    });

    it(`when viewing the home page, then the article footer is in 🇫🇷`, () => {
      cy.get(`[data-cy='article-footer']`)
        .should('exist')
        .should('contain', 'construire des choses avec du code')
      cy.get('@language').should('have.been.calledOnce');
    });

    it(`when viewing the home page, then a button to switch to 🇺🇸 should be visible`, () => {
      cy.get(`[data-cy=switch-lang-button]`)
        .should('exist')
        .should('be.visible')
        .should('contain', '🇫🇷 ➡️ 🇺🇸');
    });

  });

  describe(`Given the browser's language is 🇺🇸`, () => {
    beforeEach(() => {
      force404(); // for the status indicator
      visitWithLang('/', 'en-US');
    });
    it(`when viewing the home page, then the title bar is in 🇺🇸`, () => {
      cy
        .get(`[data-cy="title-bar"]`)
        .should('exist')
        .should('contain', `David's Blog`)
      cy.get('@language').should('have.been.calledOnce');
    });

    it(`when viewing the home page, then the footer is in 🇺🇸`, () => {
      cy
        .get(`[data-cy="footer"]`)
        .should('exist')
        .should('contain', 'built with')
      cy.get('@language').should('have.been.calledOnce');
    });

    it(`when viewing the home page, then the article footer is in 🇺🇸`, () => {
      cy.get(`[data-cy='article-footer']`)
        .should('exist')
        .should('contain', 'building things with code')
      cy.get('@language').should('have.been.calledOnce');
    });

    it(`when viewing the home page, then a button to switch to 🇫🇷 should be visible`, () => {
      cy.get(`[data-cy=switch-lang-button]`)
        .should('exist')
        .should('be.visible')
        .should('contain', '🇺🇸 ➡️ 🇫🇷');
    });
  });
});
