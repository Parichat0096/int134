import * as utils from './utils';

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args);
});

Cypress.Commands.add("setTimezone", (tz) => {
  Cypress.automation("remote:debugger:protocol", {
    command: "Emulation.setTimezoneOverride",
    params: { timezoneId: tz },
  });
});

Cypress.Commands.add("clearTimezone", () => {
  Cypress.automation("remote:debugger:protocol", {
    command: "Emulation.clearTimezoneOverride",
  });
});


Cypress.Commands.add('signIn', (username, password) => {
  Cypress.Keyboard.defaults({keystrokeDelay: 0})
  
  // ใช้ค่าสำรองถ้า config หาไม่เจอ
  const waitTime = Cypress.config('keycloakWaitMs') || 2000;

  cy.session([username], () => {
    cy.visit('/reserve.html') ;
    cy.wait(waitTime) ;
    
    if (!utils.baseUrlIsPublic()) {
        cy.origin('https://bscit.sit.kmutt.ac.th/', { args: { username, password } }, ({ username, password }) => {
            cy.get('input#username').type(username) ;
            cy.get('input#password').type(password) ;
            cy.get('button[type=submit]').click() ;
        }) ;
    } else {
        cy.get('input#username').type(username) ;
        cy.get('input#password').type(password) ;
        cy.get('button[type=submit]').click() ;
    } ;
    
    cy.wait(waitTime) ;
    cy.url().should('contain','/reserve.html') ;  
  }) ;
});

Cypress.Commands.add('shouldBeHiddenOrNotExist', (selector) => {
  cy.get('body').then($body => {
    if ($body.find(selector).length === 0) {
      expect(true, `${selector} does not exist`).to.be.true;
      return;
    }
    cy.get(selector, { timeout: 300 }).should($el => {
      const el = $el[0];
      const style = getComputedStyle(el);
      const invisible = !$el.is(':visible') || style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0;
      expect(invisible, `${selector} should be HIDDEN`).to.be.true;
    });
  });
});

Cypress.Commands.add('shouldBeVisibleAndNotClickable', (selector) => {
  cy.get(selector, { timeout: 300 }).should($el => {
    const el = $el[0];
    const style = getComputedStyle(el);
    const isVisible = $el.is(':visible') && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0;
    expect(isVisible, `${selector} should be VISIBLE`).to.be.true;
    const disabled = $el.is(':disabled');
    expect(disabled, `${selector} should be NOT CLICKABLE`).to.be.true;
  });
});

Cypress.Commands.add('shouldBeVisibleAndClickable', selector => {
  cy.get(selector, { timeout: 500 }).should($el => {
    const style = getComputedStyle($el[0]);
    const visible = $el.is(':visible') && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0;
    const enabled = !$el.is(':disabled');
    expect(visible && enabled, `${selector} should be visible AND clickable`).to.be.true;
  });
});

Cypress.Commands.add('shouldShowDialog', (expectedMessage) => {
  cy.get('.ecors-dialog').should('be.visible');
  cy.get('.ecors-dialog-message').first().should('have.text', expectedMessage);
});

Cypress.Commands.add('shouldCloseDialog', () => {
  cy.get('body').then($body => {
    if ($body.find('.ecors-dialog').length === 0) {
      expect(true, `.ecors-dialog does not exist`).to.be.true;
      return;
    }
    cy.get('.ecors-dialog').should('not.have.attr', 'open');
  });
});