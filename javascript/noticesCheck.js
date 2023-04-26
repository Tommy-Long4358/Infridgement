// // Firebase Key
import { firebaseConfig } from "./firebaseKey.js";
// // Firebase Functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, child } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { friTotal, freeTotal } from "./dims.js"

// // // Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
onAuthStateChanged(auth, (user)=>{
    if (user) {
        // User logged in
        console.log(user.uid);
    }
    else {
        // User is signed out
        window.location.href = "index.html";
    }


})
// // console.log("testing");
const accountRef = ref(db, `Users/` + userID);
var ul = document.getElementById("notificationList");
var li = document.createElement("li");
li.textContent = "The freezer is currently more than 75% full!";
ul.appendChild(li);

//Testing with json data.
// var fs = require('fs');
// // const userID = "AT6UOrda10eaCDeNadPFmiCfdPf2";
// fs.readFile('/home/glibdig/Desktop/NodeEnvironment/infridgement-de310-default-rtdb-export.json', function (error, content) {
//     var data = JSON.parse(content);
//     // console.log(data.Users[userID]);
//     // console.log(Object.keys(data.Users).length)
//     var size = Object.keys(data.Users).length;
//     for (let i = 0; i < size; i++) {
//         console.log();
//     }
// });



// Function to add up all the used space in the users sections and check for low space 
// full = space in fridge filled up
function totalUsedSpace() {
    var fridgeSpace = [0, 0, 0];
    var freezerSpace = [0, 0, 0];

    // loop through each user and section of fridge and sum the dimensions to variables
    


    // Call freeSpace function to return a % of space that is available
    // total is the total dimensions [224, 128, 79]
    var fridgeFull = freeSpace(fridgeSpace, friTotal)
    var freezerFull = freeSpace(freezerSpace, freeTotal);

    // Get notification list element
    var ul = document.getElementById("notificationList");

    if (fridgeFull >= 75 && fridgeFull < 90) {
        var li = document.createElement("li");
        li.textContent = "The fridge is currently more than 75% full!";
        ul.appendChild(li);
    }
    else if (fridgeFull >= 90 && fridgeFull < 100) {
        var li = document.createElement("li");
        li.textContent = "The fridge is currently more than 90% full!";
        ul.appendChild(li);
    }
    else if (fridgeFull == 100) {
        var li = document.createElement("li");
        li.textContent = "The fridge is currently full!";
        ul.appendChild(li);
    }

    if (freezerFull >= 75 && freezerFull < 90) {
        var li = document.createElement("li");
        li.textContent = "The freezer is currently more than 75% full!";
        ul.appendChild(li);
    }
    else if (freezerFull >= 90 && freezerFull < 100) {
        var li = document.createElement("li");
        li.textContent = "The freezer is currently more than 90% full!";
        ul.appendChild(li);
    }
    else if (freezerFull == 100) {
        var li = document.createElement("li");
        li.textContent = "The freezer is currently full!";
        ul.appendChild(li);
    }
}

// Input: Arrays of the dimiensions/space being used in the fridge/freezer and the total amount availble in the fridge/freezer
function freeSpace(full, total) {
    var result = (((Math.abs(full[0] - total[0]) / total[0]) + (Math.abs(full[1] - total[1]) / total[1]) + (Math.abs(full[2] - total[2]) / total[2])) / 3) * 100;
    return result;
}

// inputDate: String of date from the database.
function expiration(inputDate) {
    var todaysDate = new Date();
    var input = new Date(inputDate)
}
// Function to go through the items and their expirations dates and notify if it is within 3 days of expiring,
// expires today, or has already expired.

var date = new Date("5/1/23");
var todayDate = new Date();
console.log(todayDate.toUTCString());


// console.log(date.toUTCString())



