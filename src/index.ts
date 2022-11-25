export const something = ()=> {
  cy.window().then(t=> {
    console.log('log in console after got win')
  })
}