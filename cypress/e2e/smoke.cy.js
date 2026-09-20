describe('LendSwift loan application', () => {
  it('loads the first step and validates required loan type', () => {
    cy.visit('/');
    cy.contains('What loan are you applying for?').should('be.visible');
    cy.contains('Continue').click();
    cy.contains('Select a loan type.').should('be.visible');
  });

  it('moves from loan selection to personal information', () => {
    cy.visit('/');
    cy.fillStep1('personal', 500000, 24, 'Travel');
    cy.nextStep();
    cy.contains('Personal information').should('be.visible');
  });
});
