const declaredPlansService = require("../services/students.service");

// GET /students/:id/declared-plan
const getDeclaredPlan = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const result = await declaredPlansService.findDeclaredPlan(studentId);
    return res.status(200).json(result);
  } catch (err) {
    if (err.httpStatus === 404) {
      return res.status(404).json({
        error: "DECLARED_PLAN_NOT_FOUND",
        message: err.messageText,
      });
    }
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

// POST /students/:id/declared-plan
const declarePlan = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const { planId } = req.body;

    const data = await declaredPlansService.createDeclaration(studentId, planId);
    return res.status(201).json(data);
  } catch (err) {
    if (err.httpStatus === 409 && err.message === "ALREADY_DECLARED") {
      return res.status(409).json({
        error: "ALREADY_DECLARED",
        message: "Declared plan already exists.",
      });
    }
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

// PUT /students/:id/declared-plan
const updateDeclaration = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const { planId } = req.body;

    const data = await declaredPlansService.changePlan(studentId, planId);
    return res.status(200).json(data);
  } catch (err) {
    if (err.httpStatus === 404) {
      return res.status(404).json({
        error: "DECLARED_PLAN_NOT_FOUND",
        message: err.messageText,
      });
    }
    if (err.httpStatus === 409 && err.message === "CANCELLED_DECLARED_PLAN") {
      return res.status(409).json({
        error: "CANCELLED_DECLARED_PLAN",
        message: "Cannot update the declared plan because it has been cancelled.",
      });
    }
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

// DELETE /students/:id/declared-plan
const cancelDeclaration = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const data = await declaredPlansService.cancelPlan(studentId);
    return res.status(200).json(data);
  } catch (err) {
    if (err.httpStatus === 404) {
      return res.status(404).json({
        error: "DECLARED_PLAN_NOT_FOUND",
        message: err.messageText,
      });
    }
    if (err.httpStatus === 409 && err.message === "CANCELLED_DECLARED_PLAN") {
      return res.status(409).json({
        error: "CANCELLED_DECLARED_PLAN",
        message: "Cannot cancel the declared plan because it is already cancelled.",
      });
    }
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

module.exports = {
  getDeclaredPlan,
  declarePlan,
  updateDeclaration,
  cancelDeclaration,
};
