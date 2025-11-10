document.addEventListener('DOMContentLoaded', () => {
  fetchStudyPlans();
});

async function fetchStudyPlans() {
  const API_URL = '/intproj25/PL-1/itb-ecors/api/v1/study-plans';

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
  // remove any existing dialog
  document.querySelectorAll('dialog.ecors-dialog').forEach(d => d.remove());

  const dialog = document.createElement('dialog');
  dialog.classList.add('ecors-dialog');
  dialog.setAttribute('closedby', 'none');
  dialog.innerHTML = `
    <div class="ecors-dialog-message">
      There is a problem. Please try again later.
    </div>
  `;
  document.body.appendChild(dialog);
  dialog.showModal();
}
