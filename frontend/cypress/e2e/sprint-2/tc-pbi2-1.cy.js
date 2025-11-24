describe(`TC-PBI2-1 : SIGN-IN-AND-OUT-WITH-EXTERNAL-SERVICE\n
          normal : - successful sign-in\n
                   - SSO\n
                   - successful sign-out`, () => {

    let resource = '/'  
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(()=> {
        cy.visit(resource) ;
        cy.wait(100) ;
    }) ;

    it("[step 1] The page should have the button 'Manage study plan declaration and course reservation'.", () => {
        cy.get('.ecors-button-manage').should('exist').and('be.visible').and('contain.text','Manage study plan declaration and course reservation')
    })

    it('[step 2] should click the button "Manage ...". FE should redirect to ./reserve.html, which then redirect automatically to ITB-ECoRS Authentication System.',()=>{
        cy.get('.ecors-button-manage').click() ;
        // cy.url().should('include','/reserve.html') ;

        // Redirect to SSO login page   
        cy.url().should('include','/keycloak/realms/itb-ecors/protocol/openid-connect/auth') ;
    })

    it(`[step 3] should fill in valid credentials and be able to sign in successfully.\n
        should show the fullname and the button 'Sign Out'.`,()=>{    
        cy.get('.ecors-button-manage').click() ;    

        // Redirect to SSO login page   
        cy.url().should('include','/keycloak/realms/itb-ecors/protocol/openid-connect/auth') ;  
        cy.wait(200) ;

        // Fill in username and password
        cy.origin('https://bscit.sit.kmutt.ac.th/', () => {
            cy.get('input#username').should('exist').and('be.visible') ;
            cy.get('input#password').should('exist').and('be.visible') ;

            cy.get('input#username').type('67130500141') ;
            cy.get('input#password').type('itbangmod') ;
            
            // Click the 'Sign In' button
            cy.get('#kc-login').click() ;
        }) ;

        // After successful login, it should redirect back to the reserve page
        cy.url().should('include','/reserve.html') ;

        cy.get('.ecors-fullname').should('exist').and('be.visible').and('contain.text','Somsuan Sukjai') ;
        cy.get('.ecors-button-signout').should('exist').and('be.visible').and('contain.text','Sign Out') ;

        // Verify that the user is logged in by checking for an element that only appears when logged in
        cy.contains('Declaration Status').should('exist') ;

        cy.visit('/reserve.html') ;
        cy.wait(100) ;
    })

    it(`[step 4] should visit the page reserve.html without signing in again.`,()=>{    
        cy.get('.ecors-button-manage').click() ;

        // Redirect to SSO login page   
        cy.url().should('include','/keycloak/realms/itb-ecors/protocol/openid-connect/auth') ;  
        cy.wait(200) ;

        // Fill in username and password
        cy.origin('https://bscit.sit.kmutt.ac.th/', () => {
            cy.get('input#username').should('exist').and('be.visible') ;
            cy.get('input#password').should('exist').and('be.visible') ;

            cy.get('input#username').type(' 67130500141') ;
            cy.get('input#password').type('itbangmod') ;
            
            // Click the 'Sign In' button
            cy.get('#kc-login').click() ;
        }) ;

        cy.visit('/reserve.html') ;
        cy.wait(100) ;
    })

    it(`[step 5] should sign out successfully when clicking the 'Sign Out' button.\n
        FE should redirect to home page with study plan table`,()=>{    
        cy.get('.ecors-button-manage').click() ;

        // Redirect to SSO login page   
        cy.url().should('include','/keycloak/realms/itb-ecors/protocol/openid-connect/auth') ;  
        cy.wait(200) ;

        // Fill in username and password
        cy.origin('https://bscit.sit.kmutt.ac.th/', () => {
            cy.get('input#username').should('exist').and('be.visible') ;
            cy.get('input#password').should('exist').and('be.visible') ;

            cy.get('input#username').type(' 67130500141') ;
            cy.get('input#password').type('itbangmod') ;
            
            // Click the 'Sign In' button
            cy.get('#kc-login').click() ;
        }) ;

        cy.visit('/reserve.html') ;
        cy.wait(100) ;

        // Click the 'Sign Out' button
        cy.get('.ecors-button-signout').should('exist').and('be.visible').and('contain.text','Sign Out').click() ;

        // After sign out, it should redirect to home page
        cy.url({ timeout: 500 }).should('eq', Cypress.config().baseUrl) ;
        
        // The home page should have the study plan table
        cy.contains('th','ID')
        cy.contains('th','Study Code')
        cy.contains('th','English Name')
        cy.contains('th','Thai Name')

        cy.get('.ecors-row').should('have.length',9)
    })

    it(`[step 6] should force the user to authenticate agian when accessing reserve.html after sign out`,()=>{    
        
        // The home page should have the study plan table
        cy.contains('th','ID')
        cy.contains('th','Study Code')
        cy.contains('th','English Name')
        cy.contains('th','Thai Name')

        cy.get('.ecors-row').should('have.length',9)

        cy.visit('/reserve.html') ;
        cy.wait(100) ;

        // It should redirect to SSO login page   
        cy.url().should('include','/keycloak/realms/itb-ecors/protocol/openid-connect/auth') ;
    })
})
 