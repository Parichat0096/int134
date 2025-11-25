// CRUD
import { getItems, addDeclare, changeDeclare, delDeclared } from "./myLib/fetchUtils.js";

// GET
async function loadPlans(){
    try{
        const plans = await getItems(`${import.meta.env.VITE_API_URL}/study-plans`) //"/intproj25/pl1/itb-ecors/api/v1/study-plans"
        return plans ?? []
    }catch(error){
        return []
    }
}

async function getIdDeclared(id){
    try{
        const declared = await getItems(`${import.meta.env.VITE_API_URL}/students/${id}/declared-plan`) // /students/{studentId}/declared-plan
        return declared
    }catch(error){
        console.log(error)
    }
}

async function postDeclare(studentId, item){
    const ecorsDialog = document.querySelector('.ecors-dialog')
    const messageDialog = document.querySelector('.ecors-dialog-message')
    messageDialog.textContent = ''
    try{
        const newDeclare = await addDeclare(`${import.meta.env.VITE_API_URL}/students/${studentId}/declared-plan`, item) // /students/{studentId}/declared-plan
        return newDeclare
    }catch(error){
        ecorsDialog.showModal()
        messageDialog.textContent = error.message
    }
}

async function putDeclare(studentId, item){
    const ecorsDialog = document.querySelector('.ecors-dialog')
    const messageDialog = document.querySelector('.ecors-dialog-message')
    messageDialog.textContent = ''
    try{
        const newDeclare = await changeDeclare(`${import.meta.env.VITE_API_URL}/students/${studentId}/declared-plan`, item) // /students/{studentId}/declared-plan
        return newDeclare
    }catch(error){
        ecorsDialog.showModal()
        messageDialog.textContent = error.message
    }
}

async function deleteDeclared(studentId){
    const ecorsDialog = document.querySelector('.ecors-dialog')
    const messageDialog = document.querySelector('.ecors-dialog-message')
    messageDialog.textContent = ''
    try{
        const declared = await delDeclared(`${import.meta.env.VITE_API_URL}/students/${studentId}/declared-plan`) // /students/{studentId}/declared-plan
        return declared
    }catch(error){
        ecorsDialog.showModal()
        messageDialog.textContent = error.message
    }
}

export { loadPlans, getIdDeclared, postDeclare, putDeclare, deleteDeclared }