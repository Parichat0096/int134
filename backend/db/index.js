require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true, 
  connectionLimit: 10,
};

let pool;

async function initializeDb(retries = 20, delay = 2000) {
  while (retries > 0) {
    try {
      pool = mysql.createPool(dbConfig);
      await pool.query('SELECT 1'); 
      console.log("Connected to MySQL Pool");
      return pool; 
    } catch (err) {
      console.log("Waiting for DB, retrying...", retries);
      retries--;
      if (pool) await pool.end(); 
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error("Could not connect to MySQL");
}
const poolPromise = initializeDb();

module.exports = poolPromise;