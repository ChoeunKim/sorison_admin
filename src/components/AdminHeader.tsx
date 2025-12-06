// src/components/AdminHeader.tsx
import React from "react";

export default function AdminHeader() {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img src="/src/assets/sorison2.png" style={{ width: 150 }} />
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
          관리자 대시보드
        </h1>
      </div>
    </div>
  );
}
