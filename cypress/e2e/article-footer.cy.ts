// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="../support" />
import { aBackLinkShouldBeShownTo, force404 } from '../common';

describe(`The "Article Footer"`, () => {
  const articleFooterSelector = 'p';
  //const articleFooterSelector = '.article-footer';
  beforeEach(() => {
    force404(); // for the status indicator
    cy.interceptGiscusAPI();
    cy.interceptStatusAPI(2);
    cy.visitWithLang('/', 'en-US')
  });

  // it(`has David's profile picture`, () => {
  //   cy.get(`${articleFooterSelector} img`)
  //     .should('have.attr', 'src')
  //     .and('include', 'profile-pic.png');
  // });

  it(`has David's name in it`, () => {
    cy.get(`${articleFooterSelector}`)
      .should('contain', 'David Lacourt')
  });

  if (`has a back link to the list of posts`, () => {
    aBackLinkShouldBeShownTo('/blog')
  });

  it('has a link to Senlis Wikipedia page', () => {
    cy.get(`${articleFooterSelector} a[href='https://en.wikipedia.org/wiki/Senlis']`)
      .should('exist')
  });

  it(`has a link to David's Twitter profile page`, () => {
    cy.get(`${articleFooterSelector} a[href='https://twitter.com/doppelganger9']`)
      .should('exist')
  });

  it(`has a link to David's GitHub profile page`, () => {
    cy.get(`${articleFooterSelector} a[href='https://github.com/doppelganger9/']`)
      .should('exist')
  });

  it(`has a link to David's Codepen profile page`, () => {
    cy.get(`${articleFooterSelector} a[href='https://codepen.io/doppelganger9/']`)
      .should('exist')
  });

  it(`has a link to David's DEV profile page`, () => {
    cy.get(`${articleFooterSelector} a[href='https://dev.to/doppelganger9']`)
      .should('exist')
  });

  it(`has a link to David's LinkedIn profile page`, () => {
    cy.get(`${articleFooterSelector} a[href='https://www.linkedin.com/in/davidlacourt/']`)
      .should('exist')
  });

  it(`has a link to StackOverflow profile page`, () => {
    cy.get(`${articleFooterSelector} a[href='https://stackoverflow.com/users/526660/doppelganger9']`)
      .should('exist')
  });

  it(`has a link to David's GitLab profile page`, () => {
    cy.get(`${articleFooterSelector} a[href='https://gitlab.com/davidlacourt']`)
      .should('exist')
  });

  it(`has a link to David's Facebook profile page`, () => {
    cy.get(`${articleFooterSelector} a[href='https://www.facebook.com/david.lacourt']`)
      .should('exist')
  });
});
