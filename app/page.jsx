"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const u = localStorage.getItem("currentUser");
    if (u) router.push("/feed");
  }, [router]);
  async function login(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }
    localStorage.setItem("currentUser", JSON.stringify(data.user));
    router.push("/feed");
  }
  return (
    <main className="auth-wrapper">
      <div className="auth-card">
        <h1 className="title">SocialHub</h1>
        <p className="subtitle">Login to your account</p>
        <form className="form" onSubmit={login}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button className="btn primary" type="submit">
            Login
          </button>
        </form>
        <p className="link-text">
          Don't have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </main>
  );
}
