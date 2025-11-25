const pool = require("../../config/pool");

module.exports = {
    findAll: async function(){
        const [rows] = await pool.query('SELECT * FROM declared_plans ')
        return rows
    },
    findById: async function(id){
        const [rows] = await pool.query('SELECT * FROM declared_plans WHERE student_id = ?',[id])
        return rows[0]
    },
    createDelacre: async function(id,planId){
        const [rows] = await pool.query('INSERT INTO declared_plans (student_id, plan_id) VALUES (?,?)',[id,planId])
        return await this.findById(id)
    },
    changeDeclared: async function(id,planId) {
        const [rows] = await pool.query('UPDATE declared_plans SET plan_id = ? , status = "DECLARED" , updated_at = CURRENT_TIMESTAMP WHERE student_id = ?',[planId,id])
        return await this.findById(id)
    },
    deleteDeclared: async function(id) {
        // const [rows] = await pool.query('DELETE FROM declared_plans WHERE student_id = ?',[id])
        // return rows[0]
        const [rows] = await pool.query('UPDATE declared_plans SET status = "CANCELLED" , updated_at = CURRENT_TIMESTAMP WHERE student_id = ?',[id])
        return await this.findById(id)
    },
}