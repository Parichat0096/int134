class studyPlanDto {
  constructor(plan = {}) {
    const { id, plan_code, name_eng, name_th } = plan

    this.id = id ?? null
    this.planCode = plan_code ?? "-"
    this.nameEng = name_eng ?? "-"
    this.nameTh = name_th ?? "-"

  }
}
module.exports = studyPlanDto;