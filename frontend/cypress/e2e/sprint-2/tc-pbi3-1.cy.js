describe(`TC-PBI3-1 : VIEW-DECLARED PLAN\n
          normal : - has declartion\n
                   - use local timestamp`, () => {

    let resource = '/'  
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit('/reserve.html')

        cy.origin('https://bscit.sit.kmutt.ac.th/', () => {
            cy.get('input#username').should('exist').and('be.visible') ;
            cy.get('input#password').should('exist').and('be.visible') ;

            cy.get('input#username').type('67130500140') ;
            cy.get('input#password').type('itbangmod') ;
            
            // Click the 'Sign In' button
            cy.get('#kc-login').click() ;
        }) ;
    }) ;

    it(`[step 1] should visit /reserve.html successfully after signing in.\n`, () => {
    })

    it(`[step 2] should show the fullname "Somchai Jaidee" and \n
        should display "'Declaration Status: Declared FS - Full-Stack Developer plan on 11/11/2025, 00:18:19 (Asia/Bangkok)".`,()=>{    
        cy.get('.ecors-fullname').should('exist').and('be.visible').and('contain.text','Somchai Jaidee') ;

        cy.get('.ecors-declared-plan').should('exist').and('be.visible')
          .and('contain.text','Declared FS - Full-Stack Developer on 11/11/2025, 00:18:19 (Asia/Bangkok)') ;
    })

    it(`[step 3] show display "Declaration Status: Declared FS - Full-Stack Developer plan on 10/11/2025, 17:18:19 (Europe/London)"\n
         when changing the brower's location to "London".`,()=>{    
        cy.setTimezone("Europe/London") 
        cy.visit('/reserve.html') ;

        cy.get('.ecors-declared-plan').should('exist').and('be.visible')
            .and('contain.text','Declared FS - Full-Stack Developer on 10/11/2025, 17:18:19 (Europe/London)') ;

        // Click the 'Sign Out' button
        cy.get('.ecors-button-signout').should('exist').and('be.visible').and('contain.text','Sign Out').click() ;
    })

    it(`[step 4] should change the browser's location back to "Asia/Bangkok" and should sign out successfully.`,()=>{    
        cy.setTimezone("Asia/Bangkok") 

        // Click the 'Sign Out' button
        cy.get('.ecors-button-signout').should('exist').and('be.visible').and('contain.text','Sign Out').click() ;
    })
})