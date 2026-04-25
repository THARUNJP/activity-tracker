"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { Clock } from "lucide-react";

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
    <div className="w-full max-w-md mx-auto">
      {/* Logo */}
      <div className="text-center mb-12">
        {/* <div className="logo-box"><Clock/></div> */}
        <h1 className="text-2xl font-extrabold tracking-tight pt-4 mb-2">
          Activity Tracker
        </h1>
        <p className="text-muted text-sm">Track your time. Own your day.</p>
      </div>

      {/* Card */}
      <div className="glass-card p-8">
        {/* Tabs */}
        <div className="tab-container">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError("");
                setMessage("");
              }}
              className={`tab-button ${mode === m ? "tab-active" : ""}`}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          {/* Password */}
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          {/* Error */}
          {error && <div className="alert-error">{error}</div>}

          {/* Success */}
          {message && <div className="alert-success">{message}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-70"
          >
            {loading
              ? "Loading..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>
      </div>

      <p className="text-center mt-6 text-xs text-muted">
        Your data is private and secure.
      </p>
    </div>
  );
}
