var service = require("../services/plan-service.js")
var studyPlanDto = require("../dtos/plan-dto.js")

function error(req, error, message, statusCode){
    return {
        error: error,
        statusCode: statusCode,
        message: message,
        path: req.originalUrl,
        timestamp: new Date().toLocaleDateString()
    };
}

module.exports = {
    list: async function(req, res){
        try{
            const plans = await service.getAllPlan();
            const result = plans.map(row => new studyPlanDto(row));
            res.json(result);
        } catch (e){
            const status = e.status || 500
            res.status(status).json(error(req, e.code, e.message, status))
        }
    }
}