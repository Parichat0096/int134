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
    const newDeclaration = await studentsService.createDeclaration(
      studentId,
      planId
    );

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

module.exports = {
  getDeclaredPlan,
  declarePlan,
};
