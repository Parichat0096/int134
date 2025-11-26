// CRUD
import { getItems, addDeclare, changeDeclare, delDeclared, postData, deleteData } from "./myLib/fetchUtils.js";

// --- EXISTING DECLARATION ---
async function loadPlans(){
    try{
        const plans = await getItems(`${import.meta.env.VITE_API_URL}/study-plans`)
        return plans ?? []
    }catch(error){
        return []
    }
}

async function getIdDeclared(id){
    try{
        const declared = await getItems(`${import.meta.env.VITE_API_URL}/students/${id}/declared-plan`)
        return declared
    }catch(error){
        return null 
    }
}

async function postDeclare(studentId, item){
    return await addDeclare(`${import.meta.env.VITE_API_URL}/students/${studentId}/declared-plan`, item)
}

async function putDeclare(studentId, item){
    return await changeDeclare(`${import.meta.env.VITE_API_URL}/students/${studentId}/declared-plan`, item)
}

async function deleteDeclared(studentId){
    return await delDeclared(`${import.meta.env.VITE_API_URL}/students/${studentId}/declared-plan`)
}

// --- NEW SPRINT 4 RESERVATION SERVICES ---

// PBI 11: Get Periods
async function getReservationPeriods() {
    try {
        return await getItems(`${import.meta.env.VITE_API_URL}/reservation-periods`);
    } catch (error) {
        console.error(error);
        return { currentPeriod: null, nextPeriod: null };
    }
}

// PBI 9: Get Courses
async function getCourseOfferings() {
    try {
        return await getItems(`${import.meta.env.VITE_API_URL}/course-offerings-plans`);
    } catch (error) {
        console.error(error);
        return { courseOfferings: [] };
    }
}

// PBI 9: Get My Reservations
async function getStudentReservations(studentId) {
    try {
        return await getItems(`${import.meta.env.VITE_API_URL}/students/${studentId}/reservations`);
    } catch (error) {
        console.error(error);
        return { reservedCourses: [], reservedCredits: 0 };
    }
}

// PBI 9: Reserve Course
async function createReservation(studentId, courseOfferingId) {
    return await postData(`${import.meta.env.VITE_API_URL}/students/${studentId}/reservations`, { courseOfferingId });
}

// PBI 10: Remove Reservation
async function removeReservation(studentId, courseOfferingId) {
    return await deleteData(`${import.meta.env.VITE_API_URL}/students/${studentId}/reservations/${courseOfferingId}`);
}

export { 
    loadPlans, getIdDeclared, postDeclare, putDeclare, deleteDeclared,
    getReservationPeriods, getCourseOfferings, getStudentReservations, createReservation, removeReservation
}