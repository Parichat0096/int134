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
    status: dbRow.status,
  };
};

// GET
const findDeclaredPlan = async (studentId) => {
  const declaredPlanRow = await studentsRepository.findDeclaredPlanByStudentId(studentId);

  if (!declaredPlanRow) {
    const err = new Error("DECLARED_PLAN_NOT_FOUND");
    err.httpStatus = 404;
    err.messageText = `No declared plan found for student with id=${studentId}.`;
    throw err;
  }

  return mapDeclarationForApiResponse(declaredPlanRow);
};

// POST
const createDeclaration = async (studentId, planId) => {
  const existing = await studentsRepository.findDeclaredPlanByStudentId(studentId);

  if (existing) {
    if (existing.status === "DECLARED") {
      const err = new Error("ALREADY_DECLARED");
      err.httpStatus = 409;
      throw err;
    }
    if (existing.status === "CANCELLED") {
      // update only: keep createdAt the same
      await studentsRepository.updatePlan(studentId, planId);
    }
  } else {
    await studentsRepository.create(studentId, planId);
  }

  const row = await studentsRepository.findDeclaredPlanByStudentId(studentId);
  return mapDeclarationForApiResponse(row);
};

// PUT
const changePlan = async (studentId, planId) => {
  const existing = await studentsRepository.findDeclaredPlanByStudentId(studentId);

  if (!existing) {
    const err = new Error("DECLARED_PLAN_NOT_FOUND");
    err.httpStatus = 404;
    err.messageText = `No declared plan found for student with id=${studentId}.`;
    throw err;
  }

  if (existing.status === "CANCELLED") {
    const err = new Error("CANCELLED_DECLARED_PLAN");
    err.httpStatus = 409;
    err.messageText = "Cannot update the declared plan because it has been cancelled.";
    throw err;
  }

  await studentsRepository.updatePlan(studentId, planId);

  const updated = await studentsRepository.findDeclaredPlanByStudentId(studentId);
  return mapDeclarationForApiResponse(updated);
};

// DELETE
const cancelPlan = async (studentId) => {
  const existing = await studentsRepository.findDeclaredPlanByStudentId(studentId);

  if (!existing) {
    const err = new Error("DECLARED_PLAN_NOT_FOUND");
    err.httpStatus = 404;
    err.messageText = `No declared plan found for student with id=${studentId}.`;
    throw err;
  }

  if (existing.status === "CANCELLED") {
    const err = new Error("CANCELLED_DECLARED_PLAN");
    err.httpStatus = 409;
    err.messageText = "Cannot cancel the declared plan because it is already cancelled.";
    throw err;
  }

  await studentsRepository.cancelPlan(studentId);

  const updated = await studentsRepository.findDeclaredPlanByStudentId(studentId);
  return mapDeclarationForApiResponse(updated);
};

module.exports = {
  findDeclaredPlan,
  createDeclaration,
  changePlan,
  cancelPlan,
};
