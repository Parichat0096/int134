const service = require("../services/reservation-service");
const ReservationDto = require("../dtos/reservation-dto");

function error(code, message, statusCode){
    return { error: code, message: message, statusCode: statusCode };
}

module.exports = {
    listReservations: async function(req, res) {
        try {
            const studentId = req.params.studentId;
            const result = await service.getStudentReservations(studentId);
            // Map reservedCourses to DTO
            result.reservedCourses = result.reservedCourses.map(r => new ReservationDto(r));
            res.status(200).json(result);
        } catch (e) {
            const status = e.status || 500;
            res.status(status).json(error(e.code, e.message, status));
        }
    },

    createReservation: async function(req, res) {
        try {
            const studentId = req.params.studentId;
            const { courseOfferingId } = req.body;
            const result = await service.createReservation(studentId, courseOfferingId);
            res.status(201).json(new ReservationDto(result));
        } catch (e) {
            const status = e.status || 500;
            res.status(status).json(error(e.code, e.message, status));
        }
    },
    removeReservation: async function(req, res) {
        try {
            const studentId = req.params.studentId;
            const courseOfferingId = req.params.courseOfferingId;
            
            await service.removeReservation(studentId, courseOfferingId);
            
            res.status(204).send(); // 204 No Content
        } catch (e) {
            const status = e.status || 500;
            // ถ้าเป็น 204 ไม่ต้องส่ง body แต่ถ้า error ต้องส่ง json
            res.status(status).json(error(e.code, e.message, status));
        }
    }
};