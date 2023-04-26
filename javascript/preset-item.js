// Firebase Key
import { firebaseConfig } from "./firebaseKey.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, push, ref, update, increment, onValue, set, limitToLast, limitToFirst, query, get, orderByChild, orderByKey, orderByValue, remove } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

var uid;

var containerElement = document.getElementById('item-container');

onAuthStateChanged(auth, (user) => {
  if (user) {

    // get id
    const userID = user.uid;
    uid = userID;

    const presetRef = ref(db, `Users/${userID}/PresetItems`);
    // get all presets
    get(presetRef).then((snapshot) => {
      const presets = snapshot.val();
      console.log(presets);
      for (var preset in presets){
        const itemRef = ref(db, `Users/${userID}/PresetItems/${preset}`);
        //display each preset
        get(itemRef).then((snapshot) => {
          const item = snapshot.val();
          console.log(item);
          var divElement = document.createElement('div');
          //add class to div
          divElement.classList.add('item');

          // Set the innerHTML content of the <div> element to the current values from preset
          divElement.innerHTML = item.Name + "<br>" + item.Height +'" X '+item.Width+'" X '+item.Length+'" <br>'+item.Type;
    
          const button = document.createElement('input');
          button.type = 'submit';
          button.value = '+';
          button.className="button"
          button.onclick = function() {
            fill(item.Name, item.Height, item.Width, item.Length, item.Type);
          }
          divElement.appendChild(button);
    
          // Append the <div> element to the container element
          containerElement.appendChild(divElement);
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  else {
      // User is signed out
      window.location.href = "login.html";
  }
});



function addPreset(){
  const Name = document.getElementById('presetName').value ; 
  const height= document.getElementById('presetHeight').value ; 
  const width= document.getElementById('presetWidth').value ; 
  const length= document.getElementById('presetLength').value ; 
  const type= document.getElementById('presetType').value ;
  if ((Name=='')||(height=='')||(width=='')||(length=='')||(type=='')){
    alert('make sure all forms are filled before creating a new preset');
  }
  else{
    const presetRef = ref(db, `Users/${uid}/PresetItems`);
    push(presetRef, {
      "Name": Name,
      "Height": height,
      "Width": width,
      "Length": length,
      "Type": type,
    })
    window.location.reload();
  }

}
document.querySelector(".submitbutton").addEventListener("click", addPreset);