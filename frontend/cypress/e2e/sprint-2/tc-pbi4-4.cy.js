describe(`TC-PBI4-3 : DECLARE-PLAN\n
      error : - unexpected error`, () => {

    let resource = '/'
    let baseAPI = Cypress.config('baseAPI')

    beforeEach(() => {
        cy.visit('/reserve.html')
        cy.origin('https://bscit.sit.kmutt.ac.th/', () => {
            cy.get('input#username').should('exist').and('be.visible');
            cy.get('input#password').should('exist').and('be.visible');
            cy.get('input#username').type('67130500144'); 
            cy.get('input#password').type('itbangmod');
            cy.get('#kc-login').click();
        });
    });

    it(`[step 1] should sign in as Sompong Pordee and open reserve.html page.\n
      should show "Declaration Status: Not Declared".`, () => {
        cy.visit('/reserve.html')
        cy.get('.ecors-fullname').should('exist').and('be.visible').and('contain.text', 'Sompong Pordee');
        cy.get('.ecors-declared-plan').should('exist').and('be.visible')
            .and('contain.text', 'Not Declared');
    })

    it(`[step 2] should select 'BE - Backend Developer' and click 'Declare' button.`, () => {
        
        cy.intercept('POST', '**/students/**', {
            statusCode: 500,
            body: { data: [] }
        }).as('request')

        cy.intercept('GET', '**/api/v1/study-plans').as('getPlans');

        cy.visit('/reserve.html')

        cy.wait('@getPlans');

        cy.get('.ecors-dropdown-plan').should('exist').and('be.visible');
        cy.get('.ecors-dropdown-plan').select('BE - Backend Developer');
        cy.get('.ecors-dropdown-plan').should('contain.text', 'BE - Backend Developer');
        cy.get('.ecors-button-declare').should('exist').and('be.visible').and('be.enabled');

        cy.get('.ecors-button-declare').click();

        cy.wait('@request').then((interception) => {
            const response = interception.response
            expect(response.statusCode).to.equal(500)
        })

        let alertShown = false;
        let alertText = '';

        cy.on('window:alert', (msg) => {
            alertShown = true;
            alertText = msg;
        });

        cy.then(() => {
            if (alertShown) {
                expect(alertText).to.equal('There is a problem. Please try again later.');
            } else {
                cy.get('.ecors-dialog').should('be.visible');
                cy.get('.ecors-dialog .ecors-dialog-message').should('have.text', 'There is a problem. Please try again later.');
                cy.contains('.ecors-dialog .ecors-button-dialog', /^ok$/i).should('be.visible').click();
            }
        });
    })

    it(`[step 7, Main] should select 'BE - Backend Developer' and click 'Declare' button.`, () => {
        cy.intercept('POST', '**/students/**', {
            statusCode: 502,
            body: { data: [] }
        }).as('request')

        cy.intercept('GET', '**/api/v1/study-plans').as('getPlans');

        cy.visit('/reserve.html')

        cy.wait('@getPlans');

        cy.get('.ecors-dropdown-plan').should('exist').and('be.visible');
        
        cy.get('.ecors-dropdown-plan').select('BE - Backend Developer');
        cy.get('.ecors-dropdown-plan').should('contain.text', 'BE - Backend Developer');
        cy.get('.ecors-button-declare').should('exist').and('be.visible').and('be.enabled');

        cy.get('.ecors-button-declare').click();

        cy.wait('@request').then((interception) => {
            const response = interception.response
            expect(response.statusCode).to.equal(502)
        })

        let alertShown = false;
        let alertText = '';

        cy.on('window:alert', (msg) => {
            alertShown = true;
            alertText = msg;
        });

        cy.then(() => {
            if (alertShown) {
                expect(alertText).to.equal('There is a problem. Please try again later.');
            } else {
                cy.get('.ecors-dialog').should('be.visible');
                cy.get('.ecors-dialog .ecors-dialog-message').should('have.text', 'There is a problem. Please try again later.');
                cy.get('body').type('{esc}');
            }
        });
    })

})