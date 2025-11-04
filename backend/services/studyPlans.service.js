const studyPlansRepository = require('../repositories/studyPlans.repository');

const mapToDto = (dbRow) => {
  return {
    id: dbRow.id,
    planCode: dbRow.plan_code,
    nameEng: dbRow.name_eng,
    nameTh: dbRow.name_th,
  };
};

const getAllStudyPlans = async () => {
  const planRows = await studyPlansRepository.findAll();
  return planRows.map(mapToDto);
};

module.exports = {
  getAllStudyPlans,
};