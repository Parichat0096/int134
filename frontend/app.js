document.addEventListener('DOMContentLoaded', () => {
    fetchStudyPlans();
  });
  
async function fetchStudyPlans() {
  const API_URL = '/intproj25/PL-1/itb-ecors/api/v1/study-plans';

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderPlanTable(data);
  } catch (err) {
    console.error('Fetch error:', err);
    showErrorModal();
  }
}
  
  // ตาราง
  function renderPlanTable(plans) {
    const tableBody = document.getElementById('planBody');
    if (!tableBody) return;
  
    if (!plans || plans.length === 0) {
      tableBody.innerHTML = `
       `;
      return;
    }
  
    tableBody.innerHTML = plans
      .map(plan => `
        <tr class="ecors-row">
          <td class="ecors-id">${plan.id}</td>
          <td class="ecors-studyCode">${plan.planCode}</td>
          <td class="ecors-nameEng">${plan.nameEng}</td>
          <td class="ecors-nameTh">${plan.nameTh}</td>
        </tr>
      `)
      .join('');
  }
  
  // dialog error
function showErrorModal() {
    const dialog = document.getElementById('errorDialog');
    if (dialog) {
      dialog.classList.add('active');
    } else {
      alert('There is a problem. Please try again later.');
    }
}