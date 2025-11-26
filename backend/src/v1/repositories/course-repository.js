const pool = require("../../config/pool");

module.exports = {
    // ดึงข้อมูล Course Offering โดย ID (เพื่อเช็คหน่วยกิตและเทอม)
    findOfferingById: async function(offeringId) {
        const sql = `
            SELECT co.*, c.credits 
            FROM course_offerings co
            JOIN courses c ON co.course_id = c.id
            WHERE co.id = ?
        `;
        const [rows] = await pool.query(sql, [offeringId]);
        return rows[0];
    },

    // PBI-9: List course offerings + Plans
    findOfferingsWithPlans: async function(semesterId) {
        const sql = `
            SELECT co.id, co.course_id, co.capacity, 
                   c.code as courseCode, c.title as courseTitle, c.credits as courseCredits,
                   GROUP_CONCAT(pcc.plan_id) as planIds
            FROM course_offerings co
            JOIN courses c ON co.course_id = c.id
            LEFT JOIN plan_core_courses pcc ON c.id = pcc.course_id
            WHERE co.semester_id = ?
            GROUP BY co.id
            ORDER BY c.code
        `;
        const [rows] = await pool.query(sql, [semesterId]);
        return rows;
    },

    // PBI-9: List core courses grouped by plan
    findPlanCourses: async function() {
        const sql = `
            SELECT pcc.plan_id, c.id, c.code, c.title
            FROM plan_core_courses pcc
            JOIN courses c ON pcc.course_id = c.id
            ORDER BY pcc.plan_id, c.code
        `;
        const [rows] = await pool.query(sql);
        return rows;
    }
};