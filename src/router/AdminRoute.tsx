// src/routes/AdminRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("adminToken");

  if (!token) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
