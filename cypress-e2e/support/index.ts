import { myPluginSetup } from 'cy-local';

if (Cypress.env('COVERAGE') === 'true') {
  console.log('ENABLE COV');
  require('@cypress/code-coverage/support');
} else {
  console.log('COVERAGE NOT ENABLED IN BROWSER');
}

myPluginSetup();
