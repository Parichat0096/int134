document.addEventListener('DOMContentLoaded', () => {
  fetchStudyPlans();
});

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_HOST = isLocal ? 'http://localhost:3000' : '';
const API_PATH = '/intproj25/PL-1/itb-ecors/api/v1/study-plans';
const API_URL = API_HOST + API_PATH;

async function fetchStudyPlans() {
  const tableBody = document.getElementById('planBody');
  if (!tableBody) return;

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    renderPlanTable(result.data);
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
