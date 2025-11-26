const service = require("../services/reservation-period-service.js");

function error(code, message, statusCode){
    return { error: code, message: message, statusCode: statusCode };
}

module.exports = {
    getPeriods: async function(req, res) {
        try {
            const result = await service.getReservationPeriods();
            res.status(200).json(result);
        } catch (e) {
            const status = e.status || 500;
            res.status(status).json(error(e.code || "INTERNAL_ERROR", e.message, status));
        }
    }
}