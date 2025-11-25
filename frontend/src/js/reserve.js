import { loadPlans, getIdDeclared, postDeclare, putDeclare, deleteDeclared } from "./reserveManagement.js";
import { initKeycloak, signOut } from "./myLib/keycloak.js";

let studentName = ""
let studentId = ""
let plans = []
let planId = ""

document.addEventListener("DOMContentLoaded", async () => {
    plans = await loadPlans()
    await login()
    const dropdownPlan = document.getElementById('plan-select')
    plans.forEach(p => dropdownPlan.appendChild(optionEl(p)))
})


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
        if (e.target.value){
            declareBtn.disabled = false
        }else{
            declareBtn.disabled =true
        }
    }
    if(changeBtn){
        if (e.target.value){
            if(e.target.value == planId){
                changeBtn.disabled = true
            }else{
                changeBtn.disabled = false
            }
        }else{
            changeBtn.disabled =true
        }
    }
}

const declareOtp = document.querySelector('.ecors-dropdown-plan')
declareOtp.addEventListener('change', handleFormBtn)

function declaredStatus(declared){
    const declaredPlan = document.querySelector('.ecors-declared-plan')
    const btnDeclare = document.querySelector('.ecors-button-declare')
    const btnForm = document.querySelector('.btnForm')
    const defaultSection = document.querySelector('.ecors-dropdown-plan')
    const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!declared) {
        declaredPlan.textContent = "Not Declared"
        if (btnForm) btnForm.style.display = 'none'
        btnDeclare.style.display = 'block'
        btnDeclare.disabled = true
        return
    }
    if (declared.status === "CANCELLED") {
        defaultSection.value = ''
    }
    if(declared.status === "CANCELLED"){
        const status = declared.status === "CANCELLED" ? "Cancelled" : ""
        declaredPlan.textContent = `${status} ${declared.planCode} - ${declared.nameEng} on ${declared.updatedAt} (${localTZ})`
        btnDeclare.style.display = 'block'
        btnDeclare.disabled = true
        if(btnForm){
            btnForm.remove()
        }
        return
    }
    if (declared.status === "DECLARED" || declared && declared.studentId){
        const status = declared.status === "DECLARED" ? "Declared" : ""
        declaredPlan.textContent = `${status} ${declared.planCode} - ${declared.nameEng} on ${declared.updatedAt} (${localTZ})`
        btnDeclare.style.display = 'none'
        if(!btnForm){
            btnElManagement(declared)
            if (declared.status !== "CANCELLED") {
                defaultSection.value = planId
            }else{
                btnForm.style.display = 'flex'
                planId = ''
                defaultSection.value = '';
            }
        }
    }
    // else{
    //     declaredPlan.textContent = "Not Declared"
    //     if(btnForm){
    //         btnForm.style.display = 'none'
    //     }
    //     btnDeclare.style.display = 'block'
    // }
}

async function setDeclared(id){ //จัดการ declare เช่น local time zone
    const getDeclared = await getIdDeclared(id)
    if (getDeclared && getDeclared.status !== "CANCELLED") {
        planId = Number(getDeclared.planId) || ''
    }else{
        planId = ''
    }

    if (!getDeclared) {
        planId = ''
        console.warn(`No declared plan found for student ${id}`);
        declaredStatus(null)
        return
    }

    const localTime = new Date(getDeclared.updatedAt).toLocaleString("en-GB", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })

    const planFilter = plans.filter( p => p.id === Number(getDeclared.planId))
    console.log("planFilter : " , planFilter);

    getDeclared.planCode = planFilter[0].planCode
    getDeclared.nameEng = planFilter[0].nameEng
    getDeclared.updatedAt = localTime

    declaredStatus(getDeclared)
}

// const stdId = 6601000001010 //mock student id
// setDeclared(stdId)

const declareForm = document.querySelector('.declare-form')
declareForm.addEventListener('submit', handleForm)

const okDialog = document.querySelector('.ecors-button-dialog')
const ecorsDialog = document.querySelector('.ecors-dialog')
okDialog.addEventListener('click', () => ecorsDialog.close())

//for sprint 3
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

    //pbi 5
function handleChange(e){
    e.preventDefault()
    const test = new FormData(declareForm)
    const selectValue = test.get("plan-id")
    changeDeclared({planId: Number(selectValue)})

    const dialog = document.querySelector('.ecors-dialog')
    const message = document.querySelector('.ecors-dialog-message')
    message.textContent = 'Declaration updated.'
    dialog.showModal()

}

async function changeDeclared(planId){
    const data = await putDeclare(studentId, planId)
    const changeBtn = document.querySelector('.ecors-button-change')
    changeBtn.disabled = true
    if(data){
        await setDeclared(studentId)
    }
    await setDeclared(studentId)
}

    // pbi 6
function handleCancel(declared) {
    const dialog = document.querySelector('.ecors-dialog')
    const btnOk = document.querySelector('.ecors-button-dialog')
    const message = document.querySelector('.ecors-dialog-message')
    dialog.querySelectorAll('.ecors-button-cancel, .ecors-button-keep').forEach(btn => btn.remove())
    message.textContent = ''

    const btnCancel = document.createElement('button')
    btnCancel.className = 'ecors-button-cancel'
    btnCancel.textContent = 'Cancel Declaration'
    btnCancel.addEventListener('click', () => {
        dialog.close()
        if (btnCancel) btnCancel.remove()
        if (btnKeep) btnKeep.remove()
        message.textContent = ''
        btnOk.style.display = 'block'
        cancelDeclared()
        const btnDeclare = document.querySelector('.ecors-button-declare')
        btnDeclare.disabled = false
    })

    const btnKeep = document.createElement('button')
    btnKeep.className = 'ecors-button-keep'
    btnKeep.textContent = 'Keep Declaration'
    btnKeep.addEventListener('click', () => {
        dialog.close()
        if (btnCancel) btnCancel.remove()
        if (btnKeep) btnKeep.remove()
        message.textContent = ''
        btnOk.style.display = 'block'
    })

    const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone
    message.textContent = `You have declared ${declared.planCode} - ${declared.nameEng} as your plan on ${declared.updatedAt} (${localTZ}). Are you sure you want to cancel this declaration?`
    btnOk.style.display = 'none'

    dialog.appendChild(btnCancel)
    dialog.appendChild(btnKeep)
    dialog.showModal()
}

async function cancelDeclared(){
    const data = await deleteDeclared(studentId)
    const dropdown = document.querySelector('.ecors-dropdown-plan')
    const btnDeclare = document.querySelector('.ecors-button-declare')
    const btnChange = document.querySelector(".ecors-button-change")
    const btnCancel = document.querySelector(".ecors-button-cancel")

    planId = ''

    if (data){
        await setDeclared(studentId)
    }
    await setDeclared(studentId)
    dropdown.value = '';
    btnDeclare.disabled = true;
    btnChange.style.display = "none"
    btnCancel.style.display = "none"
}

//

async function handleForm(e){
    e.preventDefault()
    const test = new FormData(declareForm)
    const selectValue = test.get("plan-id")
    const data = await postDeclare(studentId, {planId: Number(selectValue)})
    if(data){
        await setDeclared(studentId)
    }
    await setDeclared(studentId)

}


async function login(){
    const user = await initKeycloak()
    if(user){
        const divName = document.querySelector(".ecors-fullname")
        studentName = user.name
        studentId = user.preferred_username
        divName.textContent += `${studentName}`
        setDeclared(studentId)
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
    const btnSignOut = document.createElement("button")
    btnSignOut.className = "ecors-button-signout"
    btnSignOut.textContent = "Sign Out"
    btnSignOut.addEventListener("click" , logout)
    profile.append(btnSignOut)
}