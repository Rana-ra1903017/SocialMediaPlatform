function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUserData() {
    return JSON.parse(localStorage.getItem("currentUser"));
}
function getPosts() {
    return JSON.parse(localStorage.getItem("posts")) || [];
}
function getCurrentUserData() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function refreshCurrentUser() {
    const currentUser = getCurrentUserData();
    if (!currentUser) return null;

    const users = getUsers();
    const freshUser = users.find(user => user.id === currentUser.id);

    if (freshUser) {
        localStorage.setItem("currentUser", JSON.stringify(freshUser));
        return freshUser;
    }

    return currentUser;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
