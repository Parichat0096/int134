const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // 1. Frontend ทำงานบน Port 80
    // baseUrl : "http://bscit.sit.kmutt.ac.th/intproj25/pl1/itb-ecors/",
    baseUrl: "http://localhost/intproj25/pl1/itb-ecors/",
    keycloakWaitMs: 2000,
    regularWaitMs: 1000,
    defaultCommandTimeout: 10000,
    // 2. Backend  Port 3000
    // baseAPI :"http://bscit.sit.kmutt.ac.th/intproj25/pl1/itb-ecors/api/v1",
    baseAPI: "http://localhost/intproj25/pl1/itb-ecors/api/v1",

    specPattern: "cypress/e2e/**/*.cy.js",
    setupNodeEvents(on, config) {},
    supportFile: "./cypress/e2e/support/e2e.js",
    experimentalRunAllSpecs : true
  },
});
