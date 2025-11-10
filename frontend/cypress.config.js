const { defineConfig } = require('cypress')
module.exports = defineConfig({
    e2e:{
        // baseUrl : "http://bscit.sit.kmutt.ac.th/intproj25/PL-1/itb-ecors/",
        baseUrl : "http://ip25pl1.sit.kmutt.ac.th/intproj25/PL-1/itb-ecors/",
        
        // baseAPI :"http://bscit.sit.kmutt.ac.th:3000/intproj25/PL-1/itb-ecors/api/v1/study-plans",
        baseAPI :"http://ip25pl1.sit.kmutt.ac.th:3000/intproj25/PL-1/itb-ecors/api/v1/study-plans",
        specPattern : "cypress/e2e/**/*.cy.js",
        setupNodeEvents(on , config){

        },
        supportFile : false
    }
})