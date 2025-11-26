USE pl1;
SET NAMES utf8mb4;

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

INSERT INTO semesters (name, start_date, end_date) VALUES 
('1/2025', '2025-06-01', '2025-10-31'),
('2/2025', '2025-11-01', '2026-03-31');

-- 3. Insert Courses (วิชาต่างๆ)
INSERT INTO courses (code, title, credits) VALUES 
('INT220', 'UX Design', 3),
('INT241', 'Data Structures and Algorithms', 3),
('INT242', 'Java Programming', 3),
('INT250', 'CSS Framework', 2),
('INT251', 'Frontend Development Framework', 2);

insert into declared_plans (student_id,plan_id,created_at,updated_at)value
('67130500140', 3, '2025-11-10 14:15:16', '2025-11-10 17:18:19'),
('67130500141', 4, '2025-11-10 15:59:59', '2025-11-10 15:59:59');

-- 4. Map Plan Core Courses (ผูกวิชากับแผน)
-- สมมติ: Frontend (1) เรียน INT250, INT251
INSERT INTO plan_core_courses (plan_id, course_id) VALUES 
(1, 4), (1, 5), 
-- Backend (2) เรียน INT242
(2, 3),
-- Full-Stack (3) เรียน INT250, INT251, INT242
(3, 3), (3, 4), (3, 5);

-- 5. Insert Declared Plans (ข้อมูลนักศึกษาที่เลือกแผนแล้ว)
INSERT INTO declared_plans (student_id, plan_id, status) VALUES 
('64000000001', 3, 'DECLARED');

-- 6. Insert Reservation Periods ***(สำคัญ: กำหนดให้ช่วงจองคือ วันนี้!)***
-- Active Period (เริ่มเมื่อวาน - จบอีก 2 วันข้างหน้า)
INSERT INTO reservation_periods (semester_id, start_datetime, end_datetime, cumulative_credit_limit, is_active) 
VALUES 
(2, NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 2 DAY, 9, 1);


INSERT INTO reservation_periods (semester_id, start_datetime, end_datetime, cumulative_credit_limit, is_active) 
VALUES 
(2, NOW() + INTERVAL 5 DAY, NOW() + INTERVAL 10 DAY, 12, 1);

-- 7. Insert Course Offerings (วิชาที่เปิดให้ลงในเทอมนี้)
INSERT INTO course_offerings (semester_id, course_id, capacity) VALUES 
(2, 1, 40), -- UX Design
(2, 2, 40), -- Data Structures
(2, 3, 40), -- Java
(2, 4, 40), -- CSS
(2, 5, 40); -- Frontend