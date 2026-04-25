"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Account created! You can now log in.");
        setMode("login");
      }
    }
    setLoading(false);
  }

  return (
    <div style={{ width: "100%", maxWidth: "420px" }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "var(--accent-dim)",
            border: "1px solid var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            margin: "0 auto 20px",
          }}
        >
          ⏱
        </div>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: "800",
            marginBottom: "8px",
            letterSpacing: "-0.02em",
          }}
        >
          Activity Tracker
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Track your time. Own your day.
        </p>
      </div>

      {/* Card */}
      <div className="glass-card" style={{ padding: "32px" }}>
        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            background: "var(--bg-elevated)",
            borderRadius: "10px",
            padding: "4px",
            marginBottom: "28px",
          }}
        >
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError("");
                setMessage("");
              }}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                background: mode === m ? "var(--accent)" : "transparent",
                color: mode === m ? "white" : "var(--text-secondary)",
                fontFamily: "Syne, sans-serif",
                fontWeight: "600",
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "var(--text-secondary)",
                marginBottom: "8px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "var(--text-secondary)",
                marginBottom: "8px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              className="input-field"
            />
          </div>

          {error && (
            <div
              style={{
                background: "var(--red-dim)",
                border: "1px solid var(--red)",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "16px",
                fontSize: "0.85rem",
                color: "var(--red)",
              }}
            >
              {error}
            </div>
          )}
          {message && (
            <div
              style={{
                background: "var(--green-dim)",
                border: "1px solid var(--green)",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "16px",
                fontSize: "0.85rem",
                color: "var(--green)",
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", opacity: loading ? 0.7 : 1 }}
          >
            {loading
              ? "Loading..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>
      </div>

      <p
        style={{
          textAlign: "center",
          marginTop: "24px",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
        }}
      >
        Your data is private and secure.
      </p>
    </div>
  );
}
