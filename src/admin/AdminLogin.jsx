// src/admin/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminLogin() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await signIn(email, password);

    setSubmitting(false);

    if (error) {
      setError("Incorrect email or password.");
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#1B160D" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl p-8"
        style={{ background: "#F7F1E3" }}
      >
        <div className="text-center mb-7">
          <div
            className="text-xl font-black"
            style={{ fontFamily: "Georgia, serif", color: "#19150F" }}
          >
            City Beans Admin
          </div>
          <p className="text-sm text-black/50 mt-1">
            Sign in to manage the store
          </p>
        </div>

        <label className="block mb-4">
          <span className="text-xs font-bold text-black/55">Email</span>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl bg-white border border-black/10 px-4 py-3 outline-none focus:ring-2 focus:ring-[#557A3B]/25"
          />
        </label>

        <label className="block mb-6">
          <span className="text-xs font-bold text-black/55">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl bg-white border border-black/10 px-4 py-3 outline-none focus:ring-2 focus:ring-[#557A3B]/25"
          />
        </label>

        {error && (
          <p className="text-sm mb-4" style={{ color: "#C24A3D" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full py-3.5 font-bold text-white transition disabled:opacity-50"
          style={{ background: "#557A3B" }}
        >
          {submitting ? "Signing in…" : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}
