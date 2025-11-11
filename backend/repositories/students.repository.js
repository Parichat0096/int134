const poolPromise = require('../db'); 

const findDeclaredPlanByStudentId = async (studentId) => {
    const pool = await poolPromise;
    
    const queryText = `
        SELECT 
            dp.student_id, 
            dp.plan_id, 
            dp.created_at, 
            dp.updated_at,
            sp.plan_code,
            sp.name_eng
        FROM declared_plans dp
        JOIN study_plans sp ON dp.plan_id = sp.id
        WHERE dp.student_id = ?
    `;
    
    const [rows] = await pool.query(queryText, [studentId]);
    return rows.length > 0 ? rows[0] : null; 
};

const create = async (studentId, planId) => {
    const pool = await poolPromise;

    const insertQuery = `
        INSERT INTO declared_plans (student_id, plan_id)
        VALUES (?, ?)
    `;
    await pool.query(insertQuery, [studentId, planId]);

    const selectQuery = `
        SELECT student_id, plan_id, created_at, updated_at
        FROM declared_plans
        WHERE student_id = ?
    `;
    const [rows] = await pool.query(selectQuery, [studentId]);

    return rows[0]; 
};

module.exports = {
    findDeclaredPlanByStudentId,
    create,
};