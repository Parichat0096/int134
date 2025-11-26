import { 
    loadPlans, getIdDeclared, postDeclare, putDeclare, deleteDeclared,
    getReservationPeriods, getCourseOfferings, getStudentReservations, createReservation, removeReservation
} from "./reserveManagement.js";
import { initKeycloak, signOut } from "./myLib/keycloak.js";

let studentName = ""
let studentId = ""
let plans = []
let planId = "" 
let isPeriodActive = false;
let cumulativeCreditLimit = 0;
let currentPeriodData = null;

document.addEventListener("DOMContentLoaded", async () => {
    plans = await loadPlans()
    await login()
    
    const dropdownPlan = document.getElementById('plan-select')
    plans.forEach(p => dropdownPlan.appendChild(optionEl(p)))
    
    await initReservationSystem();
    await setDeclared(studentId);

    const okDialog = document.querySelector('.ecors-button-dialog')
    const ecorsDialog = document.querySelector('.ecors-dialog')
    okDialog.addEventListener('click', () => {
        ecorsDialog.close();
        if (ecorsDialog.dataset.reload === "true") {
            window.location.reload();
        }
    })
})

// --- PBI 11: RESTRICT PERIOD (Data-cy Implementation) ---

async function initReservationSystem() {
    const periodData = await getReservationPeriods();
    const periodSection = document.querySelector('.reservation-period-section');
    const reservationSection = document.getElementById('reservation-section');
    
    periodSection.innerHTML = '';

    // 1. Current Period Display
    if (periodData.currentPeriod) {
        isPeriodActive = true;
        currentPeriodData = periodData.currentPeriod;
        cumulativeCreditLimit = periodData.currentPeriod.cumulativeCreditLimit;

        // [cite: 761] data-cy="current-message"
        const openMsg = document.createElement('div');
        openMsg.dataset.cy = "current-message"; 
        openMsg.style.color = "green";
        openMsg.style.fontWeight = "bold";
        openMsg.textContent = "Reservation is open";
        periodSection.appendChild(openMsg);

        // [cite: 763] data-cy="current-period"
        const periodTime = document.createElement('div');
        periodTime.dataset.cy = "current-period";
        periodTime.textContent = `Period: ${formatDate(currentPeriodData.startDateTime)} - ${formatDate(currentPeriodData.endDateTime)}`;
        periodSection.appendChild(periodTime);

        reservationSection.style.display = 'block';
        await loadReservationData();

    } else {
        isPeriodActive = false;
        // [cite: 776] data-cy="current-message"
        const closedMsg = document.createElement('div');
        closedMsg.dataset.cy = "current-message";
        closedMsg.style.color = "red";
        closedMsg.style.fontWeight = "bold";
        closedMsg.textContent = "Reservation is closed";
        periodSection.appendChild(closedMsg);

        reservationSection.style.display = 'none';
        updateDeclarationButtonsVisibility(false);
    }

    // 2. Next Period Display
    if (periodData.nextPeriod) {
        // [cite: 764] data-cy="next-message"
        const nextMsg = document.createElement('div');
        nextMsg.dataset.cy = "next-message";
        nextMsg.textContent = "Next reservation period:";
        nextMsg.style.marginTop = "10px";
        periodSection.appendChild(nextMsg);

        // [cite: 765] data-cy="next-period"
        const nextTime = document.createElement('div');
        nextTime.dataset.cy = "next-period";
        nextTime.textContent = `Period: ${formatDate(periodData.nextPeriod.startDateTime)} - ${formatDate(periodData.nextPeriod.endDateTime)}`;
        periodSection.appendChild(nextTime);
    } else {
        // [cite: 782] data-cy="next-message" (Used for "There are no upcoming..." as well)
        const noNextMsg = document.createElement('div');
        noNextMsg.dataset.cy = "next-message";
        noNextMsg.textContent = "There are no upcoming active reservation periods.";
        noNextMsg.style.marginTop = "10px";
        periodSection.appendChild(noNextMsg);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `${date.toLocaleString('en-GB', { timeZone: tz })} (${tz})`;
}

function updateDeclarationButtonsVisibility(visible) {
    const btns = document.querySelectorAll('.ecors-button-declare, .ecors-button-change, .ecors-button-cancel');
    btns.forEach(btn => {
        btn.style.display = visible ? '' : 'none';
    });
    if (visible) setDeclared(studentId); 
}

// --- PBI 9 & 10: RESERVATIONS (Data-cy Implementation) ---

async function loadReservationData() {
    if (!isPeriodActive) return;
    const [offeringsData, myResData] = await Promise.all([
        getCourseOfferings(),
        getStudentReservations(studentId)
    ]);
    renderReservations(myResData);
    renderCourseOfferings(offeringsData.courseOfferings, myResData);
}

function renderReservations(data) {
    const listContainer = document.getElementById('your-reservations-list');
    const totalSpan = document.getElementById('total-credits');
    const limitSpan = document.getElementById('credit-limit');

    limitSpan.textContent = cumulativeCreditLimit;
    totalSpan.textContent = data.reservedCredits;

    listContainer.innerHTML = '';
    if (data.reservedCourses.length === 0) {
        listContainer.innerHTML = '<p>No reserved courses yet.</p>';
        return;
    }

    data.reservedCourses.sort((a, b) => a.courseCode.localeCompare(b.courseCode));

    data.reservedCourses.forEach(course => {
        // [cite: 824] data-cy="course-reserved"
        const row = document.createElement('div');
        row.dataset.cy = "course-reserved"; 
        row.className = 'ecors-reserved-row';
        row.style.marginBottom = "5px";
        row.style.padding = "5px";
        row.style.border = "1px solid #ccc";
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";

        const info = document.createElement('span');
        info.textContent = `${course.courseCode} ${course.courseTitle} ${course.courseCredits} credits`;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'ecors-button-remove'; 
        removeBtn.style.marginLeft = "10px";
        removeBtn.style.backgroundColor = "orange";
        removeBtn.onclick = () => handleRemoveClick(course);

        row.appendChild(info);
        row.appendChild(removeBtn);
        listContainer.appendChild(row);
    });
}

function renderCourseOfferings(offerings, myReservations) {
    const listContainer = document.getElementById('course-offerings-list');
    listContainer.innerHTML = '';

    offerings.sort((a, b) => a.courseCode.localeCompare(b.courseCode));

    const reservedIds = myReservations.reservedCourses.map(c => c.courseOfferingId);
    const currentCredits = myReservations.reservedCredits;

    offerings.forEach(course => {
        // [cite: 798, 869] data-cy="course-offering"
        const div = document.createElement('div');
        div.dataset.cy = "course-offering";
        div.className = 'ecors-offering-row';
        div.style.border = "1px solid #ddd";
        div.style.padding = "10px";
        div.style.marginBottom = "10px";
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.alignItems = "center";
        
        const isCore = planId && course.planIds && course.planIds.includes(Number(planId));
        if (isCore) div.style.backgroundColor = "#e6f7ff";

        const infoDiv = document.createElement('div');
        
        // [cite: 806] data-cy="course-code"
        // [cite: 809] data-cy="course-title"
        // [cite: 811] data-cy="course-credits"
        let html = `
            <div data-cy="course-code" style="font-weight:bold;">${course.courseCode}</div>
            <div data-cy="course-title">${course.courseTitle}</div>
            <div data-cy="course-credits">${course.courseCredits} credits</div>
        `;
        
        // [cite: 813] data-cy="course-core"
        if (isCore) {
            html += `<div data-cy="course-core" style="color: blue; font-size: 0.9em;">Core course of your plan</div>`;
        }
        infoDiv.innerHTML = html;

        const btnDiv = document.createElement('div');
        const reserveBtn = document.createElement('button');
        reserveBtn.textContent = 'Reserve';
        // [cite: 799] data-cy="button-reserve"
        reserveBtn.dataset.cy = "button-reserve";
        reserveBtn.className = "ecors-button-reserve";

        const isReserved = reservedIds.includes(course.id);
        const willExceed = (currentCredits + course.courseCredits) > cumulativeCreditLimit;
        
        if (isReserved) {
            reserveBtn.disabled = true;
            reserveBtn.textContent = "Reserved";
        } else if (willExceed) {
            reserveBtn.disabled = true;
            reserveBtn.title = "Credit limit exceeded";
        }

        reserveBtn.onclick = () => handleReserveClick(course.id);

        btnDiv.appendChild(reserveBtn);
        div.appendChild(infoDiv);
        div.appendChild(btnDiv);
        listContainer.appendChild(div);
    });
}

// ... (Functions handleReserveClick, handleRemoveClick, optionEl, handleFormBtn, declaredStatus, setDeclared, btnElManagement, handleChange, handleCancel, cancelDeclared, handleForm, login, logout, createSignOut เหมือนเดิม แต่ระวังไม่ให้ไปแก้ class เดิม) ...

async function handleReserveClick(offeringId) {
    const dialog = document.querySelector('.ecors-dialog');
    const message = document.querySelector('.ecors-dialog-message');
    const btnOk = document.querySelector('.ecors-button-dialog');
    dialog.dataset.reload = "false"; 

    try {
        await createReservation(studentId, offeringId);
        await loadReservationData();
    } catch (error) {
        message.textContent = error.message;
        if (error.status === 403) dialog.dataset.reload = "true";
        btnOk.style.display = 'block';
        dialog.showModal();
    }
}

function handleRemoveClick(course) {
    const dialog = document.querySelector('.ecors-dialog');
    const message = document.querySelector('.ecors-dialog-message');
    const btnOk = document.querySelector('.ecors-button-dialog');
    const btnDiv = document.querySelector('.dialog-buttons');

    const oldCancel = dialog.querySelector('.ecors-button-cancel-res');
    const oldRemove = dialog.querySelector('.ecors-button-remove-confirm');
    if(oldCancel) oldCancel.remove();
    if(oldRemove) oldRemove.remove();

    dialog.dataset.reload = "false";
    message.textContent = `Are you sure you want to remove ${course.courseCode} ${course.courseTitle}?`;
    btnOk.style.display = 'none';

    const btnRemove = document.createElement('button');
    btnRemove.className = 'ecors-button-remove-confirm';
    btnRemove.textContent = 'Remove';
    btnRemove.style.backgroundColor = "red";
    btnRemove.style.color = "white";
    
    const btnCancel = document.createElement('button');
    btnCancel.className = 'ecors-button-cancel-res';
    btnCancel.textContent = 'Cancel';

    btnCancel.onclick = () => {
        dialog.close();
        btnRemove.remove();
        btnCancel.remove();
        btnOk.style.display = 'block';
    };

    btnRemove.onclick = async () => {
        dialog.close();
        btnRemove.remove();
        btnCancel.remove();
        btnOk.style.display = 'block';

        try {
            await removeReservation(studentId, course.courseOfferingId);
            await loadReservationData(); 
        } catch (error) {
            message.textContent = error.message;
            if (error.status === 403) dialog.dataset.reload = "true";
            dialog.showModal();
        }
    };

    btnDiv.appendChild(btnRemove);
    btnDiv.appendChild(btnCancel);
    dialog.showModal();
}

// ... (Rest of existing functions for Declaration Logic - Keep classes as is) ...
// (optionEl, handleFormBtn, declaredStatus, setDeclared, btnElManagement, handleChange, changeDeclared, handleCancel, cancelDeclared, handleForm, login, logout, createSignOut)
// Copy ฟังก์ชันเดิมมาใส่ต่อท้ายได้เลยครับ เพราะ Logic ส่วน Declare ไม่ได้เปลี่ยน data-cy (ใช้ class เดิม)

function optionEl(plan) {
    const option = document.createElement('option')
    option.className = "ecors-plan-row"
    option.textContent = `${plan.planCode} - ${plan.nameEng}`
    option.value = plan.id
    return option
}

function handleFormBtn(e){
    const declareBtn = document.querySelector('.ecors-button-declare')
    const changeBtn = document.querySelector('.ecors-button-change')
    if(declareBtn){
        declareBtn.disabled = !e.target.value
    }
    if(changeBtn){
        changeBtn.disabled = !e.target.value || e.target.value == planId
    }
}

const declareOtp = document.querySelector('.ecors-dropdown-plan')
declareOtp.addEventListener('change', handleFormBtn)

function declaredStatus(declared){
    const declaredPlan = document.querySelector('.ecors-declared-plan')
    const btnDeclare = document.querySelector('.ecors-button-declare')
    const defaultSection = document.querySelector('.ecors-dropdown-plan')
    const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    const oldBtnForm = document.querySelector('.btnForm')
    if (oldBtnForm) oldBtnForm.remove();

    if (!declared) {
        declaredPlan.textContent = "Not Declared"
        btnDeclare.style.display = isPeriodActive ? 'block' : 'none'; 
        btnDeclare.disabled = true
        defaultSection.disabled = false;
        defaultSection.value = '';
        return
    }

    if(declared.status === "CANCELLED"){
        const localTime = new Date(declared.updatedAt).toLocaleString("en-GB", { timeZone: localTZ })
        declaredPlan.textContent = `CANCELLED ${declared.planCode} - ${declared.nameEng} plan on ${localTime} (${localTZ})`;
        btnDeclare.style.display = isPeriodActive ? 'block' : 'none';
        btnDeclare.disabled = true
        defaultSection.disabled = false;
        defaultSection.value = '';
        return
    }

    if (declared.status === "DECLARED" || (declared && declared.studentId)){
        const localTime = new Date(declared.updatedAt).toLocaleString("en-GB", { timeZone: localTZ })
        declaredPlan.textContent = `DECLARED ${declared.planCode} - ${declared.nameEng} on ${localTime} (${localTZ})`
        btnDeclare.style.display = 'none'
        defaultSection.value = planId
        if (isPeriodActive) btnElManagement(declared)
    }
}

async function setDeclared(id){ 
    const getDeclared = await getIdDeclared(id)
    if (getDeclared && getDeclared.status !== "CANCELLED") {
        planId = Number(getDeclared.planId) || ''
    }else{
        planId = ''
    }
    if (isPeriodActive) loadReservationData();
    if (!getDeclared) {
        planId = ''
        declaredStatus(null)
        return
    }
    const planFilter = plans.filter( p => p.id === Number(getDeclared.planId))
    if(planFilter.length > 0) {
        getDeclared.planCode = planFilter[0].planCode
        getDeclared.nameEng = planFilter[0].nameEng
    }
    declaredStatus(getDeclared)
}

const declareForm = document.querySelector('.declare-form')
declareForm.addEventListener('submit', handleForm)

function btnElManagement(declared) {
    const form = document.querySelector('.declare-form')
    const btnForm = document.createElement('div')
    btnForm.className = 'btnForm'

    const btnChange = document.createElement('button')
    btnChange.className = 'ecors-button-change'
    btnChange.textContent = 'Change'
    btnChange.type = "button";
    btnChange.addEventListener('click', handleChange)
    btnChange.disabled = true

    const btnCancel = document.createElement('button')
    btnCancel.className = 'ecors-button-cancel'
    btnCancel.textContent = 'Cancel Declaration'
    btnCancel.type = "button";
    btnCancel.addEventListener('click', () => handleCancel(declared))

    btnForm.appendChild(btnChange)
    btnForm.appendChild(btnCancel)
    form.appendChild(btnForm)
}

function handleChange(e){
    e.preventDefault()
    const test = new FormData(declareForm)
    const selectValue = test.get("plan-id")
    changeDeclared({planId: Number(selectValue)})
}

async function changeDeclared(item){
    const dialog = document.querySelector('.ecors-dialog')
    const message = document.querySelector('.ecors-dialog-message')
    const btnOk = document.querySelector('.ecors-button-dialog')
    dialog.dataset.reload = "false";
    message.textContent = '';
    try {
        const data = await putDeclare(studentId, item)
        if(data){
            message.textContent = 'Declaration updated.'
            btnOk.style.display = 'block';
            dialog.showModal()
            await setDeclared(studentId)
        }
    } catch (error) {
        message.textContent = error.message;
        if(error.status === 403) dialog.dataset.reload = "true";
        btnOk.style.display = 'block';
        dialog.showModal();
    }
}

function handleCancel(declared) {
    const dialog = document.querySelector('.ecors-dialog')
    const btnOk = document.querySelector('.ecors-button-dialog')
    const message = document.querySelector('.ecors-dialog-message')
    const btnDiv = document.querySelector('.dialog-buttons')

    const oldCancel = dialog.querySelector('.ecors-button-cancel')
    const oldKeep = dialog.querySelector('.ecors-button-keep')
    if(oldCancel) oldCancel.remove()
    if(oldKeep) oldKeep.remove()

    dialog.dataset.reload = "false";
    message.textContent = ''

    const btnCancel = document.createElement('button')
    btnCancel.className = 'ecors-button-cancel'
    btnCancel.textContent = 'Cancel Declaration'
    btnCancel.addEventListener('click', () => {
        dialog.close()
        btnCancel.remove()
        btnKeep.remove()
        btnOk.style.display = 'block'
        cancelDeclared()
    })

    const btnKeep = document.createElement('button')
    btnKeep.className = 'ecors-button-keep'
    btnKeep.textContent = 'Keep Declaration'
    btnKeep.addEventListener('click', () => {
        dialog.close()
        btnCancel.remove()
        btnKeep.remove()
        btnOk.style.display = 'block'
    })

    const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone
    const localTime = new Date(declared.updatedAt).toLocaleString("en-GB", { timeZone: localTZ })
    
    message.textContent = `You have declared ${declared.planCode} - ${declared.nameEng} as your plan on ${localTime} (${localTZ}). Are you sure you want to cancel this declaration?`
    btnOk.style.display = 'none'

    btnDiv.appendChild(btnCancel)
    btnDiv.appendChild(btnKeep)
    dialog.showModal()
}

async function cancelDeclared(){
    const dialog = document.querySelector('.ecors-dialog')
    const message = document.querySelector('.ecors-dialog-message')
    const btnOk = document.querySelector('.ecors-button-dialog')
    try {
        await deleteDeclared(studentId)
        message.textContent = 'Declaration cancelled.'
        btnOk.style.display = 'block'
        dialog.showModal()
        await setDeclared(studentId)
        const dropdown = document.querySelector('.ecors-dropdown-plan')
        dropdown.value = '';
    } catch (error) {
        if (error.message === 'Declaration cancelled.') {
             message.textContent = 'Declaration cancelled.'
             btnOk.style.display = 'block'
             dialog.showModal()
             await setDeclared(studentId)
             const dropdown = document.querySelector('.ecors-dropdown-plan')
             dropdown.value = '';
        } else {
            message.textContent = error.message
            if(error.status === 403) dialog.dataset.reload = "true";
            btnOk.style.display = 'block'
            dialog.showModal()
             await setDeclared(studentId)
        }
    }
}

async function handleForm(e){
    e.preventDefault()
    const test = new FormData(declareForm)
    const selectValue = test.get("plan-id")
    const dialog = document.querySelector('.ecors-dialog')
    const message = document.querySelector('.ecors-dialog-message')
    dialog.dataset.reload = "false";
    try {
        const data = await postDeclare(studentId, {planId: Number(selectValue)})
        if(data){
            await setDeclared(studentId)
        }
    } catch (error) {
        message.textContent = error.message
        if(error.status === 403) dialog.dataset.reload = "true";
        dialog.showModal()
        await setDeclared(studentId)
    }
}

async function login(){
    const user = await initKeycloak()
    if(user){
        const divName = document.querySelector(".ecors-fullname")
        studentName = user.name
        studentId = user.preferred_username
        divName.textContent = `Welcome, ${studentName}`
        createSignOut()
    }
}

function logout() {
    signOut()
    studentName = ""
    studentId = ""
}

function createSignOut(){
    const profile = document.getElementById("profile")
    if(document.querySelector('.ecors-button-signout')) return;
    const btnSignOut = document.createElement("button")
    btnSignOut.className = "ecors-button-signout"
    btnSignOut.textContent = "Sign Out"
    btnSignOut.addEventListener("click" , logout)
    profile.append(btnSignOut)
}