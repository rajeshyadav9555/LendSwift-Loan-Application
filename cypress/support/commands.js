Cypress.Commands.add('fillStep1', (loanType, amount, tenure, purpose) => {
  cy.get(`input[value="${loanType}"]`).check({force:true});
  cy.get('#loanAmount').clear().type(String(amount));
  cy.get('#loanTenure').select(String(tenure));
  cy.get('#loanPurpose').select(purpose);
});
Cypress.Commands.add('nextStep', () => cy.get('button').contains('Continue').click());
Cypress.Commands.add('submitApp', () => cy.get('button').contains('Submit application').click());
