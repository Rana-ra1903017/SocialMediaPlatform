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