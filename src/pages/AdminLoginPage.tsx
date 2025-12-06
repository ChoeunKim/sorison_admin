import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await apiClient.post("/admin/login", {
        username,
        password,
      });
      localStorage.setItem("adminToken", res.data.access_token);
      navigate("/admin"); // 로그인 성공하면 관리자 페이지로 이동
    } catch {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
      }}
    >
      <div
        style={{
          width: 360,
          padding: 28,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
        }}
      >
        <img
          src="src/assets/sorison.png"
          style={{ width: 150, display: "block", margin: "0 auto" }}
        />
        <p
          style={{
            fontSize: 15,
            color: "#6b7280",
            marginBottom: 30,
            textAlign: "center",
          }}
        >
          민원 관리자 로그인
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 13,
              color: "#374151",
              gap: 6,
            }}
          >
            아이디
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              style={{
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                padding: "9px 11px",
                fontSize: 14,
              }}
            />
          </label>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 13,
              color: "#374151",
              gap: 6,
            }}
          >
            비밀번호
            <input
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              style={{
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                padding: "9px 11px",
                fontSize: 14,
              }}
            />
          </label>

          {error && <p style={{ fontSize: 12, color: "#dc2626" }}>{error}</p>}

          <button
            type="submit"
            style={{
              marginTop: 8,
              border: "none",
              borderRadius: 10,
              padding: "10px 0",
              background: "#2563eb",
              color: "#fff",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            관리자 로그인
          </button>
        </form>
      </div>
    </div>
  );
}
