



function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function redirectIfNotLoggedIn() {
    const protectedPages = ["feed.html", "profile.html", "post.html"];
    const currentPage = window.location.pathname.split("/").pop();

    if (protectedPages.includes(currentPage) && !getCurrentUser()) {
        window.location = "index.html";
    }
}

redirectIfNotLoggedIn();

const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();

        if (users.find(user => user.email === email)) {
            alert("This email is already registered.");
            return;
        }

        const newUser = {
            id: Date.now(),
            username: username,
            email: email,
            password: password,
            following: []
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration completed successfully.");
        window.location = "index.html";
    });
}
