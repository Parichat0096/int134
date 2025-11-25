var declarePlanDto = require("../dtos/declare-dto.js");
const { changeDeclared } = require("../repositories/declare-repository.js");
var service = require("../services/declare-service.js")

function error(error, message, statusCode){
    return {
        error: error,
        statusCode: statusCode,
        message: message
    };
}

module.exports = {
    getById : async function(req,res) {
        try{
            const id = req.params.id // รับ ID มาจาก ROUTER แล้วต้องเอาไปทำเป็น String
            const declaredPlan = await service.getdeclareById(id.toString())

            const result = new declarePlanDto(declaredPlan) // อันนี้เราเอาเข้า dto ปล.เหตุผลที่ไม่ map
            //เพราะรับมาเป็น row[0] มันเป็น {object มาเลย}

            res.status(200).json(result) 
        }
        catch(e){
            const status = e.status || 500
            res.status(status).json(error(e.code, e.message, status))
        }//ส่งคืนปกติถ้าเจอ error
    },

    adddeclare : async function (req,res) {
        try{
            const id = req.params.id
            const Body = req.body

            const create = await service.createdeclare(id,Body.planId) // อย่าลืมFrontให้ส่งมาเป็น PlanId
            const result = new declarePlanDto(create)
            res.status(201).json(result)
        }
        catch(e){
            const status = e.status || 500
            res.status(status).json(error(e.code, e.message, status))
        }
    },
    changeDeclared: async function(req,res){
        try{
            const id = req.params.id
            const {planId} = req.body
            const declaredPlan = await service.changeDeclared(id,planId)
            const result = new declarePlanDto(declaredPlan)
            res.json(result)
        }catch (e){
            res.status(e.status).json(error(e.error,e.message,e.status));
        }
    },
    deleteDeclared: async function(req,res){
        try{
            const id = req.params.id
            const declaredPlan = await service.deleteDeclared(id)
            const result = new declarePlanDto(declaredPlan)
            res.status(200).json(result)
        }catch (e){
            res.status(e.status).json(error(e.error,e.message,e.status));
        }
    }
}