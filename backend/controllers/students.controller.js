const studentsService = require("../services/students.service");

const getDeclaredPlan = async (req, res, next) => {
  const studentId = req.params.studentId;

  try {
    const declaredPlan = await studentsService.findDeclaredPlan(studentId);
    res.status(200).json(declaredPlan);
  } catch (error) {
    if (error.message === "DECLARED_PLAN_NOT_FOUND") {
      return res.status(404).json({
        error: "DECLARED_PLAN_NOT_FOUND",
        message: `No declared plan found for student with id ${studentId}.`,
      });
    }
    next(error);
  }
};

const declarePlan = async (req, res, next) => {
  const studentId = req.params.studentId;
  const { planId } = req.body;

  if (!planId) {
    return res
      .status(400)
      .json({ message: "planId is required in the request body." });
  }

  try {
    // Service handles logic for both new declaration and re-declaration (from CANCELLED)
    const newDeclaration = await studentsService.createDeclaration(
      studentId,
      planId
    );
    
    // POST returns 201 Created even when updating a CANCELLED record 
    res.status(201).json(newDeclaration);
  } catch (error) {
    if (error.message === "ALREADY_DECLARED") {
      return res.status(409).json({
        error: "ALREADY_DECLARED",
        message: "A declaration already exists for this student.",
      });
    }
    next(error);
  }
};

// --- NEW FOR SPRINT 3 (PBI 5 & 7) ---
const changePlan = async (req, res, next) => {
  const studentId = req.params.studentId;
  const { planId } = req.body;

  if (!planId) {
    return res
      .status(400)
      .json({ message: "planId is required in the request body." });
  }

  try {
    const updatedPlan = await studentsService.changePlan(studentId, planId);
    
    // Per PBI 5, PUT returns 200 OK 
    res.status(200).json(updatedPlan);
  } catch (error) {
    if (error.message === "DECLARED_PLAN_NOT_FOUND") {
      return res.status(404).json({
        error: "DECLARED_PLAN_NOT_FOUND",
        message: `No declared plan found for student with id ${studentId}.`,
      });
    }
    if (error.message === "CANCELLED_DECLARED_PLAN") {
      return res.status(409).json({
        error: "CANCELLED_DECLARED_PLAN",
        message: "Cannot update the declared plan because it has been cancelled.",
      });
    }
    next(error);
  }
};

const cancelPlan = async (req, res, next) => {
  const studentId = req.params.studentId;

  try {
    const cancelledPlan = await studentsService.cancelPlan(studentId);
    res.status(200).json(cancelledPlan);
  } catch (error) {
    if (error.message === "DECLARED_PLAN_NOT_FOUND") {
      return res.status(404).json({
        error: "DECLARED_PLAN_NOT_FOUND",
        message: `No declared plan found for student with id ${studentId}.`,
      });
    }
    if (error.message === "CANCELLED_DECLARED_PLAN") {
      return res.status(409).json({
        error: "CANCELLED_DECLARED_PLAN",
        message: "Cannot cancel the declared plan because it is already cancelled.",
      });
    }
    next(error);
  }
};

module.exports = {
  getDeclaredPlan,
  declarePlan,
  changePlan, 
  cancelPlan, 
};