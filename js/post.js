let currentUser = refreshCurrentUser();

function likeSinglePost(id) {
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
    renderSinglePost();
}

function addSingleComment(postId) {
    const input = document.getElementById("singleCommentInput");
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
    renderSinglePost();
}

function renderSinglePost() {
    const postId = Number(new URLSearchParams(window.location.search).get("id"));
    const post = getPosts().find(item => item.id === postId);
    const container = document.getElementById("singlePost");

    if (!post) {
        container.innerHTML = '<p class="empty-text">Post not found.</p>';
        return;
    }

    const commentsHtml = post.comments.length > 0
        ? post.comments.map(comment => `
            <div class="comment-item">
                <div class="comment-user">${escapeHtml(comment.user)}</div>
                <div>${escapeHtml(comment.text)}</div>
            </div>
        `).join("")
        : '<p class="empty-text">No comments yet.</p>';

    const alreadyLiked = (post.likedBy || []).includes(currentUser.id);
    const likeLabel = alreadyLiked ? `Liked (${post.likes})` : `Like (${post.likes})`;

    container.innerHTML = `
        <article class="post">
            <div class="post-header">
                <div class="post-user">${escapeHtml(post.user)}</div>
                <div class="post-time">${formatDate(post.createdAt)}</div>
            </div>

            <div class="post-content">${escapeHtml(post.content)}</div>

            <div class="post-actions">
                <button class="like-btn" onclick="likeSinglePost(${post.id})">${likeLabel}</button>
            </div>

            <div class="comment-section">
                <div class="comment-form">
                    <input type="text" id="singleCommentInput" placeholder="Write a comment...">
                    <button class="comment-btn" onclick="addSingleComment(${post.id})">Comment</button>
                </div>
                <div class="comment-list">${commentsHtml}</div>
            </div>
        </article>
    `;
}

renderSinglePost();