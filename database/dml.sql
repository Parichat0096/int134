USE pl1;
SET NAMES utf8mb4;

-- 1. Plans (แผนการเรียน)
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

-- 2. Semesters (เทอม)
INSERT INTO semesters (name, start_date, end_date) VALUES 
('1/2025', '2025-06-01', '2025-10-31'),
('2/2025', '2025-11-01', '2026-03-31');

-- 3. Courses (วิชาต่างๆ)
INSERT INTO courses (code, title, credits) VALUES 
('INT220', 'UX Design', 3),
('INT241', 'Data Structures and Algorithms', 3),
('INT242', 'Java Programming', 3),
('INT250', 'CSS Framework', 2),
('INT251', 'Frontend Development Framework', 2),
('INT101', 'Programming Fundamentals', 3),
('INT201', 'Network 1', 3),
('INT202', 'Server Side 1', 3),
('INT205', 'Database Management', 3);

-- 4. Declared Plans (นักศึกษาที่เลือกแผนแล้ว)
INSERT INTO declared_plans (student_id,plan_id,created_at,updated_at) VALUES
('67130500140', 3, '2025-11-10 14:15:16', '2025-11-10 17:18:19'),
('67130500141', 4, '2025-11-10 15:59:59', '2025-11-10 15:59:59'),
('64000000001', 3, NOW(), NOW());

-- 5. Plan Core Courses (วิชาแกน)
INSERT INTO plan_core_courses (plan_id, course_id) VALUES 
-- Frontend (1): เรียน INT250, INT251
(1, 4), (1, 5), 
-- Backend (2): เรียน INT242
(2, 3),
-- Full-Stack (3): เรียน INT250, INT251, INT242, INT202
(3, 3), (3, 4), (3, 5), (3, 8);

-- 6. Reservation Periods (ช่วงเวลาจอง)
-- แก้ไข dml.sql ให้เป็นเวลา UTC
INSERT INTO reservation_periods (semester_id, start_datetime, end_datetime, cumulative_credit_limit, is_active) 
VALUES 
-- รอบปัจจุบัน: ต้องการ 09:00 - 18:00 (ไทย) => ต้องใส่ 02:00 - 11:00 (UTC)
(2, '2025-11-25 02:00:00', '2025-11-27 11:00:00', 9, 1),

-- รอบถัดไป: ต้องการ 09:00 - 17:00 (ไทย) => ต้องใส่ 02:00 - 10:00 (UTC)
(2, '2025-11-28 02:00:00', '2025-12-01 10:00:00', 12, 1);

-- 7. Course Offerings (วิชาที่เปิดสอนเทอม 2/2025)
INSERT INTO course_offerings (semester_id, course_id, capacity) VALUES 
(2, 1, 40), -- UX Design
(2, 2, 40), -- Data Structures
(2, 3, 40), -- Java
(2, 4, 40), -- CSS
(2, 5, 40), -- Frontend
(2, 8, 40); -- Server Side 1