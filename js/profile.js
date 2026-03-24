let currentUser = refreshCurrentUser();

function followUser(userId) {
    const users = getUsers();
    const loggedInUser = users.find(user => user.id === currentUser.id);

    if (!loggedInUser.following) {
        loggedInUser.following = [];
    }

    if (!loggedInUser.following.includes(userId)) {
        loggedInUser.following.push(userId);
    }

    saveUsers(users);
    currentUser = refreshCurrentUser();
    renderProfile();
    renderUsersList();
}

function unfollowUser(userId) {
    const users = getUsers();
    const loggedInUser = users.find(user => user.id === currentUser.id);

    loggedInUser.following = (loggedInUser.following || []).filter(id => id !== userId);

    saveUsers(users);
    currentUser = refreshCurrentUser();
    renderProfile();
    renderUsersList();
}
function editProfile() {
    const profileInfo = document.getElementById("profileInfo");

    profileInfo.innerHTML = `
        <p class="profile-stat">
            <label for="editUsername"><strong>Username:</strong></label><br>
            <input type="text" id="editUsername" value="${escapeHtml(currentUser.username)}">
        </p>
        <p class="profile-stat">
            <label for="editEmail"><strong>Email:</strong></label><br>
            <input type="email" id="editEmail" value="${escapeHtml(currentUser.email)}">
        </p>
        <p class="profile-stat">
            <label for="editBio"><strong>Bio:</strong></label><br>
            <textarea id="editBio" rows="3" placeholder="Write something about yourself...">${currentUser.bio ? escapeHtml(currentUser.bio) : ""}</textarea>
        </p>
        <div class="post-actions">
            <button class="primary-btn" onclick="saveProfile()">Save Changes</button>
            <button class="logout-btn" onclick="renderProfile()">Cancel</button>
        </div>
    `;
}

function saveProfile() {
    const username = document.getElementById("editUsername").value.trim();
    const email = document.getElementById("editEmail").value.trim().toLowerCase();
    const bio = document.getElementById("editBio").value.trim();

    if (!username || !email) {
        alert("Username and Email are required.");
        return;
    }

    const users = getUsers();
    const loggedInUser = users.find(user => user.id === currentUser.id);
    loggedInUser.username = username;
    loggedInUser.email = email;
    loggedInUser.bio = bio;

    saveUsers(users);
    currentUser = refreshCurrentUser();
    renderProfile();
}

function renderProfile() {
    const profileInfo = document.getElementById("profileInfo");
    const posts = getPosts();
    const myPosts = posts.filter(post => post.userId === currentUser.id);
    const users = getUsers();
    const followingUsers = users.filter(user => (currentUser.following || []).includes(user.id));

    profileInfo.innerHTML = `
        <p class="profile-stat"><strong>Username:</strong> ${escapeHtml(currentUser.username)}</p>
        <p class="profile-stat"><strong>Bio:</strong> ${currentUser.bio ? escapeHtml(currentUser.bio) : "No bio yet."}</p>
        <p class="profile-stat"><strong>Email:</strong> ${escapeHtml(currentUser.email)}</p>
        <p class="profile-stat"><strong>Total Posts:</strong> ${myPosts.length}</p>
        <p class="profile-stat"><strong>Following:</strong> ${followingUsers.length}</p>
        <button class="primary-btn" onclick="editProfile()">Edit Profile</button>
    `;

    renderMyPosts(myPosts);
}

function renderMyPosts(myPosts) {
    const myPostsContainer = document.getElementById("myPosts");

    if (myPosts.length === 0) {
        myPostsContainer.innerHTML = '<p class="empty-text">You have not created any posts yet.</p>';
        return;
    }

    myPostsContainer.innerHTML = myPosts.map(post => `
        <article class="post">
            <div class="post-header">
                <div class="post-user">${escapeHtml(post.user)}</div>
                <div class="post-time">${formatDate(post.createdAt)}</div>
            </div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            <div class="post-actions">
                <a class="view-btn" href="post.html?id=${post.id}">View Details</a>
            </div>
        </article>
    `).join("");
}

function renderUsersList() {
    const usersList = document.getElementById("usersList");
    const users = getUsers().filter(user => user.id !== currentUser.id);

    if (users.length === 0) {
        usersList.innerHTML = '<p class="empty-text">No other users yet. Create another account to test follow/unfollow.</p>';
        return;
    }

    usersList.innerHTML = users.map(user => {
        const isFollowing = (currentUser.following || []).includes(user.id);

        return `
            <div class="user-item">
                <div class="user-row">
                    <div class="user-meta">
                        <strong>${escapeHtml(user.username)}</strong><br>
                        <span class="small-text">${escapeHtml(user.email)}</span>
                    </div>
                    ${isFollowing
                ? `<button class="unfollow-btn" onclick="unfollowUser(${user.id})">Unfollow</button>`
                : `<button class="follow-btn" onclick="followUser(${user.id})">Follow</button>`
            }
                </div>
            </div>
        `;
    }).join("");
}

renderProfile();
renderUsersList();