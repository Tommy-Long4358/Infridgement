// Firebase Key
import { firebaseConfig } from "./firebaseKey.js";
// Firebase Functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, child } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

var uid;

// when page loads display data
displayData();

// ensure user is logged in and populate page
window.displayData = displayData;
function displayData() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in

            // get id
            const userID = user.uid;
            uid = userID;
            displayAccount(userID);
            // get data and display fridge ratio
            const frdigeRatios = ref(database, `Users/${userID}/FridgeRatio`);
            onValue(frdigeRatios, (snapshot) => {
                const userRatios = snapshot.val();

                for (var ratio in userRatios) {
                    if (ratio == "Shelf 1") {
                        document.getElementById("fridge-shelf-1").value = userRatios[ratio] + "%";
                    }
                    else if (ratio == "Shelf 2") {
                        document.getElementById("fridge-shelf-2").value = userRatios[ratio] + "%";
                    }
                    else if (ratio == "Shelf 3") {
                        document.getElementById("fridge-shelf-3").value = userRatios[ratio] + "%";
                    }
                    else if (ratio == "Produce") {
                        document.getElementById("fridge-produce").value = userRatios[ratio] + "%";
                    }
                    else if (ratio == "Door 1") {
                        document.getElementById("fridge-door-1").value = userRatios[ratio] + "%";
                    }
                    else if (ratio == "Door 2") {
                        document.getElementById("fridge-door-2").value = userRatios[ratio] + "%";
                    }
                    else if (ratio == "Door 3") {
                        document.getElementById("fridge-door-3").value = userRatios[ratio] + "%";
                    }
                }
            });

            // get data and display freezer ratio
            const freezerRatios = ref(database, `Users/${userID}/FreezerRatio`);
            onValue(freezerRatios, (snapshot) => {
                const userRatios = snapshot.val();

                for (var ratio in userRatios) {
                    if (ratio == "Shelf 1") {
                        document.getElementById("freezer-shelf-1").value = userRatios[ratio] + "%";
                    }
                    else if (ratio == "Shelf 2") {
                        document.getElementById("freezer-shelf-2").value = userRatios[ratio] + "%";
                    }
                    else if (ratio == "Shelf 3") {
                        document.getElementById("freezer-shelf-3").value = userRatios[ratio] + "%";
                    }
                    else if (ratio == "Door 1") {
                        document.getElementById("freezer-door-1").value = userRatios[ratio] + "%";
                    }
                    else if (ratio == "Door 2") {
                        document.getElementById("freezer-door-2").value = userRatios[ratio] + "%";
                    }
                }
            });
        }
        else {
            // User is signed out
            window.location.href = "index.html";
        }
    });
}


// validate input and update to database
window.updateInput = updateInput;
function updateInput(inputID) {
    // validate input
    var input = document.getElementById(inputID).value.replaceAll("%", "");

    if (input == "") {
        alert("Input cannot be empty");
    }
    else if (input.match(/[^$,.\d%]/)) {
        alert("Input can only contain numeric values");
    }
    else if (input < 0 || input > 100) {
        alert("Input must be between 0 and 100");
    }
    else {
        // get all input values
        const fridgeShelf1 = document.getElementById("fridge-shelf-1").value.replaceAll("%", "");
        const fridgeShelf2 = document.getElementById("fridge-shelf-2").value.replaceAll("%", "");
        const fridgeShelf3 = document.getElementById("fridge-shelf-3").value.replaceAll("%", "");
        const fridgeProduce = document.getElementById("fridge-produce").value.replaceAll("%", "");
        const fridgeDoor1 = document.getElementById("fridge-door-1").value.replaceAll("%", "");
        const fridgeDoor2 = document.getElementById("fridge-door-2").value.replaceAll("%", "");
        const fridgeDoor3 = document.getElementById("fridge-door-3").value.replaceAll("%", "");

        const freezerShelf1 = document.getElementById("freezer-shelf-1").value.replaceAll("%", "");
        const freezerShelf2 = document.getElementById("freezer-shelf-2").value.replaceAll("%", "");
        const freezerShelf3 = document.getElementById("freezer-shelf-3").value.replaceAll("%", "");
        const freezerDoor1 = document.getElementById("freezer-door-1").value.replaceAll("%", "");
        const freezerDoor2 = document.getElementById("freezer-door-2").value.replaceAll("%", "");

        // parse for refrigerator section and update to match db path names
        const pathString = inputID.replaceAll("-", " ");
        const fridgeOrFreezer = pathString.substring(0, pathString.indexOf(" "));
        const fridgeOrFreezerDB = "/" + fridgeOrFreezer.charAt(0).toUpperCase() + fridgeOrFreezer.slice(1) + "Ratio";
        const section = pathString.substring(pathString.indexOf(' ') + 1);

        // get data before edit 
        get(child(ref(database), `Users/` + uid + fridgeOrFreezerDB)).then((snapshot) => {
            if (snapshot.exists()) {
                // console.log(snapshot.val());
                const previousVals = snapshot.val();
                // console.log(previousVals);
                
                // update database with new input
                if (fridgeOrFreezer == "fridge") {
                    set(ref(database, 'Users/' + uid + fridgeOrFreezerDB), {
                        "Shelf 1": fridgeShelf1,
                        "Shelf 2": fridgeShelf2,
                        "Shelf 3": fridgeShelf3,
                        "Produce": fridgeProduce,
                        "Door 1": fridgeDoor1,
                        "Door 2": fridgeDoor2,
                        "Door 3": fridgeDoor3
                    });
                }
                else if (fridgeOrFreezer == "freezer") {
                    set(ref(database, 'Users/' + uid + fridgeOrFreezerDB), {
                        "Shelf 1": freezerShelf1,
                        "Shelf 2": freezerShelf2,
                        "Shelf 3": freezerShelf3,
                        "Door 1": freezerDoor1,
                        "Door 2": freezerDoor2,
                    });
                }

                // check if section total is under 100%
                checkSharedSpace(fridgeOrFreezerDB, previousVals);

            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

    }
    displayData();
}


// check if shared space is <= 100%
function checkSharedSpace(fridgeOrFreezerDB, previousVals) {
    get(child(ref(database), `Users/`)).then((snapshot) => {
        if (snapshot.exists()) {
            // console.log(snapshot.val());

            // section totals 
            var fridgeShelf1Total = 0;
            var fridgeShelf2Total = 0;
            var fridgeShelf3Total = 0;
            var fridgeProduceTotal = 0;
            var fridgeDoor1Total = 0;
            var fridgeDoor2Total = 0;
            var fridgeDoor3Total = 0;

            var freezerShelf1Total = 0;
            var freezerShelf2Total = 0;
            var freezerShelf3Total = 0;
            var freezerDoor1Total = 0;
            var freezerDoor2Total = 0;


            const userData = snapshot.val();

            // console.log(userData);

            // sum of sections from all users
            for (var user in userData) {
                fridgeShelf1Total += Number(userData[user]["FridgeRatio"]["Shelf 1"]);
                fridgeShelf2Total += Number(userData[user]["FridgeRatio"]["Shelf 2"]);
                fridgeShelf3Total += Number(userData[user]["FridgeRatio"]["Shelf 3"]);
                fridgeProduceTotal += Number(userData[user]["FridgeRatio"]["Produce"]);
                fridgeDoor1Total += Number(userData[user]["FridgeRatio"]["Door 1"]);
                fridgeDoor2Total += Number(userData[user]["FridgeRatio"]["Door 2"]);
                fridgeDoor3Total += Number(userData[user]["FridgeRatio"]["Door 3"]);

                freezerShelf1Total += Number(userData[user]["FreezerRatio"]["Shelf 1"]);
                freezerShelf2Total += Number(userData[user]["FreezerRatio"]["Shelf 2"]);
                freezerShelf3Total += Number(userData[user]["FreezerRatio"]["Shelf 3"]);
                freezerDoor1Total += Number(userData[user]["FreezerRatio"]["Door 1"]);
                freezerDoor2Total += Number(userData[user]["FreezerRatio"]["Door 2"]);
            }

            // check if any section total is over 100
            var availableSpaceFridge = (fridgeShelf1Total > 100) || (fridgeShelf2Total > 100) || (fridgeShelf3Total > 100) || (fridgeProduceTotal > 100) || (fridgeDoor1Total > 100) || (fridgeDoor2Total > 100) || (fridgeDoor3Total > 100);
            var availableSpaceFreezer = (freezerShelf1Total > 100) || (freezerShelf2Total > 100) || (freezerShelf3Total > 100) || (freezerDoor1Total > 100) || (freezerDoor2Total > 100);
            if (availableSpaceFridge) {
                // revert back to old input values
                set(ref(database, `Users/` + uid + fridgeOrFreezerDB), { 
                    "Shelf 1": Object.values(previousVals)[4],
                    "Shelf 2": Object.values(previousVals)[5],
                    "Shelf 3": Object.values(previousVals)[6],
                    "Produce": Object.values(previousVals)[3],
                    "Door 1": Object.values(previousVals)[0],
                    "Door 2": Object.values(previousVals)[1],
                    "Door 3": Object.values(previousVals)[2]
                });

                alert("Insufficient shared fridge space for this section! Please select a lower value.");
            } 
            else if (availableSpaceFreezer) {
                // revert back to old input values
                set(ref(database, `Users/` + uid + fridgeOrFreezerDB), { 
                    "Shelf 1": Object.values(previousVals)[2],
                    "Shelf 2": Object.values(previousVals)[3],
                    "Shelf 3": Object.values(previousVals)[4],
                    "Door 1": Object.values(previousVals)[0],
                    "Door 2": Object.values(previousVals)[1],
                });

                alert("Insufficient shared freezer space for this section! Please select a lower value.");
            }
            else {
                // alert("Value has been updated");        
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
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