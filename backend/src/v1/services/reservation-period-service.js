const repo = require("../repositories/reservation-period-repository.js");

module.exports = {
    getReservationPeriods: async function() {
        const periods = await repo.findActivePeriods();
        const now = new Date();
        
        // หา Current (ช่วงเวลาปัจจุบัน)
        const currentRow = periods.find(p => {
            const start = new Date(p.start_datetime);
            const end = new Date(p.end_datetime);
            return now >= start && now <= end;
        });

        // หา Next (ช่วงเวลาถัดไป)
        const nextRow = periods.find(p => {
            const start = new Date(p.start_datetime);
            return start > now;
        });

        // *** FIX: สร้างฟังก์ชันแปลง snake_case เป็น camelCase ให้ตรง Spec PDF หน้า 27 ***
        const mapPeriod = (p) => p ? {
            id: p.id,
            semesterId: p.semester_id, // แปลงจาก semester_id เป็น semesterId
            startDateTime: p.start_datetime, // แปลงเป็น camelCase
            endDateTime: p.end_datetime,     // แปลงเป็น camelCase
            cumulativeCreditLimit: p.cumulative_credit_limit // แปลงเป็น camelCase
        } : null;

        return { 
            currentPeriod: mapPeriod(currentRow), 
            nextPeriod: mapPeriod(nextRow) 
        };
    },

    validateReservationPeriod: async function() {
        // เรียกใช้ฟังก์ชันด้านบน ซึ่งจะได้ค่าเป็น camelCase แล้ว
        const { currentPeriod } = await this.getReservationPeriods();
        
        if (!currentPeriod) {
            const error = new Error("Cannot perform this action because the reservation period is currently closed.");
            error.code = "RESERVATION_PERIOD_CLOSED"; 
            error.status = 403;
            throw error;
        }
        return currentPeriod;
    }
}