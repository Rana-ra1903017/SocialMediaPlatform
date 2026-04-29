"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function FeedPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [content, setContent] = useState("");
  const [commentText, setCommentText] = useState({});
  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (!saved) {
      router.push("/");
      return;
    }
    const user = JSON.parse(saved);
    setCurrentUser(user);
    loadData(user.id);
  }, [router]);
  function logout() {
    localStorage.removeItem("currentUser");
    router.push("/");
  }
  async function loadData(userId) {
    const [a, b] = await Promise.all([
      fetch(`/api/posts?userId=${userId}`),
      fetch(`/api/profile?userId=${userId}`),
    ]);
    setPosts((await a.json()).posts || []);
    setProfile((await b.json()).profile || null);
  }
  async function createPost(e) {
    e.preventDefault();
    if (!content.trim()) return;
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, userId: currentUser.id }),
    });
    setContent("");
    loadData(currentUser.id);
  }
  async function likePost(postId) {
    await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, userId: currentUser.id, action: "like" }),
    });
    loadData(currentUser.id);
  }
  async function deletePost(postId) {
    if (!confirm("Delete this post?")) return;
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    loadData(currentUser.id);
  }
  async function addComment(e, postId) {
    e.preventDefault();
    const text = commentText[postId] || "";
    if (!text.trim()) return;
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, userId: currentUser.id, text }),
    });
    setCommentText({ ...commentText, [postId]: "" });
    loadData(currentUser.id);
  }
  return (
    <>
      <header className="topbar">
        <div className="brand">SocialHub</div>
        <nav className="nav">
          <Link href="/feed" className={pathname === "/feed" ? "active" : ""}>
            Feed
          </Link>
          <Link href="/profile">Profile</Link>
          <Link href="/stats">Stats</Link>
          <button className="btn danger" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>
      <main className="page grid">
        <section>
          <section className="card">
            <h2 className="section-title">Create Post</h2>
            <form className="form" onSubmit={createPost}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
              />
              <button className="btn primary" type="submit">
                Post
              </button>
            </form>
          </section>
          <section>
            <h2 className="section-title">Latest Posts</h2>
            {posts.length === 0 ? (
              <div className="card">
                <p className="empty">No posts in your feed yet.</p>
              </div>
            ) : (
              posts.map((post) => {
                const liked = post.likes.some(
                  (x) => x.userId === currentUser?.id,
                );
                const isOwner = post.userId === currentUser?.id;
                return (
                  <article key={post.id} className="post-card">
                    <div className="post-header">
                      <div className="post-user">{post.user.username}</div>
                      <div className="post-time">
                        {new Date(post.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="post-content">{post.content}</div>
                    <div className="actions">
                      <button
                        className="btn soft"
                        onClick={() => likePost(post.id)}
                      >
                        {liked ? "Liked" : "Like"} ({post.likes.length})
                      </button>
                      <Link className="btn primary" href={`/post/${post.id}`}>
                        View Details
                      </Link>
                      {isOwner && (
                        <button
                          className="btn danger"
                          onClick={() => deletePost(post.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <div className="comment-section">
                      <form
                        className="comment-form"
                        onSubmit={(e) => addComment(e, post.id)}
                      >
                        <input
                          placeholder="Write a comment..."
                          value={commentText[post.id] || ""}
                          onChange={(e) =>
                            setCommentText({
                              ...commentText,
                              [post.id]: e.target.value,
                            })
                          }
                        />
                        <button className="btn success" type="submit">
                          Comment
                        </button>
                      </form>
                      <div className="comment-list">
                        {post.comments.length === 0 ? (
                          <p className="empty">No comments yet.</p>
                        ) : (
                          post.comments.map((comment) => (
                            <div key={comment.id} className="comment-item">
                              <div className="comment-user">
                                {comment.user.username}
                              </div>
                              <div>{comment.text}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </section>
        <aside className="sidebar">
          <h3>Your Feed</h3>
          <p className="small">
            You can see your posts and posts from users you follow.
          </p>
          {profile && (
            <>
              <div className="item">
                <strong>Username:</strong> {profile.username}
              </div>
              <div className="item">
                <strong>Email:</strong> {profile.email}
              </div>
              <div className="item">
                <strong>My Posts:</strong> {profile.postsCount}
              </div>
              <div className="item">
                <strong>Followers:</strong> {profile.followersCount}
              </div>
              <div className="item">
                <strong>Following:</strong> {profile.followingCount}
              </div>
            </>
          )}
        </aside>
      </main>
    </>
  );
}
