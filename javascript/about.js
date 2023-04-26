import {db, updatePassword, reauthenticateWithCredential,EmailAuthProvider} from "./db.js";
import { firebaseConfig } from "./firebaseKey.js";
// Firebase Functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, child, push } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
//This is a function to change the user profile picture
//Need to update this so that it can upload to database

// Retrieve ID of user that just logged in
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
      displayAccount(userID);
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
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