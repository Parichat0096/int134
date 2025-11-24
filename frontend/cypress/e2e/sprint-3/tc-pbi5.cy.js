// cypress/e2e/sprint-3/tc-pbi5.cy.js

// Helper variables
const REGULAR_WAIT = Cypress.config('regularWaitMs') || 1000;

// Mock Data
const MOCK_DECLARED_PLAN_144 = {
    "studentId": "67130500144", 
    "planId": 4, 
    "status": "DECLARED", 
    "planCode": "AI", 
    "planNameEng": "AI Developer", 
    "createdAt": "2024-01-15T10:00:00Z", 
    "updatedAt": "2024-01-15T10:00:00Z"
};

const MOCK_DECLARED_PLAN_140 = {
    "studentId": "67130500140", 
    "planId": 1, 
    "status": "DECLARED", 
    "planCode": "SE", 
    "planNameEng": "Software Engineering", 
    "createdAt": "2024-01-01", 
    "updatedAt": "2024-01-01"
};

describe(`TC-PBI5 : CHANGE-PLAN`, () => {

    Cypress.session.clearAllSavedSessions() ;

    // =========================================================
    // TC-PBI5-1 : 'Change' button – behavior
    // =========================================================
    it(`TC-PBI5-1 : 'Change' button – behavior`,()=>{     
        cy.log('===================== TC-PBI5-1 =====================') ;
        cy.log('>>> Test the dropdown and Change button behavior') ;
        cy.log('=====================================================') ;

        let declaredPlan = '' ;

        cy.log('* ') ;
        cy.log('* Step 0: Must be itb-ecors public URL') ;
            cy.visit('') ;
            cy.url().then(url => cy.log('Current URL: ' + url)) ;
            cy.url().should('match', /bscit\.sit\.kmutt\.ac\.th\/intproj25.*\/itb-ecors\//) ;

        cy.log('* ') ;
        cy.log('* Step 2: Sign-in as 67130500144 (Sompong Pordee)');
            cy.signIn('67130500144', 'itbangmod') ;
            // send a request, mock 404 when getting 200 to test change buttton
            cy.intercept({method: 'GET', url: '**/students/67130500144/declared-plan', times: 1}, (req) => {
                req.continue((res) => {
                    if (res.statusCode === 200) {
                        declaredPlan = res.body;
                        res.send({statusCode: 404}) ; } });
            }).as('getDeclaredPlan404') ;
            
            cy.visit('reserve.html') ;
            cy.wait('@getDeclaredPlan404') ;
            cy.wait(REGULAR_WAIT) ;
            cy.shouldBeHiddenOrNotExist('.ecors-button-change') ;
            cy.reload() ;
            cy.wait(REGULAR_WAIT) ;

        cy.log('* ') ;
        cy.log('* Step 3: Declare AI - AI Developer plan');
            cy.then(() => {
                cy.log('Current declaredPlan: ' + JSON.stringify(declaredPlan)) ;
                if (!declaredPlan || declaredPlan.status == 'CANCELLED') {
                    cy.intercept('POST', '**/students/**').as('declarePlan');
                    cy.get('.ecors-dropdown-plan').select('AI - AI Developer');
                    cy.get('.ecors-button-declare').click();
                    cy.wait('@declarePlan').then(({ request, response }) => {
                        expect(response.statusCode).to.equal(201);
                        declaredPlan = response.body;
                    });
                    cy.wait(REGULAR_WAIT) ;
                }
                cy.shouldBeHiddenOrNotExist('.ecors-button-declare') ;
                cy.shouldBeVisibleAndNotClickable('.ecors-button-change') ;
            }) ;
        
        cy.log('* ') ;
        cy.log('* Step 4: Refresh the page');         
            cy.intercept({method: 'GET', url: '**/students/67130500144/declared-plan', times: 1}, (req) => {
                req.reply({
                    statusCode: 200,
                    body: MOCK_DECLARED_PLAN_144
                })}).as('mockGetDeclaredPlan') ;
            
            cy.reload() ;
            cy.wait('@mockGetDeclaredPlan') ;
            cy.wait(REGULAR_WAIT) ;
            
            cy.get('.ecors-dropdown-plan-change').should('contain.text','AI - AI Developer');
            cy.shouldBeHiddenOrNotExist('.ecors-button-declare') ;
            cy.shouldBeVisibleAndNotClickable('.ecors-button-change') ;
            
        cy.log('* ') ;
        cy.log('* Step 5: Select FE - Frontend Developer') ;
            cy.get('.ecors-dropdown-plan-change').select('FE - Frontend Developer') ;
            cy.get('.ecors-dropdown-plan-change').should('contain.text','FE - Frontend Developer') ; 
            cy.shouldBeHiddenOrNotExist('.ecors-button-declare') ;
            cy.shouldBeVisibleAndClickable('.ecors-button-change') ;
            
        cy.log('* ') ;
        cy.log('* Step 6: Un-select FE - Frontend Developer');
            cy.get('.ecors-dropdown-plan-change').select('') ;
            cy.get('.ecors-dropdown-plan-change').should('have.value','') ;
            cy.shouldBeHiddenOrNotExist('.ecors-button-declare') ;
            cy.shouldBeVisibleAndNotClickable('.ecors-button-change') ;
            
        cy.log('* ') ;
        cy.log('* Step 7: Select AI - AI Developer');
            cy.get('.ecors-dropdown-plan-change').select('AI - AI Developer') ;
            cy.get('.ecors-dropdown-plan-change').should('contain.text','AI - AI Developer'); 
            cy.shouldBeHiddenOrNotExist('.ecors-button-declare') ;
            cy.shouldBeVisibleAndNotClickable('.ecors-button-change') ;
    });


    // =========================================================
    // TC-PBI5-2 : Change plan twice – success
    // =========================================================
    it(`TC-PBI5-2 : Change plan twice – success`,()=>{     
        cy.log('===================== TC-PBI5-2 =====================') ;
        cy.log('>>> Test changing plan twice successfully') ;
        cy.log('=====================================================') ;

        cy.signIn('67130500144', 'itbangmod') ;

        // Mock Initial State (มี Plan แล้ว)
        cy.intercept('GET', '**/students/67130500144/declared-plan', {
            statusCode: 200,
            body: MOCK_DECLARED_PLAN_144
        }).as('getPlanInitial');
        
        cy.visit('reserve.html') ;
        cy.wait('@getPlanInitial');
        cy.wait(REGULAR_WAIT) ;

        cy.log('* ') ;
        cy.log('* Step 1: Select DB - Database Administrator') ;
            cy.get('.ecors-dropdown-plan-change').select('DB - Database Administrator') ;
            cy.get('.ecors-dropdown-plan-change').should('contain.text','DB - Database Administrator') ; 
            cy.shouldBeVisibleAndClickable('.ecors-button-change') ;

        cy.log('* ') ;
        cy.log('* Step 2: Click Change button') ;
            // ⭐ MOCK 1: เปลี่ยนแผนครั้งแรก (Mock เวลาปัจจุบัน)
            cy.intercept('PUT', '**/students/67130500144/declared-plan', (req) => {
                expect(req.body).to.have.property('planId', 8) ;
                req.reply({
                    statusCode: 200,
                    body: { 
                        ...MOCK_DECLARED_PLAN_144, 
                        planId: 8, 
                        planCode: "DB", 
                        planNameEng: "Database Administrator",
                        updatedAt: new Date().toISOString() // ⏰ ใช้เวลาปัจจุบัน
                    }
                });
            }).as('changePlan') ;
            
            cy.get('.ecors-button-change').click() ;
            cy.wait('@changePlan') ;
        
        cy.log('* ') ;
        cy.log('* Step 3: Click OK to close the dialog') ;
            cy.shouldShowDialog("Declaration updated.");
            cy.get('.ecors-button-dialog').click();
            cy.wait(REGULAR_WAIT) ;
            cy.get('.ecors-declared-plan').should('contain.text','Declared DB - Database Administrator');
            cy.get('.ecors-declared-plan').invoke('text').as('statusAfterChange1').then( text => Cypress.utils.shouldBeNow(text, {withinMs: 3000})) ;
            cy.get('.ecors-dropdown-plan-change').should('contain.text','DB - Database Administrator') ;   
            cy.shouldBeHiddenOrNotExist('.ecors-button-declare') ;
            cy.shouldBeVisibleAndNotClickable('.ecors-button-change') ;

        cy.log('* ') ;
        cy.log('* Step 4: Select DE - Data Engineer') ;
            cy.get('.ecors-dropdown-plan-change').select('DE - Data Engineer') ;
            cy.get('.ecors-dropdown-plan-change').should('contain.text','DE - Data Engineer') ; 
            cy.shouldBeVisibleAndClickable('.ecors-button-change') ;

        cy.log('* ') ;
        cy.log('* Step 5: Click Change button') ;
            // ⭐ MOCK 2: เปลี่ยนแผนครั้งที่สอง (Mock เวลาปัจจุบัน)
            cy.intercept('PUT', '**/students/67130500144/declared-plan', (req) => {
                expect(req.body).to.have.property('planId', 7) ;
                req.reply({
                    statusCode: 200,
                    body: { 
                        ...MOCK_DECLARED_PLAN_144, 
                        planId: 7, 
                        planCode: "DE", 
                        planNameEng: "Data Engineer",
                        updatedAt: new Date().toISOString() // ⏰ ใช้เวลาปัจจุบัน
                    }
                });
            }).as('changePlan2') ;
            
            cy.get('.ecors-button-change').click() ;
            cy.wait('@changePlan2') ;
        
            cy.shouldShowDialog("Declaration updated.");
            cy.get('.ecors-button-dialog').click();
            cy.wait(REGULAR_WAIT) ;
            cy.get('.ecors-declared-plan').should('contain.text','Declared DE - Data Engineer');
            cy.get('.ecors-declared-plan').invoke('text').as('statusAfterChange2').then( text => Cypress.utils.shouldBeNow(text, {withinMs: 3000})) ;
            cy.get('.ecors-dropdown-plan-change').should('contain.text','DE - Data Engineer') ;
            cy.shouldBeHiddenOrNotExist('.ecors-button-declare') ;
            cy.shouldBeVisibleAndNotClickable('.ecors-button-change') ;
    
        cy.log('* ') ;
        cy.log('* Step 6: Refresh the page') ;
            cy.reload() ;
            cy.wait(REGULAR_WAIT) ;
            cy.get('.ecors-declared-plan').should('contain.text','Declared DE - Data Engineer') ;
            cy.get('.ecors-declared-plan').invoke('text').as('statusAfterReload').then( text => {
                cy.get('@statusAfterChange2').then( statusAfterChange2 => {
                    expect(text, 'The status display should be the same after page reload')
                      .to.equal(statusAfterChange2) ;
                });
            });
        })    


    // =========================================================
    // TC-PBI5-3 : Handle 404 Not Found when changing plan
    // =========================================================
    it(`TC-PBI5-3 : Handle 404 Not Found when changing plan`,()=>{     
        cy.log('===================== TC-PBI5-3 =====================') ;
        cy.log('>>> Test handling 404 Not Found error when changing plan') ;
        cy.log('=====================================================') ;

        cy.log('* step 0: Sign-in as 67130500144 (Sompong Pordee)');
        cy.signIn('67130500144', 'itbangmod') ;
        
        cy.intercept('GET', '**/students/67130500144/declared-plan', {
            statusCode: 200,
            body: MOCK_DECLARED_PLAN_144
        }).as('getPlanInitial');

        cy.visit('reserve.html') ;
        cy.wait('@getPlanInitial');
        cy.wait(REGULAR_WAIT) ;

        cy.log('* ') ;
        cy.log('* Step 1: Select FE - Frontend Developer') ;
            cy.get('.ecors-dropdown-plan-change').select('FE - Frontend Developer') ;
            cy.get('.ecors-dropdown-plan-change').should('contain.text','FE - Frontend Developer') ; 
            cy.shouldBeVisibleAndClickable('.ecors-button-change') ;

        cy.log('* ') ;
        cy.log('* Step 2: Mock a 404 Not Found response for PUT /declared-plan') ;
            cy.intercept('PUT', '**/students/67130500144/declared-plan', (req) => {
                req.reply({
                    statusCode: 404,
                    body: {"error": "DECLARED_PLAN_NOT_FOUND", 
                        "message": "No declared plan found for student with id=67130500144."}
                    }) ;
            }).as('changePlan404') ;
            
            cy.intercept('GET', '**/students/67130500144/declared-plan', (req) => {
                req.reply({
                    statusCode: 404,
                    body: {"error": "DECLARED_PLAN_NOT_FOUND", 
                        "message": "No declared plan found for student with id=67130500144."}
                    }) ;
            }).as('getDeclaredPlan404') ;

        cy.log('* ') ;
        cy.log('* Step 3: Click Change button') ;
            cy.get('.ecors-button-change').click() ;
            cy.wait('@changePlan404') ;
            cy.shouldShowDialog("No declared plan found for student.");

        cy.log('* ') ;
        cy.log('* Step 4: Click OK to close the dialog') ;
            cy.get('.ecors-button-dialog').click();
            cy.wait(REGULAR_WAIT) ;
            cy.get('.ecors-declared-plan').should('contain.text','Not Declared');
            cy.shouldBeVisibleAndNotClickable('.ecors-button-declare') ;
            cy.shouldBeHiddenOrNotExist('.ecors-button-change') ;
    });


    // =========================================================
    // TC-PBI5-4 : error case (500 and 502)
    // =========================================================
    it('TC-PBI5-4 : error case (500 and 502)',()=>{
        cy.log('===================== TC-PBI5-4 =====================') ;
        cy.log('>>> Test handling 500 Internal Server Error and Network Error when changing plan') ;
        cy.log('=====================================================') ;

        cy.log('* ') ;
        cy.log('* step 1: Sign-in as 67130500140 (Somchai Jaidee)');
        cy.signIn('67130500140', 'itbangmod') ;
        
        cy.intercept('GET', '**/students/67130500140/declared-plan', {
            statusCode: 200,
            body: MOCK_DECLARED_PLAN_140
        }).as('getPlanInitial');

        cy.visit('reserve.html') ;
        cy.wait('@getPlanInitial');
        cy.wait(REGULAR_WAIT) ;

        cy.log('* ') ;
        cy.log('* Step 2: Select BE - Backend Developer') ;
            cy.get('.ecors-dropdown-plan-change').select('BE - Backend Developer') ;
            cy.get('.ecors-dropdown-plan-change').should('contain.text','BE - Backend Developer') ; 
            cy.shouldBeVisibleAndClickable('.ecors-button-change') ;

        cy.log('* ') ;
        cy.log('* Step 3: Intercept response and reply with 500 Internal Server Error') ;
            cy.intercept('PUT', '**/students/67130500140/declared-plan', (req) => {
                req.reply({
                    statusCode: 500,
                    body: {"error": "INTERNAL_SERVER_ERROR", 
                            "message": "An unexpected error occurred on the server."} }) ;
                }).as('changePlan500') ;
                
        cy.log('* ') ;
        cy.log('* Step 4: Click Change button') ;
            cy.get('.ecors-button-change').click() ;
            cy.wait('@changePlan500') ;
            cy.shouldShowDialog('There is a problem. Please try again later.') ;

        cy.log('* ') ;
        cy.log('* Step 5: Click OK in the dialog') ;
            cy.get('.ecors-button-dialog').click();
            cy.shouldCloseDialog() ;
            cy.reload() ;

        cy.log('* ') ;
        cy.log('* Step 6: Select BE - Backend Developer') ;
            cy.get('.ecors-dropdown-plan-change').select('BE - Backend Developer') ;   
            cy.get('.ecors-dropdown-plan-change').should('contain.text','BE - Backend Developer') ; 
            cy.shouldBeVisibleAndClickable('.ecors-button-change') ;

        cy.log('* ') ;
        cy.log('* Step 7: Intercept response and mock network error') ;
            cy.intercept('PUT', '**/students/67130500140/declared-plan', (req) => {
                req.destroy() ;
            }).as('changePlanNetworkError') ;
            
        cy.log('* ') ;
        cy.log('* Step 8: Click Change button') ;
            cy.get('.ecors-button-change').click() ;
            cy.wait('@changePlanNetworkError') ;
            cy.shouldShowDialog('There is a problem. Please try again later.') ;

        cy.log('* ') ;
        cy.log('* Step 9: Press ESC key in the dialog') ;
            cy.get('.ecors-button-dialog').click();
            cy.shouldCloseDialog() ;
    });
})