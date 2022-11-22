import { myFunctionToCheck } from 'cy-local';

describe('test integration', () => {
  it('should log 3', () => {
    cy.myLog(Cypress.env('COVERAGE'));
    cy.myLog('3');
    myFunctionToCheck();
  });
});
