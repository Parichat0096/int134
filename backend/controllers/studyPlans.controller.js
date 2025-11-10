const studyPlansService = require('../services/studyPlans.service');

const getStudyPlans = async (req, res, next) => {
  try {
    const studyPlans = await studyPlansService.getAllStudyPlans();
    // Cypress: response ต้องเป็น { data: [...] }
    res.status(200).json({ data: studyPlans });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudyPlans,
};
