import { loadPlans } from "./management.js";

document.addEventListener("DOMContentLoaded", async () => {
  const plans = await loadPlans()
  renderTable(plans)
});
 
function renderTable(plans) {
  const table = document.querySelector(".planList");
 
  table.innerHTML = "";

  const safePlans = Array.isArray(plans) ? plans : [];
 
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Study Code</th>
      <th>English Name</th>
      <th>Thai Name</th>
    </tr>
  `;
  table.appendChild(thead);
 
  const tbody = document.createElement("tbody");
  safePlans.forEach((plan) => {
    const tr = document.createElement("tr");
    tr.setAttribute("class","ecors-row")
    tr.innerHTML = `
    <td class="ecors-id">${plan.id}</td>
    <td class="ecors-planCode">${plan.planCode}</td>
    <td class="ecors-nameEng">${plan.nameEng}</td>
    <td class="ecors-nameTh">${plan.nameTh}</td>
    `;
    tbody.appendChild(tr);
    });
 
  table.appendChild(tbody);
}

