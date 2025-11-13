const studentsRepository = require('../repositories/students.repository');

const mapDeclaredPlanToDto = (dbRow) => {
    if (!dbRow) return null;

    return {
        studentId: dbRow.student_id,
        planId: dbRow.plan_id,
        planCode: dbRow.plan_code, 
        planNameEng: dbRow.name_eng, 
        createdAt: dbRow.created_at,
        updatedAt: dbRow.updated_at,
    };
};

const mapDeclarationForApiResponse = (dbRow) => {
    return {
        studentId: dbRow.student_id,
        planId: dbRow.plan_id,
        createdAt: dbRow.created_at.toISOString().replace(/\.000Z$/, 'Z'),
        updatedAt: dbRow.updated_at.toISOString().replace(/\.000Z$/, 'Z'),
    };
};

const findDeclaredPlan = async (studentId) => {
    const declaredPlanRow = await studentsRepository.findDeclaredPlanByStudentId(studentId);

    if (!declaredPlanRow) {
        throw new Error('DECLARED_PLAN_NOT_FOUND'); 
    }

    return mapDeclaredPlanToDto(declaredPlanRow);
};

const createDeclaration = async (studentId, planId) => {
  const existingPlan = await studentsRepository.findDeclaredPlanByStudentId(studentId);
  if (existingPlan) {
    throw new Error('ALREADY_DECLARED');
  }

  const newPlanRow = await studentsRepository.create(studentId, planId);

  const declaredPlanRow = await studentsRepository.findDeclaredPlanByStudentId(studentId);

  return mapDeclaredPlanToDto(declaredPlanRow);
};

module.exports = {
    findDeclaredPlan,
    createDeclaration,
};