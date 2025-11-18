const studentsRepository = require("../repositories/students.repository");

const mapDeclarationForApiResponse = (dbRow) => {
  if (!dbRow) return null;
  return {
    studentId: dbRow.student_id,
    planId: dbRow.plan_id,
    planCode: dbRow.plan_code,
    planNameEng: dbRow.name_eng,
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
    status: dbRow.status, // PBI 7
  };
};

const findDeclaredPlan = async (studentId) => {
  const declaredPlanRow = await studentsRepository.findDeclaredPlanByStudentId(
    studentId
  );

  if (!declaredPlanRow) {
    throw new Error("DECLARED_PLAN_NOT_FOUND");
  }

  return mapDeclarationForApiResponse(declaredPlanRow);
};

const createDeclaration = async (studentId, planId) => {
  const existingPlan = await studentsRepository.findDeclaredPlanByStudentId(
    studentId
  );

  if (existingPlan) {
    if (existingPlan.status === "DECLARED") {
      throw new Error("ALREADY_DECLARED");
    }
    
    if (existingPlan.status === "CANCELLED") {
      await studentsRepository.updatePlan(studentId, planId);
    }
  } else {
    await studentsRepository.create(studentId, planId);
  }

  const declaredPlanRow = await studentsRepository.findDeclaredPlanByStudentId(
    studentId
  );
  return mapDeclarationForApiResponse(declaredPlanRow);
};

const changePlan = async (studentId, planId) => {
  const existingPlan = await studentsRepository.findDeclaredPlanByStudentId(
    studentId
  );

  if (!existingPlan) {
    throw new Error("DECLARED_PLAN_NOT_FOUND");
  }

  if (existingPlan.status === "CANCELLED") {
    throw new Error("CANCELLED_DECLARED_PLAN");
  }

  await studentsRepository.updatePlan(studentId, planId);

  const updatedPlanRow = await studentsRepository.findDeclaredPlanByStudentId(
    studentId
  );
  return mapDeclarationForApiResponse(updatedPlanRow);
};

const cancelPlan = async (studentId) => {
  const existingPlan = await studentsRepository.findDeclaredPlanByStudentId(
    studentId
  );

  if (!existingPlan) {
   
    throw new Error("DECLARED_PLAN_NOT_FOUND");
  }

  if (existingPlan.status === "CANCELLED") {
    throw new Error("CANCELLED_DECLARED_PLAN");
  }
  await studentsRepository.cancelPlan(studentId);

  const cancelledPlanRow = await studentsRepository.findDeclaredPlanByStudentId(
    studentId
  );
  return mapDeclarationForApiResponse(cancelledPlanRow);
};

module.exports = {
  findDeclaredPlan,
  createDeclaration,
  changePlan, 
  cancelPlan,
};