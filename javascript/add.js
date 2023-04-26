// Firebase Key
import { firebaseConfig } from "./firebaseKey.js";
// Firebase Functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, child, push } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

import {friSh1, friSh2, friSh3, produce, 
        friD1, friD2, friD3, 
        freeSh1, freeSh2, freeSh3, 
        freeD1, freeD2} from "./dims.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// const userID = localStorage.getItem("userID");

var userID;

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      userID = uid;
      displayAccount(uid);
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

document.getElementById("add-form").addEventListener("submit", addItem);

// function for the location selector
// fridge should have produce and a third door shelf as an option vs the freezer not having those
document.getElementById("FridgeOrFreezer").onchange = 
    function loadCompartments() {
        var refrigeratorSel = document.getElementById("FridgeOrFreezer").value;
        var compartSel = document.getElementById("friFree-compartment").value;

        // might not need this since the rest of the code will throw an error for it
        if (refrigeratorSel == "Freezer") {
            document.getElementById("produce").hidden = true;
            document.getElementById("door3").hidden = true;
        }
        else if (refrigeratorSel == "Fridge") {
            document.getElementById("produce").hidden = false;
            document.getElementById("door3").hidden = false;
        }

        // Error if user picks produce or door 3 when selecting freezer
        if ((compartSel == "Produce") && (refrigeratorSel == "Freezer")) {
            alert("Freezer does not have a compartment: Produce, please select another option.");
            document.getElementById("FridgeOrFreezer").value = null;
            document.getElementById("friFree-compartment").value = null;


        }
        else if ((compartSel == "Door 3") && (refrigeratorSel == "Freezer")) {
            alert("Freezer does not have a compartment: Door 3, please select another option");
            document.getElementById("FridgeOrFreezer").value = null;
            document.getElementById("friFree-compartment").value = null;
        }
    }

function checkAdd(l, w, h, friFree, compartment)
{
    // const accountRef = ref(database, `Users/${userID}/${friFree}Ratio`);
    //const accountRef = ref(database, `Users/${userID}`);
    // console.log(userID);
    // ensure that the values are inputted as numbers
    l = Number(l);
    w = Number(w);
    h = Number(h);

    const dbRef = ref(database);

    // user data ain comparison to ratio
    get(child(dbRef, `Users/${userID}`)).then((snapshot) => {
    // onValue(accountRef, (snapshot) => {
        const data = snapshot.val();
        // localStorage.doesFit = false; // value for checking fitness
        var storage = friFree + 'Storage'; // fridge/freezer storage
        var storage2 = friFree + 'Ratio'; // ratio
        var r = data[storage2][compartment]; // user's ratio
        r = r * .01;
        // console.log(r);

        var dims;
        if (friFree == "Fridge"){
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

        // sort items from greatest to least and compare edges
        const dimItem = [l, w, h]; // dimensions of the item
        const temp = dimItem.sort(function(a, b){return b - a}); // order from greatest to least
        const tempd = dims.sort(function(a, b){return b - a}); // temp for compartment dimensions

        console.log(temp);
        console.log(tempd);

        // if item fits into the compartment
        if ((temp[0] <= tempd[0]) && (temp[1] <= tempd[1]) && (temp[2] <= tempd[2])) { // check edges
            var compartVol = dims[0] * dims[1] * dims[2] * r; // volume of compartment w/ users ratio
            var itemVol = temp[0] * temp[1] * temp[2]; // volume of item
            var usedSecVol = 0; // user's section volume that's used

            // check if user's new item fits along with the other items in their ratio
            // const tempv = []; // object values
            for (var keys in data[storage][compartment]) {
                usedSecVol += Object.values(data[storage][compartment][keys]["dim"]).reduce((a, b) => a * b);
            }

            const tempvol = itemVol + usedSecVol; // total volume of section taken by users + new item volume
            
            // if the item fits along with the user's current items, add the item
            if (tempvol <= compartVol) {
                // localStorage.setItem('doesFit', true);
                console.log('item added successfully');
                const name = document.getElementById("item-name").value;
                const type = document.getElementById("item-type").value;
                const expDate = document.getElementById("item-expDate").value;
                const comments = document.getElementById("item-comments").value;
                if(comments == null){
                    comments = "";
                }

                const accountRef = ref(database, `Users/${userID}/${friFree}Storage/${compartment}`);
                
                push(accountRef, {
                    "name": name,
                    "type": type,
                    "expDate": expDate,
                    "dim": { "length": l, "width": w, "height": h},
                    "comments": comments
                })
            }
            else{ // item fits in compartment but does not fit within user's ratio
                console.log('item will not fit with this compartment. please choose a new section or remove item from home');
                // localStorage.setItem('doesFit', false);
            }
        }
        else { // if the edges are too big
            // localStorage.setItem('doesFit', false);
            console.log('edges too big');
        }
    })

    return null;
}

function addItem(e)
{
    e.preventDefault();
    
    const length = document.getElementById("item-l").value;
    const height = document.getElementById("item-h").value;
    const width = document.getElementById("item-w").value;
    const friFree = document.getElementById("FridgeOrFreezer").value;
    const compartment =  document.getElementById("friFree-compartment").value;

    const doesFit = checkAdd(length, width, height, friFree, compartment);
}

// display user info in the corner
function displayAccount(accountID)
{
  // Reference of a user's account information from the database
  const accountRef = ref(database, `Users/${accountID}/AccountInfo`);

  onValue(accountRef, (snapshot) => {
    // Retrieve user's account information as object
    const data = snapshot.val();    

    // Image element of profile picture
    var image = document.getElementById("profile-info-picture");

    // Assign picture's src to picture from user's account information
    image.src = data.profilePicture;
    var fullname = data.fullName;

    // Display user's full name next to profile picture
    document.getElementById("full-name").textContent = fullname;
  })
}