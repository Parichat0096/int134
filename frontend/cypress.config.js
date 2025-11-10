const { defineConfig } = require('cypress')
module.exports = defineConfig({
    e2e:{
        // 1. Frontend ของคุณ (ทำงานบน Port 80)
        baseUrl : "http://localhost/intproj25/PL-1/itb-ecors/",
        
        // --- VVVV แก้ไขบรรทัดนี้ VVVV ---
        
        // 2. Backend ของคุณ (ทำงานบน Port 3000)
        //    (ลบ /study-plans ออกจากท้าย)
        baseAPI :"http://localhost:3000/intproj25/PL-1/itb-ecors/api/v1",

        // --- ^^^^ แก้ไขบรรทัดนี้ ^^^^ ---

        specPattern : "cypress/e2e/**/*.cy.js",
        setupNodeEvents(on , config){

        },
        supportFile : false
    }
})