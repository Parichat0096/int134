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

insert into declared_plans (student_id,plan_id,created_at,updated_at)value
('67130500140', 3, '2025-11-10 14:15:16', '2025-11-10 17:18:19'),
('67130500141', 4, '2025-11-10 15:59:59', '2025-11-10 15:59:59');