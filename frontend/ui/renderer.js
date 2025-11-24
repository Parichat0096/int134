// ui/renderer.js
import {
  declaredPlanEl,
  declareDropdown,
  changeDropdown,
  planListForCypress,
} from "./elements.js";

import {
  showDeclareSection,
  hideDeclareSection,
  showChangeSection,
  hideChangeSection,
  showCancelSection,
  hideCancelSection,
} from "./sections.js";

export function renderDeclared(data) {
  const date = new Date(data.updatedAt);
  const formatted = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (data.status === "CANCELLED") {
    declaredPlanEl.textContent =
      `Declaration Status: Cancelled ${data.planCode} - ${data.planNameEng} ` +
      `on ${formatted} (${tz})`;

    showDeclareSection();
    hideChangeSection();
    hideCancelSection();

    declareDropdown.innerHTML = "<option value=''>-- Select Major --</option>";
    return;
  }

  declaredPlanEl.textContent =
    `Declaration Status: Declared ${data.planCode} - ${data.planNameEng} ` +
    `on ${formatted} (${tz})`;

  hideDeclareSection();
  showChangeSection();
  showCancelSection();
}

export function renderNotDeclared() {
  declaredPlanEl.textContent = "Declaration Status: Not Declared";

  showDeclareSection();
  hideChangeSection();
  hideCancelSection();

  declareDropdown.innerHTML = "<option value=''>-- Select Major --</option>";
}
