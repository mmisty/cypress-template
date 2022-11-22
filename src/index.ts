// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./cypress/cypress.ts" />

// here export only function to run in browser
export { myPluginSetup } from './setup';

export const myFunctionToCheck = () => {
  console.log('myFunctionToCheck');
};
