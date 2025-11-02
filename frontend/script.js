const apiBase = "http://localhost:5000";

async function loadCourses() {
  const res = await fetch(`${apiBase}/courses`);
  const data = await res.json();

  const select = document.getElementById("courseList");
  select.innerHTML = data
    .map((c) => `<option value="${c.id}">${c.course_name}</option>`)
    .join("");
}

document.getElementById("enrollBtn").addEventListener("click", async () => {
  const name = document.getElementById("studentName").value;
  const courseId = document.getElementById("courseList").value;

  const res = await fetch(`${apiBase}/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_name: name, course_id: courseId }),
  });

  const result = await res.json();
  document.getElementById("result").textContent = result.message;
});

loadCourses();