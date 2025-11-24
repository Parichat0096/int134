const poolPromise = require("../db");

const findDeclaredPlanByStudentId = async (studentId) => {
  const pool = await poolPromise;
  const sql = `
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
  const [rows] = await pool.query(sql, [studentId]);
  return rows.length > 0 ? rows[0] : null;
};

const create = async (studentId, planId) => {
  const pool = await poolPromise;
  const sql = `
    INSERT INTO declared_plans (student_id, plan_id, status, created_at)
    VALUES (?, ?, 'DECLARED', CURRENT_TIMESTAMP)
  `;
  await pool.query(sql, [studentId, planId]);
};

const updatePlan = async (studentId, planId) => {
  const pool = await poolPromise;
  const sql = `
    UPDATE declared_plans
    SET plan_id = ?, status = 'DECLARED', updated_at = CURRENT_TIMESTAMP
    WHERE student_id = ?
  `;
  await pool.query(sql, [planId, studentId]);
};

const cancelPlan = async (studentId) => {
  const pool = await poolPromise;
  const sql = `
    UPDATE declared_plans
    SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
    WHERE student_id = ?
  `;
  await pool.query(sql, [studentId]);
};

module.exports = {
  findDeclaredPlanByStudentId,
  create,
  updatePlan,
  cancelPlan,
};
