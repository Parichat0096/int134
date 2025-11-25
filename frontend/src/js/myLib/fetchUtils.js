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
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        })
        const data = await res.json()
        if(!res.ok){
            if(res.status === 409){
                throw new Error('You may have declared study plan already. Please check again.');
            } else{
                throw new Error('There is a problem. Please try again later.')
            }
        }
        return data
    }catch(error){
        if (error instanceof TypeError) {  // NETWORK ERROR เท่านั้น! เช่น Failed to fetch
            throw new Error('There is a problem. Please try again later.');
        }
        throw new Error(error.message)
    }
}

//PUTT DECLARE PLAN
async function changeDeclare(url, item){
    try{
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        })
        const data = await res.json()
        if(!res.ok){
            if(res.status === 404){
                throw new Error(data.message);
            }
            if(res.status === 409){
                throw new Error(data.message);
            }
            else{
                throw new Error('There is a problem. Please try again later.')
            }
        }
        return data
    }catch(error){
        if (error instanceof TypeError) {  // NETWORK ERROR เท่านั้น! เช่น Failed to fetch
            throw new Error('There is a problem. Please try again later.');
        }
        throw new Error(error.message)
    }
}

//DELETE DECLARED PLAN //pbi 6
async function delDeclared(url){
    try{
        const res = await fetch(url, {method: 'DELETE'})
        const data = await res.json()
        if (res.status === 204 || res.status === 200){
            throw new Error ('Declaration cancelled.')
        }else if(!res.ok){
            if(res.status === 404){
                throw new Error (data.message)
            }
            if(res.status === 409){
                throw new Error (data.message)
            }
            else{
                throw new Error ('There is a problem. Please try again later.')
            }
        }
        return data
    }catch (error) {
        if (error instanceof TypeError) {  // NETWORK ERROR เท่านั้น! เช่น Failed to fetch
            throw new Error('There is a problem. Please try again later.');
        }
        throw new Error (error.message)
    }
}
export {getItems, addDeclare, changeDeclare, delDeclared }