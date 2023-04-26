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
      console.log(userID);
      displayAccount(userID);
      // ...
    } else {
      // User is signed out
      // ...
    }
  });


document.getElementById('file').onchange = function (evt) {
  var tgt = evt.target || window.event.srcElement,
      files = tgt.files;
  
  // FileReader support
  if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = function () {
          document.getElementById("pfp").src = fr.result;
      }
      fr.readAsDataURL(files[0]);
  }
}

// display user account information
// displayAccount(userID);

document.getElementById("userProfileDetails").addEventListener("submit", profileUpdate);


// displays the user's information & profile pic
function displayAccount(accountID)
{
  // Reference of a user's account information from the database
  const accountRef = ref(database, `Users/${accountID}/AccountInfo`);

  onValue(accountRef, (snapshot) => {
    // Retrieve user's account information as object
    const data = snapshot.val();    

    // Image element of profile picture
    var image = document.getElementById("profile-info-picture");
    var image2 = document.getElementById("pfp");
    // var fullN = document.getElementById("fullname");
    var fname = document.getElementById("firstName");
    var lname = document.getElementById("lastName");
    var mail = document.getElementById("email");
    var uname = document.getElementById("username");
    //var pass = document.getElementById("password");

    // Assign picture's src to picture from user's account information
    image.src = data.profilePicture;
    image2.src = data.profilePicture;
    var fullname = data.fullName;
    // fullN.innerText = fullname;
    var firstlastname = fullname.split(" ");
    fname.value = firstlastname[0];
    lname.value = firstlastname[1];
    mail.value = data.email;
    uname.value = data.username;
    

    // Display user's full name next to profile picture
    // image.text = "";
    // image.insertAdjacentText("afterend", data.fullName)
    document.getElementById("full-name").textContent = data.fullName;
  })
}

// updated the profile on the DB
async function profileUpdate(e)
{
  e.preventDefault();
  
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const userName = document.getElementById("username").value;
  const profilepic = document.getElementById("pfp").src;
  const pass = document.getElementById("password").value;
  const npass = document.getElementById("new-password").value;
  const user = auth.currentUser;

  const accountRef = ref(database, `Users/${userID}/AccountInfo`);
    if ( (pass != "") && (npass != ""))
    {
        onValue(accountRef, (snapshot) => {
        // Retrieve user's account information as object
        const data = snapshot.val();   
        const credential = EmailAuthProvider.credential(
        data.email,
        pass
        );
        reauthenticateWithCredential(user, credential).then(() => {
        updatePassword(user,npass).then(() => {
        console.log("Password updated!");
        }).catch((error) => {
        console.log(error);
        // ...
        });
        });
    });
    }
  
  await set(ref(database, `Users/${userID}/AccountInfo`), {
    email: email,
    fullName: firstName + " " + lastName,
    profilePicture: profilepic,
    username: userName,
  });
  document.getElementById("password").value = "";
  document.getElementById("new-password").value = "";
}