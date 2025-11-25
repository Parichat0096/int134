class declarePlanDto {
  constructor(declare = {}) {
    const { student_id, plan_id, status , created_at, updated_at } = declare

    this.studentId = student_id ?? null
    this.planId = plan_id ?? "-"
    this.status = status ?? "-"
    this.createdAt = created_at ?? "-"
    this.updatedAt = updated_at ?? "-"

  }
}
module.exports = declarePlanDto;