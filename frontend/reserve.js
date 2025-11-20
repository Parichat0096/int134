// reserve.js
// ==================== CONFIG ====================
const isLocal_reserve =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

//const API_HOST_reserve = isLocal_reserve
// ? "http://localhost:3000"
 // : "https://bscit.sit.kmutt.ac.th";
 const API_HOST_reserve = isLocal_reserve
  ? `${window.location.protocol}//${window.location.hostname}`
  : `${window.location.origin}`;


const TEAM_CODE = "pl1";
const apiBaseUrl = `${API_HOST_reserve}/intproj25/${TEAM_CODE}/itb-ecors/api/v1`;

// ==================== ELEMENTS ====================
const declaredPlanEl = document.querySelector(".ecors-declared-plan");
const fullNameEl = document.querySelector(".ecors-fullname");
const signOutBtn = document.querySelector(".ecors-button-signout");

const declareSectionEl = document.querySelector(".declare-section");
const declareDropdown = document.querySelector(".ecors-dropdown-plan");
const declareBtn = document.querySelector(".ecors-button-declare");

// changed selector for the change dropdown to avoid ambiguity with declare dropdown
const changeSectionEl = document.querySelector(".change-section");
const changeDropdown = document.querySelector(".ecors-dropdown-plan-change");
const changeBtn = document.querySelector(".ecors-button-change");

const cancelSectionEl = document.querySelector(".cancel-section");
// trigger button (outside dialog) has its own distinct class now
const cancelBtn = document.querySelector(".ecors-button-cancel-trigger");

// dialogs
const dialogs = document.querySelectorAll(".ecors-dialog");
const dialogOk = dialogs[0];
const dialogConfirm = dialogs[1];

const dialogOkMsg = dialogOk.querySelector(".ecors-dialog-message");
const dialogOkBtn = dialogOk.querySelector(".ecors-button-dialog");

const dialogConfirmMsg = dialogConfirm.querySelector(".ecors-dialog-message");
// dialogConfirm has its own .ecors-button-cancel inside the dialog
const dialogConfirmCancelBtn = dialogConfirm.querySelector(".ecors-button-cancel");
const dialogConfirmKeepBtn = dialogConfirm.querySelector(".ecors-button-keep");

const planListForCypress = document.querySelector(".ecors-plan-list");

// ==================== VARIABLES ====================
let studentId = null;
let authToken = null;

let currentStatus = null;
let currentPlanId = null;
let currentPlanCode = null;
let currentPlanNameEng = null;
let currentUpdatedAt = null;

// ==================== KEYCLOAK ====================
// ตามคำขอของคุณ: ไม่แก้ค่า Keycloak URL / clientId
const keycloak = new Keycloak({
  url: `https://bscit.sit.kmutt.ac.th/intproj25/ft/keycloak/`,
  realm: "itb-ecors",
  clientId: "itb-ecors-pl1",
});

keycloak
  .init({ onLoad: "login-required", checkLoginIframe: false })
  .then((auth) => {
    if (!auth) return;

    studentId = keycloak.tokenParsed.preferred_username;
    authToken = keycloak.token;

    fullNameEl.textContent = `Welcome, ${keycloak.tokenParsed.name}`;

    signOutBtn.addEventListener("click", () => {
      const home = `${window.location.origin}/intproj25/${TEAM_CODE}/itb-ecors/`;
      keycloak.logout({ redirectUri: home });
    });

    fetchDeclarationStatus();
  });

// ==================== FETCH STATUS ====================
async function fetchDeclarationStatus() {
  declaredPlanEl.textContent = "Loading status...";

  try {
    const res = await fetch(`${apiBaseUrl}/students/${studentId}/declared-plan`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (res.status === 200) {
      const data = await res.json();
      renderDeclared(data);
    } else if (res.status === 404) {
      renderNotDeclared();
    } else {
      throw new Error();
    }
  } catch (err) {
    showDialog("Could not load declaration status. Please refresh.");
  }
}

// ==================== RENDER ====================
function renderDeclared(data) {
  currentStatus = data.status;
  currentPlanId = data.planId;
  currentPlanCode = data.planCode;
  currentPlanNameEng = data.planNameEng;
  currentUpdatedAt = data.updatedAt;

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

  // ================= CANCELLED =================
  if (data.status === "CANCELLED") {
    declaredPlanEl.textContent = `Declaration Status: Cancelled ${data.planCode} - ${data.planNameEng} plan on ${formatted} (${tz})`;

    showDeclareSection();
    hideChangeSection();
    hideCancelSection();

    declareDropdown.innerHTML = "<option value=''>-- Select Major --</option>";
    declareBtn.disabled = true;
    loadStudyPlans(declareDropdown);

    return;
  }

  // ================= DECLARED =================
  declaredPlanEl.textContent = `Declaration Status: Declared ${data.planCode} - ${data.planNameEng} on ${formatted} (${tz})`;

  hideDeclareSection();
  showChangeSection();
  showCancelSection();

  loadStudyPlans(changeDropdown, currentPlanId);
}

function renderNotDeclared() {
  currentStatus = null;
  currentPlanId = null;
  currentPlanCode = null;
  currentPlanNameEng = null;

  declaredPlanEl.textContent = "Declaration Status: Not Declared";

  showDeclareSection();
  hideChangeSection();
  hideCancelSection();

  declareDropdown.innerHTML = "<option value=''>-- Select Major --</option>";
  declareBtn.disabled = true;

  loadStudyPlans(declareDropdown);
}

// ==================== UI HELPERS ====================
function showDeclareSection() {
  declareSectionEl.style.display = "block";
}
function hideDeclareSection() {
  declareSectionEl.style.display = "none";
}

function showChangeSection() {
  changeSectionEl.style.display = "block";
}
function hideChangeSection() {
  changeSectionEl.style.display = "none";
}

function showCancelSection() {
  cancelSectionEl.style.display = "block";
}
function hideCancelSection() {
  cancelSectionEl.style.display = "none";
}

// ==================== LOAD STUDY PLANS ====================
async function loadStudyPlans(dropdown, selectedId = null) {
  dropdown.innerHTML = "<option value=''>-- Select Major --</option>";
  planListForCypress.innerHTML = "";

  try {
    const res = await fetch(`${apiBaseUrl}/study-plans`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const plans = await res.json();

    plans.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.planCode} - ${p.nameEng}`;
      if (selectedId && p.id === selectedId) opt.selected = true;
      dropdown.appendChild(opt);

      // สำหรับ Cypress
      const row = document.createElement("div");
      row.classList.add("ecors-plan-row");
      row.innerHTML = `
        <span class="ecors-plan-code">${p.planCode}</span>
        <span class="ecors-plan-name">${p.nameEng}</span>
      `;
      planListForCypress.appendChild(row);
    });
  } catch (err) {
    showDialog("Cannot load study plans.");
  }
}

// ==================== DECLARE (POST) ====================
declareDropdown.addEventListener("change", () => {
  declareBtn.disabled = declareDropdown.value === "";
});

declareBtn.addEventListener("click", async () => {
  const pid = parseInt(declareDropdown.value);

  try {
    const res = await fetch(`${apiBaseUrl}/students/${studentId}/declared-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ planId: pid }),
    });

    if (res.status === 201) {
      const data = await res.json();
      renderDeclared(data);
    } else if (res.status === 409) {
      showDialog("You may have declared study plan already. Please check again.");
      fetchDeclarationStatus();
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    showDialog("There is a problem. Try again.");
  }
});

// ==================== CHANGE (PUT) ====================
changeDropdown.addEventListener("change", () => {
  changeBtn.disabled =
    changeDropdown.value === "" ||
    parseInt(changeDropdown.value) === currentPlanId;
});

changeBtn.addEventListener("click", async () => {
  const newId = parseInt(changeDropdown.value);

  try {
    const res = await fetch(`${apiBaseUrl}/students/${studentId}/declared-plan`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ planId: newId }),
    });

    if (res.status === 200) {
      const data = await res.json();
      renderDeclared(data);
    } else if (res.status === 404) {
      showDialog("No declared plan found for student.");
      renderNotDeclared();
    } else if (res.status === 409) {
      showDialog("Cannot update the declared plan because it has been cancelled.");
    } else {
      // generic fallback for unexpected responses
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    showDialog("There is a problem. Try again.");
  }
});

// ==================== CANCEL (DELETE) ====================

// listen on trigger button (outside dialog)
cancelBtn.addEventListener("click", () => {
  // ใช้ updatedAt ที่ backend ส่งมา
  const date = new Date(currentUpdatedAt || Date.now());
  
  // Format ตาม requirement: DD/MM/YYYY HH:mm:ss
  const formatted = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  dialogConfirmMsg.textContent =
    `You have declared ${currentPlanCode} - ${currentPlanNameEng} as your plan on ${formatted} (${tz}). ` +
    `Are you sure you want to cancel this declaration?`;

  dialogConfirm.showModal();
});


dialogConfirmCancelBtn.addEventListener("click", confirmCancel);
dialogConfirmKeepBtn.addEventListener("click", () => dialogConfirm.close());

async function confirmCancel() {
  dialogConfirm.close();

  try {
    const res = await fetch(`${apiBaseUrl}/students/${studentId}/declared-plan`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (res.status === 200) {
      const data = await res.json();
      renderDeclared(data);
      showDialog("Declaration cancelled.");
    } else if (res.status === 204) {
      const cancelledData = {
        status: "CANCELLED",
        planId: currentPlanId,
        planCode: currentPlanCode,
        planNameEng: currentPlanNameEng,
        updatedAt: new Date().toISOString(),
      };
      renderDeclared(cancelledData);
      showDialog("Declaration cancelled.");
    } else if (res.status === 404) {
      showDialog("No declared plan found for student.");
    } else if (res.status === 409) {
      showDialog("Cannot cancel the declared plan because it is already cancelled.");
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    showDialog("There is a problem. Try again.");
  }
}

// ==================== DIALOG ====================
function showDialog(msg) {
  dialogOkMsg.textContent = msg;
  dialogOk.showModal();
}

dialogOkBtn.addEventListener("click", () => dialogOk.close());
