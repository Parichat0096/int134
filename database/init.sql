CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(100),
  course_id INT,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

INSERT INTO courses (course_name) VALUES
('Web Development'),
('Database Systems'),
('Data Structures');