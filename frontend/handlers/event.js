// handlers/events.js
import {
  declareBtn,
  changeBtn,
  cancelBtn,
  declareDropdown,
  changeDropdown,
} from "../ui/elements.js";

import {
  fetchStatus,
  declarePlan,
  changePlan,
  cancelPlan,
} from "../services/studentService.js";

import { getStudyPlans } from "../services/planService.js";

import { renderDeclared, renderNotDeclared } from "../ui/renderer.js";
import { showDialog } from "../ui/dialogs.js";
import { apiBaseUrl } from "../config/api.js";

export function registerEvents(context) {
  const { studentId, token, state, updateState } = context;

  async function loadPlans(target, selected = null) {
    const plans = await getStudyPlans(token);
    target.innerHTML = "<option value=''>-- Select Major --</option>";

    plans.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.planCode} - ${p.nameEng}`;
      if (selected === p.id) opt.selected = true;
      target.appendChild(opt);
    });
  }

  // Declare
  declareDropdown.addEventListener("change", () => {
    declareBtn.disabled = declareDropdown.value === "";
  });

  declareBtn.addEventListener("click", async () => {
    try {
      const data = await declarePlan(studentId, token, parseInt(declareDropdown.value));
      updateState(data);
      renderDeclared(data);
    } catch {
      showDialog("There is a problem. Try again.");
    }
  });

  // Change
  changeDropdown.addEventListener("change", () => {
    changeBtn.disabled =
      changeDropdown.value === "" ||
      parseInt(changeDropdown.value) === state.currentPlanId;
  });

  changeBtn.addEventListener("click", async () => {
    try {
      const data = await changePlan(studentId, token, parseInt(changeDropdown.value));
      updateState(data);
      renderDeclared(data);
    } catch (err) {
      showDialog("Cannot update plan.");
    }
  });

  // Cancel
  cancelBtn.addEventListener("click", async () => {
    try {
      const data = await cancelPlan(studentId, token);
      updateState(data);
      renderDeclared(data);
    } catch {
      showDialog("Cannot cancel declaration.");
    }
  });

  // Initial load
  (async () => {
    const status = await fetchStatus(studentId, token);
    if (!status) {
      renderNotDeclared();
      loadPlans(declareDropdown);
      return;
    }

    updateState(status);
    renderDeclared(status);

    loadPlans(changeDropdown, status.planId);
  })();
}
