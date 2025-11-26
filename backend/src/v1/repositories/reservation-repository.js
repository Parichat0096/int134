const pool = require("../../config/pool");

module.exports = {
    // หาหน่วยกิตรวมที่นักศึกษาจองไปแล้วในเทอมนั้นๆ
    getTotalCredits: async function(studentId, semesterId) {
        const sql = `
            SELECT SUM(c.credits) as total_credits
            FROM course_reservations cr
            JOIN course_offerings co ON cr.course_offering_id = co.id
            JOIN courses c ON co.course_id = c.id
            WHERE cr.student_id = ? AND co.semester_id = ?
        `;
        const [rows] = await pool.query(sql, [studentId, semesterId]);
        return rows[0].total_credits || 0;
    },

    // เช็คว่าจองวิชานี้ไปหรือยัง
    findReservation: async function(studentId, courseOfferingId) {
        const sql = `SELECT * FROM course_reservations WHERE student_id = ? AND course_offering_id = ?`;
        const [rows] = await pool.query(sql, [studentId, courseOfferingId]);
        return rows[0];
    },

    // สร้างการจอง
    createReservation: async function(studentId, courseOfferingId) {
        const sql = `
            INSERT INTO course_reservations (student_id, course_offering_id, reserved_at) 
            VALUES (?, ?, NOW())
        `;
        await pool.query(sql, [studentId, courseOfferingId]);
        
        // Return ข้อมูลที่เพิ่งจองเพื่อส่งกลับให้ FE
        return await this.getReservationDetail(studentId, courseOfferingId);
    },

    // ดึงรายละเอียดการจอง (สำหรับ Response 201 หรือ GET list)
    getReservationDetail: async function(studentId, courseOfferingId) {
        const sql = `
            SELECT cr.*, c.id as course_id, c.code, c.title, c.credits 
            FROM course_reservations cr
            JOIN course_offerings co ON cr.course_offering_id = co.id
            JOIN courses c ON co.course_id = c.id
            WHERE cr.student_id = ? AND cr.course_offering_id = ?
        `;
        const [rows] = await pool.query(sql, [studentId, courseOfferingId]);
        return rows[0];
    },

    // ดึงรายการจองทั้งหมดของนักศึกษาในเทอมที่ระบุ
    findAllByStudent: async function(studentId, semesterId) {
        const sql = `
            SELECT cr.*, c.id as course_id, c.code, c.title, c.credits 
            FROM course_reservations cr
            JOIN course_offerings co ON cr.course_offering_id = co.id
            JOIN courses c ON co.course_id = c.id
            WHERE cr.student_id = ? AND co.semester_id = ?
            ORDER BY c.code ASC
        `;
        const [rows] = await pool.query(sql, [studentId, semesterId]);
        return rows;
    },
    deleteReservation: async function(studentId, courseOfferingId) {
        const sql = `DELETE FROM course_reservations WHERE student_id = ? AND course_offering_id = ?`;
        await pool.query(sql, [studentId, courseOfferingId]);
    }
};