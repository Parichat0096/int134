document.addEventListener('DOMContentLoaded', () => {
  fetchStudyPlans();
});

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_HOST = isLocal ? 'http://localhost:3000' : '';
const API_PATH = '/intproj25/pl1/itb-ecors/api/v1/study-plans';
const API_URL = API_HOST + API_PATH;

async function fetchStudyPlans() {
  const tableBody = document.getElementById('planBody');
  if (!tableBody) return;

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    renderPlanTable(result);
  } catch (err) {
    console.error('Fetch error:', err);
    showErrorDialog();
  }
}

function renderPlanTable(plans) {
  const tableBody = document.getElementById('planBody');
  tableBody.innerHTML = '';

  if (!plans || plans.length === 0) return;

  plans.forEach(plan => {
    const tr = document.createElement('tr');
    tr.classList.add('ecors-row');
    tr.innerHTML = `
      <td class="ecors-id">${plan.id}</td>
      <td class="ecors-planCode">${plan.planCode}</td>
      <td class="ecors-nameEng">${plan.nameEng}</td>
      <td class="ecors-nameTh">${plan.nameTh}</td>
    `;
    tableBody.appendChild(tr);
  });
}

function showErrorDialog() {
  document.querySelectorAll('dialog.ecors-dialog').forEach(d => d.remove());

  const dialog = document.createElement('dialog');
  dialog.classList.add('ecors-dialog');
  dialog.setAttribute('closedby', 'none');
 dialog.innerHTML = `<div class="ecors-dialog-message">There is a problem. Please try again later.</div>`;
  dialog.addEventListener('cancel', event => event.preventDefault());

  document.body.appendChild(dialog);
  dialog.showModal();
}


///////////////reserve page////////////////////////////

//declare status

const declaredPlanEl = document.getElementById("ecors-declared-plan");
const studentId = window.sessionStorage.getItem("studentId"); // สมมติเก็บไว้ตอน login

async function loadDeclaredPlan() {
  try {
    const res = await fetch(`${apiBaseUrl}/students/${studentId}/declared-plan`);
    if (!res.ok) throw new Error("DECLARED_PLAN_NOT_FOUND");

    const data = await res.json();

    if (data && data.planId) {
      declaredPlanEl.textContent = `${data.planCode} - ${data.planNameEng}`;
    } else {
      declaredPlanEl.textContent = "Not declared plan";
    }
  } catch (err) {
    console.error(err);
    declaredPlanEl.textContent = "Not declared plan";
  }
}

document.addEventListener("DOMContentLoaded", loadDeclaredPlan);



// dropdown
const apiBaseUrl = isLocal ? 'http://localhost:3000/intproj25/pl1/itb-ecors/api/v1' : '/intproj25/pl1/itb-ecors/api/v1';

const dropdown = document.getElementById("ecors-dropdown-plan");
const declareBtn = document.getElementById("ecors-button-declare");

// major 
async function loadStudyPlans() {
  try {
    const response = await fetch(`${apiBaseUrl}/study-plans`);
    if (!response.ok) throw new Error("Failed to fetch study plans");

    const plans = await response.json();

    dropdown.innerHTML = '<option value="">-- Select a study plan --</option>';

    plans.forEach(plan => {
      const option = document.createElement("option");
      option.value = plan.id;              
      option.textContent = `${plan.planCode} - ${plan.nameEng}`; 
      dropdown.appendChild(option);
    });

  } catch (error) {
    console.error("Error loading study plans:", error);
    alert("Cannot load study plans. Please try again later.");
  }
}

dropdown.addEventListener("change", () => {
  declareBtn.disabled = dropdown.value === "";
});

document.addEventListener("DOMContentLoaded", loadStudyPlans);

















