import { cy, describe, beforeEach, it } from 'local-cypress';
import { builtByFooterShouldBeShown, force404, 
  interceptGiscusAPI, interceptStatusAPI, visitWithLang, articleFooterShouldBeShown } from '../common';

describe(`David's Blog app`, () => {
  beforeEach(() => {
    force404(); // for the status indicator
    interceptGiscusAPI();
    interceptStatusAPI(2);
    visitWithLang('/', 'en-US')
  });

  it('has the correct <h1>', () => {
    cy.get('h1').should('contain', `David's Blog`)
  });

  it('show blog posts list as home with at least 4 posts', () => {
    cy.get('div').find('h3').its('length').should('be.gt', 4)
  });

  it('show blog post categories with at least 8 categories', () => {
    cy.get('[data-cy=categories]').find('li').its('length').should('be.gte', 8)
  });

  it('shows the Article Footer', () => {
    articleFooterShouldBeShown();
  })

  it('shows the built with footer', () => {
    builtByFooterShouldBeShown();
  })
});
