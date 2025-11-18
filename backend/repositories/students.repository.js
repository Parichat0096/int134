const poolPromise = require("../db");

const findDeclaredPlanByStudentId = async (studentId) => {
  const pool = await poolPromise;
  const queryText = `
        SELECT 
            dp.student_id, 
            dp.plan_id, 
            dp.created_at, 
            dp.updated_at,
            dp.status, 
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
        INSERT INTO declared_plans (student_id, plan_id, status)
        VALUES (?, ?, 'DECLARED')
    `;
  await pool.query(insertQuery, [studentId, planId]);
  return;
};

const updatePlan = async (studentId, planId) => {
  const pool = await poolPromise;
  const updateQuery = `
        UPDATE declared_plans 
        SET plan_id = ?, status = 'DECLARED', updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ?
    `;
  await pool.query(updateQuery, [planId, studentId]);
  return;
};
const cancelPlan = async (studentId) => {
  const pool = await poolPromise;

  const updateQuery = `
        UPDATE declared_plans 
        SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ?
    `;
  await pool.query(updateQuery, [studentId]);
  return;
};

module.exports = {
  findDeclaredPlanByStudentId,
  create,
  updatePlan,
  cancelPlan, 
};