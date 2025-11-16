describe(`TC-PBI3-2 : VIEW-DECLARED PLAN\n
          normal : - no declaration`, () => {

    let resource = '/'  
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit('/reserve.html')

        cy.origin('https://bscit.sit.kmutt.ac.th/', () => {
            cy.get('input#username').should('exist').and('be.visible') ;
            cy.get('input#password').should('exist').and('be.visible') ;

            cy.get('input#username').type('67130500142') ;
            cy.get('input#password').type('itbangmod') ;
            
            // Click the 'Sign In' button
            cy.get('#kc-login').click() ;
        }) ;
    }) ;

    it(`[step 1] should visit /reserve.html successfully after signing in.\n`, () => {
    })

    it(`[step 2] should show the fullname "Somyot Meedee" and \n
        should display "'Declaration Status: Not Declared".`,()=>{    
        cy.get('.ecors-fullname').should('exist').and('be.visible').and('contain.text','Somyot Meedee') ;

        cy.get('.ecors-declared-plan').should('exist').and('be.visible')
          .and('contain.text','Not Declared') ;
    })
})