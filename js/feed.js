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

function displayPosts() {
    currentUser = refreshCurrentUser();
    const container = document.getElementById("posts");
    const posts = getFeedPosts();

    container.innerHTML = "";

    if (posts.length === 0) {
        container.innerHTML = '<p class="empty-text">No posts in your feed yet. Follow users or create your own post.</p>';
        renderFeedInfo();
        return;
    }

    posts.forEach(post => {
        const commentsHtml = post.comments.length > 0
            ? post.comments.map(comment => `
                <div class="comment-item">
                    <div class="comment-user">${escapeHtml(comment.user)}</div>
                    <div>${escapeHtml(comment.text)}</div>
                </div>
            `).join("")
            : '<p class="empty-text">No comments yet.</p>';

        const deleteButton = post.userId === currentUser.id
            ? `<button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>`
            : "";

        const alreadyLiked = (post.likedBy || []).includes(currentUser.id);
        const likeLabel = alreadyLiked ? `Liked (${post.likes})` : `Like (${post.likes})`;

        container.innerHTML += `
            <article class="post">
                <div class="post-header">
                    <div class="post-user">${escapeHtml(post.user)}</div>
                    <div class="post-time">${formatDate(post.createdAt)}</div>
                </div>

                <div class="post-content">${escapeHtml(post.content)}</div>

                <div class="post-actions">
                    <button class="like-btn" onclick="likePost(${post.id})">${likeLabel}</button>
                    <a class="view-btn" href="post.html?id=${post.id}">View Details</a>
                    ${deleteButton}
                </div>

                <div class="comment-section">
                    <div class="comment-form">
                        <input type="text" id="commentInput-${post.id}" placeholder="Write a comment...">
                        <button class="comment-btn" onclick="addComment(${post.id})">Comment</button>
                    </div>
                    <div class="comment-list">${commentsHtml}</div>
                </div>
            </article>
        `;
    });

    renderFeedInfo();
}

displayPosts();