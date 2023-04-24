
// Delete items in unordered list
document.getElementById("trash").addEventListener("click", deleteAll);
function deleteAll() {
    var list = document.getElementById("notificationList")
    list.innerHTML = "";
}

