// CRUD any items
// GET
async function getItems(url) {
    try{
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json()
        return data ?? []
    }catch(error){
        throw new Error(error)
    }
}

//POST DECLARE PLAN
async function addDeclare(url, item){
    try{
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
        })
        const data = await res.json()
        if(!res.ok){
            // PBI 11: Handle 403 (Reservation Closed)
            if(res.status === 403){
                 throw { status: 403, message: data.message || "Cannot perform this action because the reservation period is currently closed." };
            }
            if(res.status === 409){
                throw new Error('You may have declared study plan already. Please check again.');
            } else{
                throw new Error('There is a problem. Please try again later.')
            }
        }
        return data
    }catch(error){
        if (error.status === 403) throw error; 
        if (error instanceof TypeError) throw new Error('There is a problem. Please try again later.');
        throw new Error(error.message)
    }
}

//PUT DECLARE PLAN
async function changeDeclare(url, item){
    try{
        const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
        })
        const data = await res.json()
        if(!res.ok){
            // PBI 11: Handle 403
            if(res.status === 403){
                 throw { status: 403, message: data.message || "Cannot perform this action because the reservation period is currently closed." };
            }
            if(res.status === 404 || res.status === 409){
                throw new Error(data.message);
            }
            else{
                throw new Error('There is a problem. Please try again later.')
            }
        }
        return data
    }catch(error){
        if (error.status === 403) throw error;
        if (error instanceof TypeError) throw new Error('There is a problem. Please try again later.');
        throw new Error(error.message)
    }
}

//DELETE DECLARED PLAN
async function delDeclared(url){
    try{
        const res = await fetch(url, {method: 'DELETE'})
        
        // PBI 7: Backend may return 200 with JSON, PBI 6 returned 204
        const contentType = res.headers.get("content-type");
        let data = null;
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await res.json();
        }

        if(!res.ok){
            // PBI 11: Handle 403
            if(res.status === 403){
                 const msg = data?.message || "Cannot perform this action because the reservation period is currently closed.";
                 throw { status: 403, message: msg };
            }
            if(res.status === 404 || res.status === 409){
                throw new Error (data.message)
            }
            else{
                throw new Error ('There is a problem. Please try again later.')
            }
        }

        // Success handling for Cancel Plan
        if (res.status === 204){
             throw new Error ('Declaration cancelled.')
        }
        if (res.status === 200 && data){
            throw new Error ('Declaration cancelled.')
        }

        return data
    }catch (error) {
        if (error.status === 403) throw error;
        if (error instanceof TypeError) throw new Error('There is a problem. Please try again later.');
        throw new Error (error.message)
    }
}

// --- NEW FOR SPRINT 4 ---

// GENERIC POST for Reservation (PBI 9)
async function postData(url, item) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
        });
        const data = await res.json();
        if (!res.ok) {
            // PBI 9 & 11 Errors
            if (res.status === 403) {
                 throw { status: 403, message: data.message };
            }
            if (res.status === 409) {
                throw new Error(data.message);
            }
            throw new Error('There is a problem. Please try again later.');
        }
        return data;
    } catch (error) {
        if (error.status === 403) throw error;
        if (error instanceof TypeError) throw new Error('There is a problem. Please try again later.');
        throw error;
    }
}

// GENERIC DELETE for Reservation (PBI 10)
async function deleteData(url) {
    try {
        const res = await fetch(url, { method: 'DELETE' });
        if (!res.ok) {
             const data = await res.json();
             // PBI 10 & 11 Errors
             if (res.status === 403) {
                  throw { status: 403, message: data.message };
             }
             if (res.status === 409 || res.status === 404) {
                 throw new Error(data.message);
             }
             throw new Error('There is a problem. Please try again later.');
        }
        return true; // 204 No Content
    } catch (error) {
        if (error.status === 403) throw error;
        if (error instanceof TypeError) throw new Error('There is a problem. Please try again later.');
        throw error;
    }
}

export {getItems, addDeclare, changeDeclare, delDeclared, postData, deleteData }