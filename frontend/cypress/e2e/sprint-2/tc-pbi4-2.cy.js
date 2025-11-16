describe(`TC-PBI4-1 : DECLARE-PLAN\n
          normal : - test 'Declare' button enable/disable logic`, () => {

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

    it(`[step 0] should visit /reserve.html successfully after signing in.\n`, () => {
    })

    it(`[step 0] should show the fullname "Somyot Meedee" and \n
        should display "'Declaration Status: Not Declared".`,()=>{    
        cy.get('.ecors-fullname').should('exist').and('be.visible').and('contain.text','Somyot Meedee') ;

        cy.get('.ecors-declared-plan').should('exist').and('be.visible')
          .and('contain.text','Not Declared') ;
    })

    it(`[step 0] should have a dropdown to select a study plan and should show drop-down list with 9 study plans.\n
        should not select any plan by default.\n
        should disable the 'Declare' button by default.`,()=>{    
        cy.get('.ecors-dropdown-plan').should('exist').and('be.visible') ;
        cy.get('.ecors-dropdown-plan').trigger('mousedown')
        cy.get('.ecors-plan-row').should('have.length',9) ;

        cy.get('.ecors-plan-row').eq(0).should('contain.text','FE - Frontend Developer') ;
        cy.get('.ecors-plan-row').eq(1).should('contain.text','BE - Backend Developer') ;
        cy.get('.ecors-plan-row').eq(2).should('contain.text','FS - Full-Stack Developer') ;
        cy.get('.ecors-plan-row').eq(3).should('contain.text','AI - AI Developer') ;
        cy.get('.ecors-plan-row').eq(4).should('contain.text','DS - Data Scientist') ;
        cy.get('.ecors-plan-row').eq(5).should('contain.text','DA - Data Analyst') ;
        cy.get('.ecors-plan-row').eq(6).should('contain.text','DE - Data Engineer') ;
        cy.get('.ecors-plan-row').eq(7).should('contain.text','DB - Database Administrator') ;
        cy.get('.ecors-plan-row').eq(8).should('contain.text','UX - UX/UI Designer') ;

        cy.get('.ecors-dropdown-plan').should('contain.text','-- Select Major --'); 
        cy.get('.ecors-button-declare').should('exist').and('be.visible').and('be.disabled') ;
    })

    it(`[step 1] should select a 'DS - Data Scientist' from the dropdown and enable the 'Declare' button\n
        should click 'Declare' button.\n
        should refresh the page and show Declaration Status: Declared DS - Data Scientist plan on {updatedAt} (Asia/Bangkok).\n
        should click the sign out button`,()=>{    
        cy.get('.ecors-dropdown-plan').select('DS - Data Scientist') ;
        cy.get('.ecors-dropdown-plan').should('contain.text','DS - Data Scientist'); 
        cy.get('.ecors-button-declare').should('exist').and('be.visible').and('be.enabled') ;
        cy.get('.ecors-button-declare').click() ;

        cy.visit('/reserve.html') ;
        cy.get('.ecors-declared-plan').should('exist').and('be.visible')
          .and('contain.text','Declared DS - Data Scientist')
          .and('contain.text','(Asia/Bangkok)') ;

        // Click the 'Sign Out' button
        cy.get('.ecors-button-signout').should('exist').and('be.visible').and('contain.text','Sign Out').click() ;
    })
})