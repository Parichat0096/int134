const reservationRepo = require("../repositories/reservation-repository");
const courseRepo = require("../repositories/course-repository");
const periodService = require("./reservation-period-service");

module.exports = {
    // GET: List reservations
    getStudentReservations: async function(studentId) {
        const { currentPeriod, nextPeriod } = await periodService.getReservationPeriods();
        const activePeriod = currentPeriod || nextPeriod;

        if (!activePeriod) {
            return { 
                studentId, 
                semesterId: null, 
                reservedCredits: 0, 
                reservedCourses: [] 
            };
        }

        // *** FIX: ใช้ .semesterId (camelCase) ตามที่แก้ใน period-service ***
        const reservations = await reservationRepo.findAllByStudent(studentId, activePeriod.semesterId);
        const totalCredits = await reservationRepo.getTotalCredits(studentId, activePeriod.semesterId);

        return {
            studentId,
            semesterId: activePeriod.semesterId, // ส่งกลับให้ตรง Spec PDF หน้า 31 [cite: 596-599]
            reservedCredits: Number(totalCredits),
            reservedCourses: reservations 
        };
    },

    // POST: Create Reservation
    createReservation: async function(studentId, courseOfferingId) {
        // 1. Check Reservation Period (403)
        const period = await periodService.validateReservationPeriod();
        
        // *** FIX: ใช้ตัวแปร camelCase ***
        const semesterId = period.semesterId; 
        const limit = period.cumulativeCreditLimit; 

        const offering = await courseRepo.findOfferingById(courseOfferingId);
        if (!offering) {
            const error = new Error("Course offering not found");
            error.status = 404;
            error.code = "NOT_FOUND";
            throw error;
        }

        // 2. Check Course Offered in Period (409)
        // offering มาจาก courseRepo ซึ่งยังเป็น snake_case (semester_id) อยู่ อันนี้ถูกต้องแล้ว
        if (offering.semester_id !== semesterId) {
            const error = new Error("This course offering is not in the same semester as the current reservation period.");
            error.status = 409;
            error.code = "COURSE_NOT_OFFERRED_IN_PERIOD";
            throw error;
        }

        // 3. Check Already Reserved (409)
        const existing = await reservationRepo.findReservation(studentId, courseOfferingId);
        if (existing) {
            const error = new Error("A reservation already exists for this course offering.");
            error.status = 409;
            error.code = "ALREADY_RESERVED";
            throw error;
        }

        // 4. Check Credit Limit (409)
        const currentCredits = await reservationRepo.getTotalCredits(studentId, semesterId);
        if (Number(currentCredits) + offering.credits > limit) {
            const error = new Error("Reserving this course would exceed the cumulative credit limit for the current reservation period.");
            error.status = 409;
            error.code = "CREDIT_LIMIT_EXCEEDED";
            throw error;
        }

        // 5. Create (201)
        const newReservation = await reservationRepo.createReservation(studentId, courseOfferingId);
        return newReservation;
    },

    removeReservation: async function(studentId, courseOfferingId) {
        // 1. Check Period (403)
        const period = await periodService.validateReservationPeriod();
        const semesterId = period.semesterId; // *** FIX: ใช้ camelCase ***

        const offering = await courseRepo.findOfferingById(courseOfferingId);
        
        // 2. Check Course Offered in Period (409)
        // ต้องเช็คว่า offering มีค่าไหมก่อน (กัน code พัง)
        if (offering && offering.semester_id !== semesterId) {
             const error = new Error("This course offering is not in the same semester as the current reservation period.");
             error.status = 409;
             error.code = "COURSE_NOT_OFFERRED_IN_PERIOD";
             throw error;
        }

        // 3. Check Reservation Not Found (404)
        const existing = await reservationRepo.findReservation(studentId, courseOfferingId);
        if (!existing) {
             const error = new Error(`No reservation found for student with id=${studentId} and course offering id=${courseOfferingId}.`);
             error.status = 404;
             error.code = "RESERVATION_NOT_FOUND";
             throw error;
        }

        // 4. Delete (204)
        await reservationRepo.deleteReservation(studentId, courseOfferingId);
    }
};