import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";

interface AdminMe {
  id: number;
  username: string;
  role: string;
}

interface DashboardSummary {
  total_complaints: number;
  today_complaints: number;
  unresolved_complaints: number;
  resolved_complaints: number;
}

interface ComplaintListItem {
  id: number;
  title: string;
  category: string;
  location: string;
  created_at: string;
  status: string;
  phone_number: string;
  risk_level: string;
}

interface ComplaintListResponse {
  items: ComplaintListItem[];
  total: number;
  page: number;
  page_size: number;
}

const statusLabel = (status?: string) => {
  switch (status) {
    case "new":
      return "처리 전";
    case "in_progress":
      return "처리 중";
    case "resolved":
      return "처리 완료";
    case "read":
      return "읽음";
    default:
      return "새민원";
  }
};

export default function AdminHomePage() {
  const [me, setMe] = useState<AdminMe | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<ComplaintListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // 📌 페이지네이션 목록
  useEffect(() => {
    apiClient
      .get<ComplaintListResponse>("/complaints", {
        params: { page, page_size: pageSize },
      })
      .then((res) => {
        setComplaints(res.data.items);
        setTotal(res.data.total);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  // 📌 대시보드 요약 + me + 최근 민원
  useEffect(() => {
    apiClient
      .get<AdminMe>("/admin/me")
      .then((res) => {
        setMe(res.data);
      })
      .catch(() => {
        setError("인증이 만료되었거나 토큰이 없습니다. 다시 로그인 해주세요.");
      });

    apiClient
      .get<DashboardSummary>("/admin/dashboard/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        padding: 24,
        width: "100vw",
        backgroundColor: "#f3f4f6",
        boxSizing: "border-box",
      }}
    >
      <div>
        <AdminHeader />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            marginTop: -10,
          }}
        >
          {me && (
            <h2 style={{ color: "#6b7280", fontSize: 20 }}>
              안녕하세요, <b>{me.username}</b> ({me.role}) 님
            </h2>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#ef4444",
              color: "white",
              fontWeight: 900,
              cursor: "pointer",
              height: "40px",
            }}
          >
            로그아웃
          </button>
        </div>
      </div>

      {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

      {/* 요약 카드들 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <SummaryCard
          label="전체 민원 수"
          value={summary?.total_complaints ?? 0}
          bgColor="#FFFED5"
        />
        <SummaryCard
          label="오늘 접수된 민원"
          value={summary?.today_complaints ?? 0}
          bgColor="#D5F1FF"
        />
        <SummaryCard
          label="미처리 민원"
          value={summary?.unresolved_complaints ?? 0}
          bgColor="#FFD5D5"
        />
        <SummaryCard
          label="처리 민원"
          value={summary?.resolved_complaints ?? 0}
          bgColor="#E1FFD5"
        />
      </div>

      {/* 📌 민원 목록 테이블 + 페이지네이션 */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          height: "560px",
          overflow: "auto",
          position: "relative",
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 12,
            marginTop: 5,
          }}
        >
          민원 목록
        </h2>

        {complaints.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            등록된 민원이 없습니다.
          </p>
        ) : (
          <>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 17,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>제목</th>
                  <th style={thStyle}>카테고리</th>
                  <th style={thStyle}>위치</th>
                  <th style={thStyle}>접수 시간</th>
                  <th style={thStyle}>전화번호</th>
                  <th style={thStyle}>위험강도</th>
                  <th style={thStyle}>상태</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      cursor: "pointer",
                    }}
                    onClick={async () => {
                      try {
                        await apiClient.post(`/complaints/${c.id}/read`);
                      } catch (e) {
                        console.error(e);
                        // 읽음 처리 실패해도 일단 상세로는 가게 둘 수 있음
                      }
                      navigate(`/admin/complaints/${c.id}`);
                    }}
                  >
                    <td style={tdStyle}>{c.id}</td>
                    <td style={tdStyle}>{c.title}</td>
                    <td style={tdStyle}>{c.category}</td>
                    <td style={tdStyle}>{c.location}</td>
                    <td style={tdStyle}>
                      {new Date(c.created_at).toLocaleString("ko-KR")}
                    </td>
                    <td style={tdStyle}>{c.phone_number}</td>
                    <td style={tdStyle}>{c.risk_level}</td>
                    <td style={tdStyle}>{statusLabel(c.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 영역 */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                margin: 16,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid #d1d5db",
                    backgroundColor: page === 1 ? "#f9fafb" : "white",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  이전
                </button>
                <span style={{ fontSize: 13, color: "#6b7280", margin: 10 }}>
                  총 {total}건 / 페이지 {page} / {totalPages || 1}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages || 1, p + 1))
                  }
                  disabled={page === totalPages || totalPages === 0}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid #d1d5db",
                    backgroundColor:
                      page === totalPages || totalPages === 0
                        ? "#f9fafb"
                        : "white",
                    cursor:
                      page === totalPages || totalPages === 0
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  다음
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 테이블 스타일
const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 4px",
  color: "#6b7280",
  fontWeight: 500,
};

const tdStyle: React.CSSProperties = {
  padding: "8px 4px",
  color: "#111827",
};

interface SummaryCardProps {
  label: string;
  value: number;
  bgColor?: string;
}

function SummaryCard({ label, value, bgColor = "white" }: SummaryCardProps) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        height: "70px",
        display: "block",
      }}
    >
      <p
        style={{
          fontSize: 20,
          marginBottom: 0,
          marginTop: 0,
          fontWeight: 600,
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>{value}</p>
    </div>
  );
}
