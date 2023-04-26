
var ul = document.getElementById("notificationList");
var li = document.createElement("li");
li.textContent = "Testing!"
ul.appendChild(li);

// Get trash and read button's elements.
document.getElementById("trash").addEventListener("click", deleteAll);
// document.getElementById("read").addEventListener("click", markRead);
function deleteAll() {
    var list = document.getElementById("notificationList")
    list.innerHTML = "";
}

// Function to remove unread symbol next to notifications.
// function markRead(){
// }

// Get notification-list element

// Delete items in unordered list

