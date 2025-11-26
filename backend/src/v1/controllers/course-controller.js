const service = require("../services/course-service");

function error(code, message, statusCode){
    return { error: code, message: message, statusCode: statusCode };
}

module.exports = {
    getCourseOfferingsPlans: async function(req, res) {
        try {
            const result = await service.getCourseOfferingsPlans();
            res.status(200).json(result);
        } catch (e) {
            res.status(500).json(error("INTERNAL_ERROR", e.message, 500));
        }
    },

    getPlanCourses: async function(req, res) {
        try {
            const result = await service.getPlanCourses();
            res.status(200).json(result);
        } catch (e) {
            res.status(500).json(error("INTERNAL_ERROR", e.message, 500));
        }
    }
};