describe(`TC-PBI4-3 : DECLARE-PLAN\n
      normal : - declare twice using two browser tabs`, () => {

    let resource = '/'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(() => {
        cy.visit('/reserve.html')

        // The app will always redirect to Keycloak, so we always
        // need to use cy.origin() to handle the login page.
        cy.origin('https://bscit.sit.kmutt.ac.th/', () => {
            cy.get('input#username').should('exist').and('be.visible');
            cy.get('input#password').should('exist').and('be.visible');

            cy.get('input#username').type('67130500143');
            cy.get('input#password').type('itbangmod');

            cy.get('#kc-login').click();
        });
    });

    it(`[step 1, Main] should sign in as Somnuk Doodee and open reserve.html page.\n
      should show "Declaration Status: Not Declared".`, () => {
        cy.visit('/reserve.html')
        cy.get('.ecors-fullname').should('exist').and('be.visible').and('contain.text', 'Somnuk Doodee');

        cy.get('.ecors-declared-plan').should('exist').and('be.visible')
            .and('contain.text', 'Not Declared');
    })

    it(`[step 3, Second] should select 'UX - UX/UI Designer.\n
      [step 4, Second] should click the 'Declare' button.\n 
      [step 5, Main] should select 'DA - Data Analyst' from the dropdown.\n
      [step 6, Main] should click 'Declare' button.\n
      [step 7, Main] should show a dialog with message "You may have declared study plan already. Please check again." and click 'OK' button.\n
      [step 8, Main] should click 'Sign Out' button.\n`, () => {

        cy.visit('/reserve.html')
        cy.wait(200);

 
        cy.intercept('POST', '**/students/67130500143/declared-plan').as('declarePlan');


        cy.request({
            method: 'POST',
            url: `${baseAPI}/students/67130500143/declared-plan`,
            body: {
                planId: 9
            },
            Headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            expect(response.status).to.equal(201)
        })

        cy.get('.ecors-dropdown-plan').should('exist').and('be.visible');
        cy.get('.ecors-dropdown-plan').select('DS - Data Scientist');
        cy.get('.ecors-dropdown-plan').should('contain.text', 'DS - Data Scientist');
        cy.get('.ecors-button-declare').should('exist').and('be.visible').and('be.enabled');

        cy.get('.ecors-button-declare').click();
        cy.wait(200);

        cy.wait('@declarePlan').its('response.statusCode').should('eq', 409);

        let alertShown = false;
        let alertText = '';

        cy.on('window:alert', (msg) => {
            alertShown = true;
            alertText = msg;
        });

        cy.then(() => {
            if (alertShown) {
                expect(alertText).to.equal('You may have declared study plan already. Please check again.');
            } else {
                cy.get('.ecors-dialog').should('be.visible');
                cy.get('.ecors-dialog .ecors-dialog-message').should('have.text', 'You may have declared study plan already. Please check again.');

                // Note: Make sure your dialog button has the class 'ecors-button-dialog'
                cy.contains('.ecors-dialog .ecors-button-dialog', /^ok$/i).should('be.visible').click();
            }
        });

        cy.get('.ecors-button-signout').should('exist').and('be.visible').and('contain.text', 'Sign Out').click();
    })

})