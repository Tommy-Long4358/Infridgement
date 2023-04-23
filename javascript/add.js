// Firebase Key
import { firebaseConfig } from "./firebaseKey.js";
// Firebase Functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, child } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

import "./dims.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

const userID = localStorage.getItem("userID");

document.getElementById("add-button").addEventListener("submit", addItem);

function checkAdd(h, w, l, friFree, ratio)
{
    const accountRef = ref(db, `Users/${accountID}/${friFree}Ratio`);
    
    onValue(accountRef, (snapshot) => {
        const data = snapshot.val();
        var r = data[ratio];
        r = r * .01;

        var dims;
        if (ratio == "Fridge"){
            if (compartment == "Shelf 1"){
                dims = friSh1;
            }
            else if (compartment == "Shelf 2"){
                dims = friSh2;
            }
            else if (compartment == "Shelf 3"){
                dims = friSh3;
            }
            else if (compartment == "Produce"){
                dims = produce;
            }
            else if (compartment == "Door 1"){
                dims = friD1;
            }
            else if (compartment == "Door 2"){
                dims = friD2;
            }
            else if (compartment == "Door 3"){
                dims = friD3;
            }
        }
        else{
            if (compartment == "Shelf 1"){
                dims = freeSh1;
            }
            else if (compartment == "Shelf 2"){
                dims = freeSh2;
            }
            else if (compartment == "Shelf 3"){
                dims = freeSh3;
            }
            else if (compartment == "Door 1"){
                dims = freeD1;
            }
            else{
                dims = freeD2;
            }
        }

        if ((h < dims[2]) && (w < dims[1]) && (l < dims[0])){
            var compartVol = dims[0] * dims[1] * dims[2] * r;
            var itemVol = h * w * l;
            if (itemVol < compartVol){
                return true;

            }
        }
        console.log("item not added")
        return false;
        
    })
}

function addItem(e)
{
    e.preventDefault();
    
    const length = document.getElementById("item-l").value;
    const height = document.getElementById("item-h").value;
    const width = document.getElementById("item-w").value;
    const friFree = document.getElementById("FridgeOrFreezer").value;
    const compartment =  document.getElementById("friFree-compartment").value;
    if (checkAdd(height, width, length, friFree, compartment)){
        const name = document.getElementById("item-name").value;
        const type = document.getElementById("item-type").value;
        const expDate = document.getElementById("item-expDate").value;
        const comments = document.getElementById("item-comments").value;
        if(comments == null){
            comments = "";
        }

        const accountRef = ref(db, `Users/${accountID}/${friFree}Storage/${compartment}`);
        
        push(accountRef, {
            "name": name,
            "type": type,
            "expDate": expDate,
            "dim": { "length": length, "width": width, "height": height},
            "comments": comments
        })
    }
    else{
        alert("Error: Cannot add item - item cannot fit in compartment")
    }
}