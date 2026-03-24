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

function validateEmail(email) {
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

function validatePassword(password) {
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain a number.";
    return "";
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const pwMsg = validatePassword(password);
        if (pwMsg) {
            alert(pwMsg);
            return;
        }

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

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const pwMsg = validatePassword(password);
        if (pwMsg) {
            alert(pwMsg);
            return;
        }

        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            alert("Invalid email or password.");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location = "feed.html";
    });
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location = "index.html";
}