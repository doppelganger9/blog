// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
/// <reference types="../support" />
let marked = require('marked');

describe(`Links & Anchors in blog post markdown titles`, () => {

  let renderer = new marked.Renderer();

  beforeEach(() => {
    // Override function
    renderer.heading = function (text, level) {
      var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

      return `
          <h${level}>
            <a name="${escapedText}" aria-hidden="true" class="anchor" href="#${escapedText}">
              <span class="header-link"></span>
            </a>
            ${text}
          </h${level}>`;
    };
  });

  it(`should have an <A>nchor`, () => {
    expect(marked('# heading+', { renderer: renderer })).to.contain('<a');
  });

  it(`should have a named <A>nchor, the name is escaped`, () => {
    expect(marked('# escaped name', { renderer: renderer })).to.contain('name="escaped-name"');
  });

  it(`should have an <A>nchor with aria-hidden for a11y`, () => {
    expect(marked('# escaped name', { renderer: renderer })).to.contain('aria-hidden="true"');
  });

  it(`should have an <A>nchor with href with #escaped-name`, () => {
    expect(marked('# escaped name', { renderer: renderer })).to.contain('href="#escaped-name"');
  });

});
