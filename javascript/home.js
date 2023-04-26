// Firebase Key
import { firebaseConfig } from "./firebaseKey.js";
// Firebase Functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, child, remove, update } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
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
        displayItems("FridgeStorage", fridgeListClass, user.uid);
        displayItems("FreezerStorage", freezerListClass, user.uid);

    }
    else {
        // User is signed out
        window.location.href = "login.html";
    }
});


function displayItems(section, listClass, userID)
{
    // Fridge storage reference
    get(ref(database, `Users/${userID}/${section}`)).then((snapshot) => {
        const sections = snapshot.val();
        
        // Get keys from DB which is the section names
        const sectionNames = Object.keys(sections);
        console.log(sectionNames)
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

            ul.id = `${sectionNames[i]}-item`;

            // Get names of all items in that section
            const itemKeys = Object.keys(sections[sectionNames[i]]);

            for(let j = 0; j < itemKeys.length; j++)
            {
                var li = document.createElement("li");

                li.id = itemKeys[i];
                                
                // Expiration date of item
                const date1 = new Date(sections[sectionNames[i]][itemKeys[j]].expDate);

                // Current date right now
                const date2 = new Date();
                
                if ((date1 < date2) || (date1.getMonth() == date2.getMonth() && date1.getDate() + 1 == date2.getDate() && date1.getFullYear() == date2.getFullYear()))
                {
                    li.style.color = '#dc143c';
                }
            
                var but = document.createElement("button");
                but.className = `close-${section}`;
                but.innerHTML = "X"

                li.innerHTML = sections[sectionNames[i]][itemKeys[j]].name;

                li.appendChild(but);
                ul.appendChild(li);
            }
            
            
            listClass.appendChild(ul);   
        }

        var closeLoc = document.getElementsByClassName(`close-${section}`);
        for(let i = 0; i < closeLoc.length; i++)
        {
            closeLoc[i].onclick = function() {
                // Go up the parent element branches to the class and remove its child
                var li = this.parentElement;
                var sdiv = li.parentElement;

                const sectionName = sdiv.id.split("-")[0];
                
                get(ref(database, `Users/${userID}/${section}/${sectionName}`)).then((snapshot) => {
                    var items = snapshot.val();
                    const itemKeys = Object.keys(snapshot.val());

                    if (itemKeys.length == 1)
                    {
                        remove(ref(database, `Users/${userID}/${section}/${sectionName}/${li.id}`));

                        delete items[itemKeys[0]];

                        items[sectionName] = "";

                        update(ref(database, `Users/${userID}/${section}`), items);
                    }
                    else
                    {
                        console.log("hi")
                        remove(ref(database, `Users/${userID}/${section}/${sectionName}/${li.id}`))
                    }

                    sdiv.removeChild(li);
                });

                
            }
        }
    })
}