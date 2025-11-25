const repo = require("../repositories/delacre-repository.js")

module.exports = {
    getAllDelacre: async function() {
        const delacre = await repo.findAll();
        return delacre
    },
    getDelacreById: async function(id){
        const delacre = await repo.findById(id);
        if(!delacre){
                const error = new Error(`not found ${id} in declared_plans table (the student has not declared a study plan)`)
                error.status = 404;
                throw error
        }//อันนี้คือสมมุติข้อมูลมันไม่มี อันดิฟาย มาให้ สร้าง error404 แล้ว Catch จะจับ error
        return delacre
    },
    createDelacre: async function(id,planId) {
        const student = await repo.findById(id) //ดึง Delacre มาดูจาก serive จาก repo
        if(student){
            if(student.status === "DECLARED"){
                const error = new Error(`A declaration record already exists for the student with id = ${id}. No new record is created.`)
                error.status = 409;
                throw error
            }//เรา GET ข้อมูลว่าดูว่า ซ้ำมั้ยถ้าซ้ำส่ง error
            if(student.status === "CANCELLED"){
                const declaredNew = await repo.changeDeclared(id,planId)
                return declaredNew
            }
        }
        const created = await repo.createDelacre(id,planId)
        return created
    },
    changeDeclared: async function(id,planId) {
        const student = await repo.findById(id)
        if(!student){
            const error = new Error()
            error.error = "DECLARED_PLAN_NOT_FOUND"
            error.message = `No declared plan found for student with id=${id}.`
            error.status = 404
            throw error
        }
        if(student.status === "CANCELLED"){
            const error = new Error()
            error.error = "CANCELLED_DECLARED_PLAN"
            error.message = `Cannot update the declared plan because it has been cancelled.`
            error.status = 409
            throw error
        }
        const declaredNew = await repo.changeDeclared(id,planId)
        return declaredNew
    },
    deleteDeclared: async function(id) {
        const student = await repo.findById(id)
        if(!student){
            const error = new Error()
            error.error = "DECLARED_PLAN_NOT_FOUND"
            error.message = `No declared plan found for student with id=${id}.`
            error.status = 404
            throw error
        }
        if(student.status === "CANCELLED"){
            const error = new Error()
            error.error = "CANCELLED_DECLARED_PLAN"
            error.message = `Cannot cancel the declared plan because it is already cancelled.`
            error.status = 409
            throw error
        }
        const declaredCancel = await repo.deleteDeclared(id)
        return declaredCancel
    }
}