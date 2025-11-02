import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ดึงรายวิชา
app.get("/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "DB Error" });
    }
    res.json(results);
  });
});

// ลงทะเบียนเรียน
app.post("/enroll", (req, res) => {
  const { student_name, course_id } = req.body;
  if (!student_name || !course_id)
    return res.status(400).json({ message: "Missing data" });

  db.query(
    "INSERT INTO enrollments (student_name, course_id) VALUES (?, ?)",
    [student_name, course_id],
    (err) => {
      if (err) return res.status(500).json({ message: "Insert failed" });
      res.json({ message: "Enrollment successful!" });
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});