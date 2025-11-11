SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS mydb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mydb;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS declared_plans;
DROP TABLE IF EXISTS study_plans;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS study_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plan_code CHAR(2) NOT NULL UNIQUE,
  name_eng VARCHAR(60) NOT NULL,
  name_th VARCHAR(100) NOT NULL
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS declared_plans (
  student_id VARCHAR(11) PRIMARY KEY,
  plan_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES study_plans(id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE study_plans AUTO_INCREMENT = 1;

INSERT INTO study_plans (plan_code, name_eng, name_th) VALUES
('FE', 'Frontend Developer', 'นักพัฒนาฟรอนเอนด์'),
('BE', 'Backend Developer', 'นักพัฒนาแบ็กเอนด์'),
('FS', 'Full-Stack Developer', 'นักพัฒนาฟูลสแตก'),
('AI', 'AI Developer', 'นักพัฒนาปัญญาประดิษฐ์'),
('DS', 'Data Scientist', 'นักวิทยาการข้อมูล'),
('DA', 'Data Analyst', 'นักวิเคราะห์ข้อมูล'),
('DE', 'Data Engineer', 'วิศวกรข้อมูล'),
('DB', 'Database Administrator', 'ผู้ดูแลฐานข้อมูล'),
('UX', 'UX/UI Designer', 'นักออกแบบประสบการณ์ของผู้ใช้และส่วนต่อประสาน');

INSERT INTO declared_plans (student_id, plan_id, created_at, updated_at) VALUES
('67130500140', 3, '2025-11-11 00:18:19', '2025-11-11 00:18:19');

INSERT INTO declared_plans (student_id, plan_id, created_at, updated_at) VALUES
('67130500143', 9, '2025-11-10 23:00:00', '2025-11-10 23:00:00'); 
 
INSERT INTO declared_plans (student_id, plan_id, created_at, updated_at) VALUES
('67130500173', 1, '2025-11-11 01:09:08', '2025-11-11 01:09:08');