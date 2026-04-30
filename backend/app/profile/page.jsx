"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function ProfilePage() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
    const [a, b, c] = await Promise.all([
      fetch(`/api/profile?userId=${userId}`),
      fetch(`/api/follow?userId=${userId}`),
      fetch(`/api/posts?userId=${userId}&mode=my-posts`),
    ]);
    const p = (await a.json()).profile;
    const f = await b.json();
    const mp = (await c.json()).posts || [];
    setProfile(p);
    setUsername(p?.username || "");
    setEmail(p?.email || "");
    setUsers(f.users || []);
    setFollowingIds(f.followingIds || []);
    setMyPosts(mp);
  }
  async function saveProfile(e) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id, username, email }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || "Update failed");
      return;
    }
    localStorage.setItem("currentUser", JSON.stringify(data.user));
    setCurrentUser(data.user);
    setMessage("Profile updated successfully.");
    loadData(data.user.id);
  }
  async function toggleFollow(targetId, isFollowing) {
    await fetch("/api/follow", {
      method: isFollowing ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        followerId: currentUser.id,
        followingId: targetId,
      }),
    });
    loadData(currentUser.id);
  }
  return (
    <>
      <header className="topbar">
        <div className="brand">SocialHub</div>
        <nav className="nav">
          <Link href="/feed">Feed</Link>
          <Link
            href="/profile"
            className={pathname === "/profile" ? "active" : ""}
          >
            Profile
          </Link>
          <Link href="/stats">Stats</Link>
          <button className="btn danger" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>
      <main className="page grid">
        <section>
          <section className="card">
            <h2 className="section-title">User Profile</h2>
            {profile && (
              <>
                <p>
                  <strong>Username:</strong> {profile.username}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Total Posts:</strong> {profile.postsCount}
                </p>
                <p>
                  <strong>Followers:</strong> {profile.followersCount}
                </p>
                <p>
                  <strong>Following:</strong> {profile.followingCount}
                </p>
              </>
            )}
          </section>
          <section className="card">
            <h2 className="section-title">Edit Profile</h2>
            <form className="form" onSubmit={saveProfile}>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              {message && (
                <p
                  className={message.includes("successfully") ? "ok" : "error"}
                >
                  {message}
                </p>
              )}
              <button className="btn primary" type="submit">
                Save Changes
              </button>
            </form>
          </section>
          <section className="card">
            <h2 className="section-title">My Posts</h2>
            {myPosts.length === 0 ? (
              <p className="empty">You have not created any posts yet.</p>
            ) : (
              myPosts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="post-user">{post.user.username}</div>
                    <div className="post-time">
                      {new Date(post.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="post-content">{post.content}</div>
                </div>
              ))
            )}
          </section>
        </section>
        <aside className="sidebar">
          <h3>Other Users</h3>
          <p className="small">Follow users to see their posts in your feed.</p>
          {users.length === 0 ? (
            <p className="empty">No other users found.</p>
          ) : (
            users.map((user) => {
              const isFollowing = followingIds.includes(user.id);
              return (
                <div key={user.id} className="item">
                  <div className="user-row">
                    <div>
                      <strong>{user.username}</strong>
                      <br />
                      <span className="small">{user.email}</span>
                    </div>
                    <button
                      className={`btn ${isFollowing ? "warning" : "primary"}`}
                      onClick={() => toggleFollow(user.id, isFollowing)}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </aside>
      </main>
    </>
  );
}
