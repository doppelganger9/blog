const configuredJamStack = Cypress.env('BLOG_JAMSTACK') || 'gatsby';

console.log(configuredJamStack);
let stack =
  (configuredJamStack === 'gatsby') ? {
    mainFrameworkName: 'React',
    mainFrameworkURL: 'https://reactjs.org',
    jamStackFrameworkName: 'Gatsby',
    jamStackFrameworkURL: 'https://www.gatsbyjs.org',
  } : {
    mainFrameworkURL: 'https://svelte.dev',
    mainFrameworkName: 'Svelte',
    jamStackFrameworkName: 'SvelteKit',
    jamStackFrameworkURL: 'https://kit.svelte.dev',
    }
export const mainFrameworkName = stack.mainFrameworkName;
export const mainFrameworkURL = stack.mainFrameworkURL;
export const jamStackFrameworkName = stack.jamStackFrameworkName;
export const jamStackFrameworkURL = stack.jamStackFrameworkURL;
export const bundlerName = 'Webpack';

export function articleFooterShouldBeShown() {
  cy.get('p').should('contain', 'building things with code')
}

export function builtByFooterShouldBeShown() {
  cy.get('footer').should('contain', jamStackFrameworkName)
}

export function aBackLinkShouldBeShownTo(target = '/') {
  cy.get(`a[href='${target}']`).should('exist')
}

export function titleBarShouldBeShown(level = 'h1') {
  cy.get(level).should('contain', `David's Blog`)
}

// see https://glebbahmutov.com/blog/cypress-intercept-problems/#force404
export function force404() {
  // define "regular" intercept stubs, make sure they respond
  // now let's stop all other Ajax application/json requests
  cy.intercept({
    headers: {
      accept: 'application/json'
    }
  }, {
    statusCode: 404
  });
}