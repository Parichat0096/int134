// ======================= CONFIGURATION (index.html) =======================
const isLocal_index = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_HOST_index = isLocal_index ? 'http://localhost:3000' : '';

// FIXED: This path should match your other API calls (using 'ft')
const API_URL_index = `${API_HOST_index}/intproj25/pl1/itb-ecors/api/v1/study-plans`;

// ======================= STUDY PLAN TABLE (index.html) =======================
document.addEventListener('DOMContentLoaded', () => {
  fetchStudyPlans();

  // ปุ่ม Manage -> ไปหน้า reserve.html
  const manageButton = document.getElementById('ecors-button-manage');
  if (manageButton) {
    manageButton.addEventListener('click', () => {
      window.location.href = 'reserve.html'; 
    });
  }
});

// ดึงข้อมูลแผนการเรียน
async function fetchStudyPlans() {
  const tableBody = document.getElementById('planBody');
  if (!tableBody) return;

  try {
    const res = await fetch(API_URL_index);
    if (!res.ok) throw new Error(`HTTP ${res.status}`); 

    const result = await res.json();
    renderPlanTable(result);
  } catch (err) {
    console.error('Fetch error:', err);
    showErrorDialog("There is a problem. Please try again later."); 
  }
}

// แสดงข้อมูลในตาราง
function renderPlanTable(plans) {
  const tableBody = document.getElementById('planBody');
  tableBody.innerHTML = '';

  if (!plans || plans.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4">No study plans found.</td></tr>';
    return;
  }

  plans.forEach(plan => { 
    const tr = document.createElement('tr');
    tr.classList.add('ecors-row');
    // Note: Assuming your API returns 'planCode', 'nameEng', 'nameTh'
    tr.innerHTML = `
      <td class="ecors-id">${plan.id}</td>
      <td class="ecors-planCode">${plan.planCode}</td>
      <td class="ecors-nameEng">${plan.nameEng}</td>
      <td class="ecors-nameTh">${plan.nameTh}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// แสดงกล่องข้อความ Error
function showErrorDialog(message) {
  document.querySelectorAll('dialog.ecors-dialog').forEach(d => d.remove());

  const dialog = document.createElement('dialog');
  dialog.classList.add('ecors-dialog');
  dialog.setAttribute('closedby', 'none');
  dialog.innerHTML = `
    <div class="ecors-dialog-message">${message}</div>
    <form method="dialog">
    </form>
  `;

  dialog.addEventListener('cancel', e => e.preventDefault());
  document.body.appendChild(dialog);
  dialog.showModal();
}