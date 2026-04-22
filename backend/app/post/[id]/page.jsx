"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (!saved) {
      router.push("/");
      return;
    }
    setCurrentUser(JSON.parse(saved));
    loadPost();
  }, [router, params.id]);
  function logout() {
    localStorage.removeItem("currentUser");
    router.push("/");
  }
  async function loadPost() {
    const res = await fetch(`/api/posts?postId=${params.id}`);
    setPost((await res.json()).post || null);
  }
  async function likePost() {
    await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: Number(params.id),
        userId: currentUser.id,
        action: "like",
      }),
    });
    loadPost();
  }
  async function addComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: Number(params.id),
        userId: currentUser.id,
        text: comment,
      }),
    });
    setComment("");
    loadPost();
  }
  return (
    <>
      <header className="topbar">
        <div className="brand">SocialHub</div>
        <nav className="nav">
          <Link href="/feed">Feed</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/stats">Stats</Link>
          <button className="btn danger" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>
      <main className="page">
        <div className="card">
          <Link className="back" href="/feed">
            ← Back to Feed
          </Link>
          <h2 className="section-title">Post Details</h2>
        </div>
        {!post ? (
          <div className="card">
            <p className="empty">Post not found.</p>
          </div>
        ) : (
          <article className="post-card">
            <div className="post-header">
              <div className="post-user">{post.user.username}</div>
              <div className="post-time">
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="post-content">{post.content}</div>
            <div className="actions">
              <button className="btn soft" onClick={likePost}>
                Like ({post.likes.length})
              </button>
            </div>
            <div className="comment-section">
              <form className="comment-form" onSubmit={addComment}>
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                />
                <button className="btn success" type="submit">
                  Comment
                </button>
              </form>
              <div className="comment-list">
                {post.comments.length === 0 ? (
                  <p className="empty">No comments yet.</p>
                ) : (
                  post.comments.map((item) => (
                    <div key={item.id} className="comment-item">
                      <div className="comment-user">{item.user.username}</div>
                      <div>{item.text}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </article>
        )}
      </main>
    </>
  );
}
