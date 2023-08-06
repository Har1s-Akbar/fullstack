/// <reference types="cypress"/>

describe("Login test",()=>{
    it('signup is working',()=>{
        cy.viewport(1366,768)
        cy.visit('http://localhost:5173/')
        cy.pause()
      cy.get('button').contains('sign up', {matchCase: false}).click()
      cy.get('#email').type('clashofclans8097@gmail.com')
      cy.get('#password').type('thisisthepassword')
      cy.get('.mt-4').click()
      cy.visit('http://localhost:5173/signin?apiKey=AIzaSyDfwV_oGjrB8Km8r06FFVRNCEmII-lFNKc&oobCode=valACJ2Vr6QA32XYReHu9WwBIuoy0s22-XhFeH9H2ZQAAAGJxwK-vA&mode=signIn&lang=en')
      cy.get('#emailSign').type('clashofclans8097@gmail.com')
      cy.get('#passwordSign').type('thisisthepassword')
      cy.get('.flex > .border-2').click()  
    })
})