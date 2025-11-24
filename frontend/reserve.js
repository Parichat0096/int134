// reserve.js
import { initAuth } from "./auth/keycloak.js";
import {
  fullNameEl,
  signOutBtn,
} from "./ui/elements.js";

import { registerEvents } from "./handlers/event.js";

const appState = {
  currentStatus: null,
  currentPlanId: null,
  currentPlanCode: null,
  currentPlanNameEng: null,
  currentUpdatedAt: null,
};

function updateState(data) {
  appState.currentStatus = data.status;
  appState.currentPlanId = data.planId;
  appState.currentPlanCode = data.planCode;
  appState.currentPlanNameEng = data.planNameEng;
  appState.currentUpdatedAt = data.updatedAt;
}

initAuth(({ studentId, token, logout }) => {
  fullNameEl.textContent = `Welcome, ${studentId}`;
  signOutBtn.onclick = logout;

  registerEvents({
    studentId,
    token,
    state: appState,
    updateState,
  });
});
