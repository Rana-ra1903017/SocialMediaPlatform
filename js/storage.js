




function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUserData() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

