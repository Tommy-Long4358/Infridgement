// Firebase Key
import { firebaseConfig } from "./firebaseKey.js";
// Firebase Functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, child } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { friTotal, freeTotal } from "./dims.js"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
// console.log("testing");
const accountRef = ref(db, `Users/` + userID);


// console.log("testing");

//Testing with json data.
var fs = require('fs'); 
// const userID = "AT6UOrda10eaCDeNadPFmiCfdPf2";
fs.readFile('/home/glibdig/Desktop/NodeEnvironment/infridgement-de310-default-rtdb-export.json', function (error, content) {
    var data = JSON.parse(content);
    // console.log(data.Users[userID]);
    // console.log(Object.keys(data.Users).length)
    var size = Object.keys(data.Users).length;
    for (let i = 0; i < size; i++){
            console.log();
    }
});

// Function to add up all the used space in the users sections and check for low space 
// full = space in fridge filled up

function totalUsedSpace(){
    var fridgeSpace = [0, 0, 0];
    var freezerSpace = [0, 0, 0];   
    // loop through each user and section of fridge and add dimensions to variables
    

    // Call freeSpace function to return a % of space that is available
    // fridgeTotal is the total dimensions [224, 128, 79]
    var fridgeFull = freeSpace(fridgeSpace, friTotal)
    var freezerFull = freeSpace(freezerSpace, freeTotal);

    // if (fridgeFull >= 75){

    // }

}

// Input: Arrays of the space being used in the fridge/freezer and the total amount availble in the fridge/freezer
// 75% 90% 100% full results in notifications
// total = total space possible
// loop through each user and section of fridge and add dimensions to 
function freeSpace(full, total)
{
    var result = (((Math.abs(full[0] - total[0]) / total[0]) + (Math.abs(full[1] - total[1]) / total[1]) +(Math.abs(full[2] - total[2]) / total[2])) / 3) * 100;
    return result;
}

let items = [];
let list = document.getElementById("notificationList");

function addItem() {
  let newItem = "";
  items.push(newItem);
  document.getElementById("item").value = "";

  // Create a new list item
  let li = document.createElement("li");
  li.textContent = newItem;

  // Add the new list item to the unordered list
  list.appendChild(li);
}

document.getElementById("addButton").addEventListener("click", addItem);




// inputDate: String of date from the database.
function expiration(inputDate){
    var todaysDate = new Date();
    var input = new Date(inputDate)
}
// Function to go through the items and their expirations dates and notify if it is within 3 days of expiring,
// expires today, or has already expired.

var date = new Date("5/1/23");
var todayDate = new Date();
console.log(todayDate.toUTCString());


// console.log(date.toUTCString())



