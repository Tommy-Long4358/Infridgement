// Firebase Key
import { firebaseConfig } from "./firebaseKey.js";
// Firebase Functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, child } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

// frdige dims
import { friSh1, friSh2, friSh3, produce, friD1, friD2, friD3, freeSh1, freeSh2, freeSh3, freeD1, freeD2 } from "./dims.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

const fridgeListClass = document.getElementsByClassName("fridge-list")[0];
const freezerListClass = document.getElementsByClassName("freezer-list")[0];

// run funcitons if user is logged in 
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in

        // show user capacity for secs
        displayCapacity(user);
        displayAccount(user.uid);
        displayItems("FridgeStorage", fridgeListClass, user.uid);
        displayItems("FreezerStorage", freezerListClass, user.uid);
    }
    else {
        // User is signed out
        window.location.href = "index.html";
    }
});

function displayItems(section, listClass, userID)
{
    // Fridge storage reference
    get(ref(db, `Users/${userID}/${section}`)).then((snapshot) => {
        const sections = snapshot.val();

        
        // Get keys from DB which is the section names
        const sectionNames = Object.keys(sections);

        for(let i = 0; i < sectionNames.length; i++)
        {
            // H4 element to display what section it is
            var h4Element = document.createElement("h4");

            // Set name of h4 element with key name
            h4Element.innerHTML = sectionNames[i];

            // Append to fridge-list class in HTML
            listClass.appendChild(h4Element);

            // Create <ul> element
            var ul = document.createElement("ul");

            // Get names of all items in that section
            const itemKeys = Object.keys(sections[sectionNames[i]]);
            //const itemKeys = Object.keys(sections[sectionNames[i].name]);

            for(let i = 0; i < itemKeys.length; i++)
            {
                var li = document.createElement("li");
                
                /*
                // Check expiration date and mark item as red
                
                // Expiration date of item
                const date1 = new Date(section[sectionNames[i]].expDate);

                // Current date right now
                const date2 = new Date();
                
                if (date1.getMonth() == date2.getMonth() && date1.getDate() + 1 == date2.getDate() && date1.getFullYear() == date2.getFullYear())
                {
                    console.log("true");
                    li.style.color = '#FF0000';
                }
                */

                var but = document.createElement("button");
                var txt = document.createTextNode("\u00D7");
                but.className = "close-loc";
                
                but.appendChild(txt);
                li.appendChild(but);

                li.innerHTML = itemKeys[i];

                ul.appendChild(li);
            }
            
            listClass.appendChild(ul);   
        }

        for(let i = 0; i < closeLoc.length; i++)
        {
            closeLoc[i].onclick = function() {
                console.log("click!");
              }
        }
    })
}

// === get capcaity === 
// 1. get dim of fridge/section and calc sec vol 
// 2. get ratio from db
// 3. volume of section X ratio = TotalSecSpace
// 4. get all user items volumes from database
// 5. TotalSecSpace - sum item volumes in section = FreeSpace 
// 6. FreeSpace / 
function displayCapacity(user) {

    // access user data
    const userDataPath = ref(database, `Users/${user.uid}`);
    onValue(userDataPath, (snapshot) => {
        const userData = snapshot.val();

        // User section space = volume of refrigerator section  X   (section ratio / 100)
        // fridge section user volume 
        const friS1UserVol = calcVolume(friSh1[0], friSh1[1], friSh1[2]) * (userData["FridgeRatio"]["Shelf 1"] / 100);
        const friS2UserVol = calcVolume(friSh2[0], friSh2[1], friSh2[2]) * (userData["FridgeRatio"]["Shelf 2"] / 100);
        const friS3UserVol = calcVolume(friSh3[0], friSh3[1], friSh3[2]) * (userData["FridgeRatio"]["Shelf 3"] / 100);
        const produceUserVol = calcVolume(produce[0], produce[1], produce[2]) * (userData["FridgeRatio"]["Produce"] / 100);
        const friD1UserVol = calcVolume(friD1[0], friD1[1], friD1[2]) * (userData["FridgeRatio"]["Door 1"] / 100);
        const friD2UserVol = calcVolume(friD2[0], friD2[1], friD2[2]) * (userData["FridgeRatio"]["Door 2"] / 100);
        const friD3UserVol = calcVolume(friD3[0], friD3[1], friD3[2]) * (userData["FridgeRatio"]["Door 3"] / 100);

        // freezer section user volumes 
        const frezS1UserVol = calcVolume(freeSh1[0], freeSh1[1], freeSh1[2]) * (userData["FreezerRatio"]["Shelf 1"] / 100);
        const frezS2UserVol = calcVolume(freeSh2[0], freeSh2[1], freeSh2[2]) * (userData["FreezerRatio"]["Shelf 2"] / 100);
        const frezS3UserVol = calcVolume(freeSh3[0], freeSh3[1], freeSh3[2]) * (userData["FreezerRatio"]["Shelf 3"] / 100);
        const frezD1UserVol = calcVolume(freeD1[0], freeD1[1], freeD1[2]) * (userData["FreezerRatio"]["Door 1"] / 100);
        const frezD2UserVol = calcVolume(freeD2[0], freeD2[1], freeD2[2]) * (userData["FreezerRatio"]["Door 2"] / 100);

        // iterate through fridge section 
        for (var fridgeSections in userData["FridgeStorage"]) {

            // calculate total volume of items in a section 
            var usedSecVol = 0;
            for (var keys in userData["FridgeStorage"][fridgeSections]) {
                usedSecVol += Object.values(userData["FridgeStorage"][fridgeSections][keys]["dim"]).reduce((a, b) => a * b);
            }

            // calculate used capacity percentage and display capacity to corresponding section 
            if (fridgeSections == "Shelf 1") {
                const capacityPercent = Math.round(((usedSecVol) / friS1UserVol) * 100);

                if (Number.isNaN(capacityPercent)) {
                    document.getElementById("fridge-shelf-1").innerHTML = "Unassigned Ratio";
                }
                else {
                    document.getElementById("fridge-shelf-1").innerHTML = capacityPercent + "%";
                }
            }
            else if (fridgeSections == "Shelf 2") {
                const capacityPercent = Math.round(((usedSecVol) / friS2UserVol) * 100);

                if (Number.isNaN(capacityPercent)) {
                    document.getElementById("fridge-shelf-2").innerHTML = "Unassigned Ratio";
                }
                else {
                    document.getElementById("fridge-shelf-2").innerHTML = capacityPercent + "%";
                }
            }
            else if (fridgeSections == "Shelf 3") {
                const capacityPercent = Math.round(((usedSecVol) / friS3UserVol) * 100);

                if (Number.isNaN(capacityPercent)) {
                    document.getElementById("fridge-shelf-3").innerHTML = "Unassigned Ratio";
                }
                else {
                    document.getElementById("fridge-shelf-3").innerHTML = capacityPercent + "%";
                }
            }
            else if (fridgeSections == "Produce") {
                const capacityPercent = Math.round(((usedSecVol) / produceUserVol) * 100);

                if (Number.isNaN(capacityPercent)) {
                    document.getElementById("produce").innerHTML = "Unassigned Ratio";
                }
                else {
                    document.getElementById("produce").innerHTML = capacityPercent + "%";
                }
            }
            else if (fridgeSections == "Door 1") {
                const capacityPercent = Math.round(((usedSecVol) / friD1UserVol) * 100);

                if (Number.isNaN(capacityPercent)) {
                    document.getElementById("fridge-door-1").innerHTML = "Unassigned Ratio";
                }
                else {
                    document.getElementById("fridge-door-1").innerHTML = capacityPercent + "%";
                }
            }
            else if (fridgeSections == "Door 2") {
                const capacityPercent = Math.round(((usedSecVol) / friD2UserVol) * 100);

                if (Number.isNaN(capacityPercent)) {
                    document.getElementById("fridge-door-2").innerHTML = "Unassigned Ratio";
                }
                else {
                    document.getElementById("fridge-door-2").innerHTML = capacityPercent + "%";
                }
            }
            else if (fridgeSections == "Door 3") {
                const capacityPercent = Math.round(((usedSecVol) / friD3UserVol) * 100);

                if (Number.isNaN(capacityPercent)) {
                    document.getElementById("fridge-door-3").innerHTML = "Unassigned Ratio";
                }
                else {
                    document.getElementById("fridge-door-3").innerHTML = capacityPercent + "%";
                }
            }
        }

        // iterate through fridge section 
        for (var freezerSections in userData["FreezerStorage"]) {

            // calculate total volume of items in a section 
            var usedSecVol = 0;
            for (var keys in userData["FreezerStorage"][freezerSections]) {
                usedSecVol += Object.values(userData["FreezerStorage"][freezerSections][keys]["dim"]).reduce((a, b) => a * b);
            }

            // calculate used capacity percentage and display capacity to corresponding section 
            if (freezerSections == "Shelf 1") {
                const capacityPercent = Math.round(((usedSecVol) / frezS1UserVol) * 100);

                if (Number.isNaN(capacityPercent)) {
                    document.getElementById("freezer-shelf-1").innerHTML = "Unassigned Ratio";
                }
                else {
                    document.getElementById("freezer-shelf-1").innerHTML = capacityPercent + "%";
                }
            }
            else if (freezerSections == "Shelf 2") {
                const capacityPercent = Math.round(((usedSecVol) / frezS2UserVol) * 100);

                if (Number.isNaN(capacityPercent)) {
                    document.getElementById("freezer-shelf-2").innerHTML = "Unassigned Ratio";
                }
                else {
                    document.getElementById("freezer-shelf-2").innerHTML = capacityPercent + "%";
                }
            }
            else if (freezerSections == "Shelf 3") {
                const capacityPercent = Math.round(((usedSecVol) / frezS3UserVol) * 100);

                if (Number.isNaN(capacityPercent)) {
                    document.getElementById("freezer-shelf-3").innerHTML = "Unassigned Ratio";
                }
                else {
                    document.getElementById("freezer-shelf-3").innerHTML = capacityPercent + "%";
                }
            }
            else if (freezerSections == "Door 1") {
                const capacityPercent = Math.round(((usedSecVol) / frezD1UserVol) * 100);

                if (Number.isNaN(capacityPercent)) {
                    document.getElementById("freezer-door-1").innerHTML = "Unassigned Ratio";
                }
                else {
                    document.getElementById("freezer-door-1").innerHTML = capacityPercent + "%";
                }
            }
            else if (freezerSections == "Door 2") {
                const capacityPercent = Math.round(((usedSecVol) / frezD2UserVol) * 100);

                if (Number.isNaN(capacityPercent)) {
                    document.getElementById("freezer-door-2").innerHTML = "Unassigned Ratio";
                }
                else {
                    document.getElementById("freezer-door-2").innerHTML = capacityPercent + "%";
                }
            }
        }
    });
}

function calcVolume(edge1, edge2, edge3) {
    return edge1 * edge2 * edge3;
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
