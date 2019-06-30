describe(`Static uploads directory`, () => {

  beforeEach(() => {
    cy.request('/uploads/hello.txt').as('uploads');
  });

  it(`should return HTTP 200 OK`, () => {
    cy.get('@uploads').should((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it(`should return text/plain content type`, () => {
    cy.get('@uploads').should((response) => {
      expect(response).to.have.property('headers');

      expect(response.headers['content-type']).to.eq('text/plain');
    });
  });

  it(`should contain 'world'`, () => {
    cy.get('@uploads').should((response) => {
      expect(response).to.have.property('headers');

      expect(response.body).to.contain('world');
    });
  });

});
