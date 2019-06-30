describe(`Netlify CMS feature`, () => {

  beforeEach(() => {
    cy.request('/admin').as('admin');
    cy.request('/config.yml').as('admin-config');
  });

  it(`should return HTTP 200 OK`, () => {
    cy.get('@admin').should((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it(`should return text/html content type`, () => {
    cy.get('@admin').should((response) => {
      expect(response).to.have.property('headers');

      expect(response.headers['content-type']).to.eq('text/html');
    });
  });

  it(`should contain at least one <script> with netlify-cms in the src`, () => {
    cy.get('@admin').should((response) => {
      expect(response).to.have.property('body');

      expect(response.body).to.contain('<script');
      expect(response.body).to.match(/script src=".+netlify-cms.js"\>\<\/script\>/);
    });
  });

  it(`should contain at least one <script> with netlify-cms in the src`, () => {
    cy.visit('/admin');
    cy.get('script[src*="netlify-cms.js"]').should('exist');
  });

  it(`should have a config.yml file returning HTTP 200 OK`, () => {
    cy.get('@admin-config').should((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it(`should have a config.yml file returning text/yaml content type`, () => {
    cy.get('@admin-config').should((response) => {
      expect(response).to.have.property('headers');
      expect(response.headers['content-type']).to.eq('text/yaml');
    });
  });


});
