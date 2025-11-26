const pool = require("../../config/pool");

module.exports = {
    findActivePeriods: async function() {
        const sql = `
            SELECT * FROM reservation_periods 
            WHERE is_active = 1 
            ORDER BY start_datetime ASC
        `;
        const [rows] = await pool.query(sql);
        return rows;
    }
}