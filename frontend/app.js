// ======================= CONFIGURATION (index.html) =======================
const isLocal_index =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// เปลี่ยนเป็น TEAM CODE ของคุณ เช่น pl1 / ft / ct เป็นต้น
const TEAM_CODE = "pl1";

const API_HOST_index = isLocal_index
  ? "http://localhost:3000"
  : "https://bscit.sit.kmutt.ac.th";

const API_URL_index = `${API_HOST_index}/intproj25/${TEAM_CODE}/itb-ecors/api/v1/study-plans`;

// ======================= STUDY PLAN TABLE (index.html) =======================
document.addEventListener("DOMContentLoaded", () => {
  fetchStudyPlans();
});

// ดึงข้อมูลแผนการเรียน
async function fetchStudyPlans() {
  const tableBody = document.getElementById("planBody");
  if (!tableBody) return;

  try {
    const res = await fetch(API_URL_index);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const result = await res.json();
    renderPlanTable(result);
  } catch (err) {
    console.error("Fetch error:", err);
    tableBody.innerHTML =
      '<tr><td colspan="4">Cannot load study plans.</td></tr>';
    showErrorDialog("There is a problem. Please try again later.");
  }
}

// แสดงข้อมูลในตาราง
function renderPlanTable(plans) {
  const tableBody = document.getElementById("planBody");
  tableBody.innerHTML = "";

  if (!plans || plans.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="4">No study plans found.</td></tr>';
    return;
  }

  plans.forEach((plan) => {
    const tr = document.createElement("tr");
    tr.classList.add("ecors-row");

    tr.innerHTML = `
      <td class="ecors-id">${plan.id}</td>
      <td class="ecors-studyCode">${plan.planCode}</td>
      <td class="ecors-nameEng">${plan.nameEng}</td>
      <td class="ecors-nameTh">${plan.nameTh}</td>
    `;

    tableBody.appendChild(tr);
  });
}

// แสดงกล่องข้อความ Error
function showErrorDialog(message) {
  document.querySelectorAll("dialog.ecors-dialog").forEach((d) => d.remove());

  const dialog = document.createElement("dialog");
  dialog.classList.add("ecors-dialog");
  dialog.setAttribute("closedby", "none");

  dialog.innerHTML = `
    <div class="ecors-dialog-message">${message}</div>
    <form method="dialog">
      <button class="ecors-button-dialog">OK</button>
    </form>
  `;

  dialog.addEventListener("cancel", (e) => e.preventDefault());
  document.body.appendChild(dialog);
  dialog.showModal();
}
