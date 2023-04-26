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






// run funcitons if user is logged in 
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in

        // show user capacity for secs
        displayCapacity(user);
        displayAccount(user.uid);
    }
    else {
        // User is signed out
        window.location.href = "index.html";
    }
});



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

        console.log(userData);


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

        console.log(userData["FridgeStorage"]);

        // iterate through fridge section 
        for (var fridgeSections in userData["FridgeStorage"]) {
            console.log(fridgeSections);

            // calculate total volume of items in a section 
            var usedSecVol = 0;
            for (var keys in userData["FridgeStorage"][fridgeSections]) {
                usedSecVol += Object.values(userData["FridgeStorage"][fridgeSections][keys]["dim"]).reduce((a, b) => a * b);

                console.log(keys);
            }

            // calculate used capacity percentage and display capacity to corresponding section 
            if (fridgeSections == "Shelf 1") {
                document.getElementById("fridge-shelf-1").innerHTML = Math.round(((usedSecVol) / friS1UserVol) * 100) + "%";
            }
            else if (fridgeSections == "Shelf 2") {
                document.getElementById("fridge-shelf-2").innerHTML = Math.round(((usedSecVol) / friS2UserVol) * 100) + "%";
            }
            else if (fridgeSections == "Shelf 3") {
                document.getElementById("fridge-shelf-3").innerHTML = Math.round(((usedSecVol) / friS3UserVol) * 100) + "%";
            }
            else if (fridgeSections == "Produce") {
                document.getElementById("produce").innerHTML = Math.round(((usedSecVol) / produceUserVol) * 100) + "%";
            }
            else if (fridgeSections == "Door 1") {
                document.getElementById("fridge-door-1").innerHTML = Math.round(((usedSecVol) / friD1UserVol) * 100) + "%";
            }
            else if (fridgeSections == "Door 2") {
                document.getElementById("fridge-door-2").innerHTML = Math.round(((usedSecVol) / friD2UserVol) * 100) + "%";
            }
            else if (fridgeSections == "Door 3") {
                document.getElementById("fridge-door-3").innerHTML = Math.round(((usedSecVol) / friD3UserVol) * 100) + "%";
            }
        }

        console.log(userData["FreezerStorage"]);

        // iterate through fridge section 
        for (var freezerSections in userData["FreezerStorage"]) {
            console.log(freezerSections);

            // calculate total volume of items in a section 
            var usedSecVol = 0;
            for (var keys in userData["FreezerStorage"][freezerSections]) {
                usedSecVol += Object.values(userData["FreezerStorage"][freezerSections][keys]["dim"]).reduce((a, b) => a * b);

                console.log(keys);
            }

            // calculate used capacity percentage and display capacity to corresponding section 
            if (freezerSections == "Shelf 1") {
                document.getElementById("freezer-shelf-1").innerHTML = Math.round(((usedSecVol) / frezS1UserVol) * 100) + "%";
            }
            else if (freezerSections == "Shelf 2") {
                document.getElementById("freezer-shelf-2").innerHTML = Math.round(((usedSecVol) / frezS2UserVol) * 100) + "%";
            }
            else if (freezerSections == "Shelf 3") {
                document.getElementById("freezer-shelf-3").innerHTML = Math.round(((usedSecVol) / frezS3UserVol) * 100) + "%";
            }
            else if (freezerSections == "Door 1") {
                document.getElementById("freezer-door-1").innerHTML = Math.round(((usedSecVol) / frezD1UserVol) * 100) + "%";
            }
            else if (freezerSections == "Door 2") {
                document.getElementById("freezer-door-2").innerHTML = Math.round(((usedSecVol) / frezD2UserVol) * 100) + "%";
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