// CRUD
import { getItems } from "./myLib/fetchUtils.js";

// GET
async function loadPlans(){
    const dialog = document.querySelector(".ecors-dialog");
    try{
        const plans = await getItems(`${import.meta.env.VITE_API_URL}/study-plans`)
        return plans
    }catch(error){
        dialog.showModal();
        return []
    }
}


export { loadPlans }