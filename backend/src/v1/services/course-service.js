const courseRepo = require("../repositories/course-repository");
const periodService = require("./reservation-period-service");

module.exports = {
    getCourseOfferingsPlans: async function() {
        const { currentPeriod, nextPeriod } = await periodService.getReservationPeriods();
        const activePeriod = currentPeriod || nextPeriod;

        if (!activePeriod) return { semesterId: null, courseOfferings: [] };

        // *** FIX: ใช้ activePeriod.semesterId (camelCase) ***
        const offerings = await courseRepo.findOfferingsWithPlans(activePeriod.semesterId);
        
        const formattedOfferings = offerings.map(o => ({
            id: o.id,
            courseId: o.course_id,
            courseCode: o.courseCode,
            courseTitle: o.courseTitle,
            courseCredits: o.courseCredits,
            planIds: o.planIds ? o.planIds.split(',').map(Number) : [],
            capacity: o.capacity
        }));

        return {
            semesterId: activePeriod.semesterId, // *** FIX: ใช้ camelCase ให้ตรง Spec PDF หน้า 29 [cite: 555] ***
            courseOfferings: formattedOfferings
        };
    },

    getPlanCourses: async function() {
        // ส่วนนี้ถูกต้องแล้ว ไม่ได้เรียกใช้ periodService
        const rows = await courseRepo.findPlanCourses();
        const resultMap = new Map();
        
        rows.forEach(row => {
            if (!resultMap.has(row.plan_id)) {
                resultMap.set(row.plan_id, { planId: row.plan_id, courses: [] });
            }
            resultMap.get(row.plan_id).courses.push({
                id: row.id,
                code: row.code,
                title: row.title
            });
        });

        return Array.from(resultMap.values());
    }
};