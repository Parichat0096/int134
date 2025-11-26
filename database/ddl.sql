-- สร้าง Database และเลือกใช้
CREATE DATABASE IF NOT EXISTS pl1
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pl1;

SET NAMES utf8mb4;

-- 1. ตาราง Semesters (เทอม)
CREATE TABLE semesters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(6) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);

-- 2. ตาราง Courses (วิชาทั้งหมด)
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(6) NOT NULL,
  title VARCHAR(100) NOT NULL,
  credits INT NOT NULL
);

-- 3. ตาราง Study Plans (แผนการเรียน - ของเดิม)
CREATE TABLE study_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plan_code CHAR(2) UNIQUE NOT NULL,
  name_eng VARCHAR(60) NOT NULL,
  name_th VARCHAR(100) NOT NULL
);

-- 4. ตาราง Plan Core Courses (วิชาแกนของแต่ละแผน)
CREATE TABLE plan_core_courses (
  plan_id INT NOT NULL,
  course_id INT NOT NULL,
  PRIMARY KEY (plan_id, course_id),
  FOREIGN KEY (plan_id) REFERENCES study_plans(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 5. ตาราง Declared Plans (การเลือกแผน - ของเดิม)
CREATE TABLE declared_plans (
  student_id CHAR(11) PRIMARY KEY,
  plan_id INT NOT NULL,
  status ENUM('DECLARED', 'CANCELLED') DEFAULT 'DECLARED',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (plan_id) REFERENCES study_plans(id)
);

-- 6. ตาราง Reservation Periods (ช่วงเวลาจอง)
CREATE TABLE reservation_periods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  semester_id INT NOT NULL,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  cumulative_credit_limit INT NOT NULL,
  is_active TINYINT DEFAULT 1,
  FOREIGN KEY (semester_id) REFERENCES semesters(id)
);

-- 7. ตาราง Course Offerings (วิชาที่เปิดสอนในเทอม)
CREATE TABLE course_offerings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  semester_id INT NOT NULL,
  course_id INT NOT NULL,
  capacity INT DEFAULT 40,
  FOREIGN KEY (semester_id) REFERENCES semesters(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 8. ตาราง Course Reservations (การจองรายวิชาของนักศึกษา)
CREATE TABLE course_reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id CHAR(11) NOT NULL,
  course_offering_id INT NOT NULL,
  reserved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_offering_id) REFERENCES course_offerings(id),
  -- 1 คน จอง section เดิมซ้ำไม่ได้
  UNIQUE KEY unique_student_reservation (student_id, course_offering_id) 
);