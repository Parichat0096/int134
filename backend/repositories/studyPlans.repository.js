const poolPromise = require('../db'); 

const findAll = async () => {
  const pool = await poolPromise; 
  
  const queryText =
    'SELECT id, plan_code, name_eng, name_th FROM study_plans ORDER BY id ASC';
  const [rows] = await pool.query(queryText);
  return rows;
};

module.exports = {
  findAll,
};