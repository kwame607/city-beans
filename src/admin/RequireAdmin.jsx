// src/admin/RequireAdmin.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAdmin({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#1B160D" }}
      >
        <div
          className="h-10 w-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "#E8973B", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!session) {
    // remembers where they were trying to go, so login can send them back
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
