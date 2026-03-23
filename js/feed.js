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
}
function createPost() {
    const postContentElement = document.getElementById("postContent");
    const content = postContentElement.value.trim();

    if (content === "") {
        alert("Please write something before posting.");
        return;
    }

    const posts = getPosts();

    posts.unshift({
        id: Date.now(),
        user: currentUser.username,
        userId: currentUser.id,
        content: content,
        likes: 0,
        likedBy: [],
        comments: [],
        createdAt: new Date().toISOString()
    });

    savePosts(posts);
    postContentElement.value = "";
    displayPosts();
}

function likePost(id) {
    const posts = getPosts();

    posts.forEach(post => {
        if (post.id === id) {
            post.likedBy = post.likedBy || [];
            if (!post.likedBy.includes(currentUser.id)) {
                post.likedBy.push(currentUser.id);
                post.likes = post.likedBy.length;
            }
        }
    });

    savePosts(posts);
    displayPosts();
}

function deletePost(id) {
    let posts = getPosts();
    posts = posts.filter(post => post.id !== id);
    savePosts(posts);
    displayPosts();
}

function addComment(postId) {
    const input = document.getElementById("commentInput-" + postId);
    const text = input.value.trim();

    if (text === "") {
        alert("Please enter a comment.");
        return;
    }

    const posts = getPosts();

    posts.forEach(post => {
        if (post.id === postId) {
            post.comments.push({
                id: Date.now(),
                user: currentUser.username,
                text: text,
                createdAt: new Date().toISOString()
            });
        }
    });

    savePosts(posts);
    displayPosts();
}