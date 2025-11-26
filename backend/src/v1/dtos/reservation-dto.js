class ReservationDto {
    constructor(reservation = {}) {
        this.studentId = reservation.student_id;
        this.courseOfferingId = reservation.course_offering_id;
        this.courseId = reservation.course_id;
        this.courseCode = reservation.code;
        this.courseTitle = reservation.title;
        this.courseCredits = reservation.credits;
        this.reservedAt = reservation.reserved_at;
    }
}

module.exports = ReservationDto;