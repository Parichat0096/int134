const pool = require("../../config/pool");

async function findAll(){
    const [rows] = await pool.query("SELECT * FROM study_plans")
    return rows
}

module.exports = {
    findAll
}