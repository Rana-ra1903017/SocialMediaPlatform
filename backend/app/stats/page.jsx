"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function StatsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (!saved) {
      router.push("/");
      return;
    }
    loadStats();
  }, [router]);
  function logout() {
    localStorage.removeItem("currentUser");
    router.push("/");
  }
  async function loadStats() {
    const res = await fetch("/api/stats");
    setStats((await res.json()).stats);
  }
  return (
    <>
      <header className="topbar">
        <div className="brand">SocialHub</div>
        <nav className="nav">
          <Link href="/feed">Feed</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/stats" className={pathname === "/stats" ? "active" : ""}>
            Stats
          </Link>
          <button className="btn danger" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>
      <main className="page">
        {!stats ? (
          <div className="card">
            <p className="empty">Loading statistics...</p>
          </div>
        ) : (
          <>
            <h2 className="section-title">Statistics</h2>
            <div className="stats">
              <div className="stat-box">
                <h3>Total Users</h3>
                <div className="value">{stats.totalUsers}</div>
              </div>
              <div className="stat-box">
                <h3>Total Posts</h3>
                <div className="value">{stats.totalPosts}</div>
              </div>
              <div className="stat-box">
                <h3>Total Comments</h3>
                <div className="value">{stats.totalComments}</div>
              </div>
              <div className="stat-box">
                <h3>Total Likes</h3>
                <div className="value">{stats.totalLikes}</div>
              </div>
              <div className="stat-box">
                <h3>Average Followers Per User</h3>
                <div className="value">{stats.averageFollowersPerUser}</div>
              </div>
              <div className="stat-box">
                <h3>Average Posts Per User</h3>
                <div className="value">{stats.averagePostsPerUser}</div>
              </div>
              <div className="stat-box">
                <h3>Most Active User</h3>
                <div className="value">{stats.mostActiveUser}</div>
              </div>
              <div className="stat-box">
                <h3>Most Followed User</h3>
                <div className="value">{stats.mostFollowedUser}</div>
              </div>
              <div className="stat-box">
                <h3>Top Commenter</h3>
                <div className="value">{stats.topCommenter}</div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
