const repo = require("../repositories/plan-repository")

module.exports = {
    getAllPlan: async function(){
        const plans = await repo.findAll();
        return plans
    }
}