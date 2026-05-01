"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  async function register(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Register failed");
      return;
    }
    setShowModal(true);
  }
  return (
    <main className="auth-wrapper">
      <div className="auth-card">
        <h1 className="title">SocialHub</h1>
        <p className="subtitle">Create a new account</p>
        <form className="form" onSubmit={register}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
            minLength="6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button className="btn primary" type="submit">
            Register
          </button>
        </form>
        <p className="link-text">
          Already have an account? <Link href="/">Login</Link>
        </p>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Registration Successful</h2>
            <p>Your account has been created successfully.</p>
            <button className="btn primary" onClick={() => router.push("/")}>
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
