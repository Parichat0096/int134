const studentsRepository = require('../repositories/students.repository');

// Format timestamp without changing timezone
// const formatDate = (d) => {
//     const pad = (n) => n.toString().padStart(2, '0');
//     return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
//         + `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.000Z`;
// };

const mapDeclarationForApiResponse = (dbRow) => {
    return {
        studentId: dbRow.student_id,
        planId: dbRow.plan_id,
        planCode: dbRow.plan_code,
        planNameEng: dbRow.name_eng,
        createdAt: dbRow.created_at,
        updatedAt: dbRow.updated_at,
    };
};

const findDeclaredPlan = async (studentId) => {
    const declaredPlanRow = await studentsRepository.findDeclaredPlanByStudentId(studentId);

    if (!declaredPlanRow) {
        throw new Error('DECLARED_PLAN_NOT_FOUND');
    }

    return mapDeclarationForApiResponse(declaredPlanRow);
};

const createDeclaration = async (studentId, planId) => {
    const existingPlan = await studentsRepository.findDeclaredPlanByStudentId(studentId);
    if (existingPlan) {
        throw new Error('ALREADY_DECLARED');
    }

    await studentsRepository.create(studentId, planId);

    const declaredPlanRow = await studentsRepository.findDeclaredPlanByStudentId(studentId);

    return mapDeclarationForApiResponse(declaredPlanRow);
};

module.exports = {
    findDeclaredPlan,
    createDeclaration,
};
