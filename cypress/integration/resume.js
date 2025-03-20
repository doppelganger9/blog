describe(`The Resume page`, () => {

  beforeEach(() => {
  });

  it(`should be accessible from url /resume`, () => {
    cy.visit('/resume')
    cy.get('h1').should('contain', 'Resume')
  })

  it(`should be accessible from a Home page link`, () => {
    cy.visit('/')
    cy.get('a[href*=resume]').click()
    cy.location('pathname').should('contain', '/resume')
    cy.get('h1').should('contain', 'Resume')
  })

  it(`should have social links`, () => {
    cy.visit('/resume')
    cy.get('a[href*=github]').should('exist')
    cy.get('a[href*=gitlab]').should('exist')
    cy.get('a[href*=stackoverflow]').should('exist')
    cy.get('a[href*=linked]').should('exist')
    cy.get('a[href*=codepen]').should('exist')
    cy.get('a[href*=lacourt.dev]').should('exist')
  })

});