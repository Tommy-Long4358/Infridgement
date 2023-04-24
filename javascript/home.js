// Firebase Key
import { firebaseConfig } from "./firebaseKey.js";

// Firebase Functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, get} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

const fridgeListClass = document.getElementsByClassName("fridge-list")[0];
const freezerListClass = document.getElementsByClassName("freezer-list")[0];

onAuthStateChanged(auth, (user) => {
    if (user)
    {
        displayItems("FridgeStorage", fridgeListClass, user.uid);
        displayItems("FreezerStorage", freezerListClass, user.uid);
    }
    else
    {
        window.location.href = "login.html";
    }
})

// Test functions to ensure it works with a hardcoded user ID
//displayItems("FridgeStorage", fridgeListClass, "kzPG8qdqWjcTOvfYx8MtlCm1LcZ2");
//displayItems("FreezerStorage", freezerListClass, "kzPG8qdqWjcTOvfYx8MtlCm1LcZ2");

function displayItems(section, listClass, userID)
{
    // Fridge storage reference
    get(ref(database, `Users/${userID}/${section}`)).then((snapshot) => {
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

            for(let i = 0; i < itemKeys.length; i++)
            {
                var li = document.createElement("li");
                li.innerHTML = itemKeys[i];
                listClass.appendChild(li);
            }
            
            listClass.appendChild(ul);   
        }
    })
}