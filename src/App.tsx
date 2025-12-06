// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminHomePage from "./pages/AdminHomePage";
import AdminRoute from "./router/AdminRoute";
import AdminComplaintDetailPage from "./pages/AdminComplaintDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/complaints/:id"
          element={<AdminComplaintDetailPage />}
        />

        {/* 관리자 전용 페이지 */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminHomePage />
            </AdminRoute>
          }
        />

        {/* 기본 경로는 /login 으로 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
