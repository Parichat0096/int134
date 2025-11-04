const studyPlansService = require('../services/studyPlans.service');

const getStudyPlans = async (req, res, next) => {
  try {
    const studyPlans = await studyPlansService.getAllStudyPlans();
    res.status(200).json(studyPlans);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudyPlans,
};