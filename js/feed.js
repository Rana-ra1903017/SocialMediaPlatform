let currentUser = refreshCurrentUser();

function renderFeedInfo() {
    const feedInfo = document.getElementById("feedInfo");
    const users = getUsers();
    const followingUsers = users.filter(user => (currentUser.following || []).includes(user.id));

    let infoHtml = '';
    infoHtml += '<div class="info-item"><strong>Logged in as:</strong> ' + escapeHtml(currentUser.username) + '</div>';
    infoHtml += '<div class="info-item"><strong>Following:</strong> ' + followingUsers.length + ' users</div>';

    if (followingUsers.length > 0) {
        infoHtml += '<div class="info-item"><strong>Users you follow:</strong><br>' +
            followingUsers.map(user => escapeHtml(user.username)).join(", ") +
            '</div>';
    } else {
        infoHtml += '<div class="info-item">You are not following anyone yet. Go to Profile and follow other users.</div>';
    }

    feedInfo.innerHTML = infoHtml;
}

function getFeedPosts() {
    const posts = getPosts();
    const following = currentUser.following || [];

    return posts.filter(post => post.userId === currentUser.id || following.includes(post.userId));
