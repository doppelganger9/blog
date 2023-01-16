// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="../support" />
import { titleBarShouldBeShown, builtByFooterShouldBeShown, articleFooterShouldBeShown, aBackLinkShouldBeShownTo, force404 } from '../common';

describe(`a blog post`, () => {
  beforeEach(() => {
    force404(); // for the status indicator
    cy.visitWithLang('/', 'en-US');
    cy.wait(100); // if we don't wait, SvelteKit hydration will not work propertly. Yeah, I know, I'd prefer not to.
    cy.get(`a > h3`).last().click();
  });

  it(`should show the title bar in h3`, () => {
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

  it(`should have replaced all emojis with Twemojis in the content`, () => {
    cy.get('.emoji').first().should('have.attr', 'src')
      .should('include', 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg');
  })

  it(`should have links and ids on Level 2 headings`, () => {
    cy.get('[data-cy=blog-post-content] h2').should('have.attr', 'id').get('a').should('have.attr', 'href');
  })

  it(`should have links and ids on Level 3 headings`, () => {
    cy.get('[data-cy=blog-post-content] h3').should('have.attr', 'id').get('a').should('have.attr', 'href');
  })

  it(`should have links and ids on Level 4 headings`, () => {
    cy.get('[data-cy=blog-post-content] h4').should('have.attr', 'id').get('a').should('have.attr', 'href');
  })

  it(`should have a giscus frame for comments`, () => {
    cy.get('.giscus-frame').should('exist');
  })
});
