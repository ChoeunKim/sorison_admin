// src/pages/AdminComplaintDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";
import AdminHeader from "../components/AdminHeader";

interface Complaint {
  id: number;
  title: string | null;
  category: string | null;
  summary?: string | null;
  phone_number?: string | null;
  location?: string | null;
  status?: string;
  created_at: string;
  risk_level: string;
}

interface ComplaintMessageItem {
  id: number;
  role: "user" | "bot" | "admin";
  content?: string | null;
  created_at: string;
}

interface ComplaintDetailResponse {
  complaint: Complaint;
  messages: ComplaintMessageItem[];
}

const statusLabel = (status?: string) => {
  switch (status) {
    case "new":
      return "처리 전";
    case "in_progress":
      return "처리 중";
    case "resolved":
      return "처리 완료";
    default:
      return "상태 미지정";
  }
};

export default function AdminComplaintDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<ComplaintDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    apiClient
      .get<ComplaintDetailResponse>(`/complaints/detail/${id}`)
      .then((res) => {
        setDetail(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("민원 정보를 불러오는 중 오류가 발생했어요.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendReply = async () => {
    if (!id) return;
    if (!replyText.trim()) return;

    try {
      await apiClient.post(`/complaints/${id}/reply`, {
        content: replyText.trim(),
      });
      setReplyText("");

      // 답변 후 메시지 목록 다시 불러오기
      const res = await apiClient.get<ComplaintDetailResponse>(
        `/complaints/detail/${id}`
      );
      setDetail(res.data);
    } catch (e) {
      console.error(e);
      alert("답변 저장 중 오류가 발생했어요.");
    }
  };

  // 🔹 상태 변경 함수: 컴포넌트 안으로 옮기기
  const handleChangeStatus = async (
    nextStatus: "new" | "in_progress" | "resolved"
  ) => {
    if (!id) return;

    try {
      await apiClient.post(`/complaints/${id}/status`, {
        status: nextStatus,
      });

      // 상태 변경 후 상세 정보 다시 불러오기
      const res = await apiClient.get<ComplaintDetailResponse>(
        `/complaints/detail/${id}`
      );
      setDetail(res.data);
    } catch (e) {
      console.error(e);
      alert("상태 변경 중 오류가 발생했어요.");
    }
  };

  if (loading) {
    return <div style={{ padding: 24 }}>불러오는 중입니다...</div>;
  }

  if (error || !detail) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "red" }}>
          {error ?? "민원 정보를 찾을 수 없습니다."}
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: 16,
            padding: "8px 16px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            background: "white",
            cursor: "pointer",
          }}
        >
          뒤로가기
        </button>
      </div>
    );
  }

  const { complaint, messages } = detail;

  return (
    <div
      style={{
        padding: 24,
        width: "100vw",
        boxSizing: "border-box",
        backgroundColor: "#f3f4f6",
      }}
    >
      <AdminHeader />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          marginTop: -10,
        }}
      >
        <div>
          <h1 style={{ fontSize: 25, fontWeight: 700, marginBottom: 4 }}>
            민원 상세 #{complaint.id}
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: 14,
              marginBottom: 8,
            }}
          >
            {complaint.category ?? "분류 미지정"} ·{" "}
            {statusLabel(complaint.status)}
          </p>

          {/* 🔹 상태 변경 버튼들 */}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button
              onClick={() => handleChangeStatus("in_progress")}
              style={{
                padding: "4px 10px",
                fontSize: 15,
                borderRadius: 999,
                border: "1px solid #3b82f6",
                background:
                  complaint.status === "in_progress" ? "#dbeafe" : "white",
                color: "#1d4ed8",
                cursor: "pointer",
              }}
            >
              처리 중
            </button>
            <button
              onClick={() => handleChangeStatus("resolved")}
              style={{
                padding: "4px 10px",
                fontSize: 15,
                borderRadius: 999,
                border: "1px solid #10b981",
                background:
                  complaint.status === "resolved" ? "#d1fae5" : "white",
                color: "#047857",
                cursor: "pointer",
              }}
            >
              처리 완료
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin")}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          목록으로
        </button>
      </div>

      {/* 민원 기본 정보 카드 */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          marginBottom: 16,
        }}
      >
        <p
          style={{
            fontSize: 23,
            fontWeight: 600,
            marginBottom: 8,
            marginTop: 10,
          }}
        >
          기본 정보
        </p>
        <div style={{ fontSize: 20 }}>
          <p>
            <b>제목:</b> {complaint.title ?? "-"}
          </p>
          <p>
            <b>요약:</b> {complaint.summary ?? "-"}
          </p>
          <p>
            <b>연락처:</b> {complaint.phone_number ?? "-"}
          </p>
          <p>
            <b>위치:</b> {complaint.location ?? "-"}
          </p>
          <p>
            <b>위험 강도:</b> {complaint.risk_level ?? "-"}
          </p>
          <p>
            <b>접수 시간:</b>{" "}
            {new Date(complaint.created_at).toLocaleString("ko-KR")}
          </p>
        </div>
      </div>

      {/* 메시지 로그 + 답변 입력 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
      >
        {/* 메시지 로그 */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            maxHeight: "70vh",
            overflow: "auto",
          }}
        >
          <p
            style={{
              fontSize: 23,
              fontWeight: 600,
              marginBottom: 8,
              marginTop: 10,
            }}
          >
            대화 로그
          </p>
          {messages.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              아직 대화 로그가 없습니다.
            </p>
          ) : (
            messages.map((m) => {
              const isUser = m.role === "user";
              const isBot = m.role === "bot";
              const isAdmin = m.role === "admin";

              const text =
                (isUser && m.content) ||
                (isBot && m.content) ||
                (isAdmin && m.content) ||
                "(내용 없음)";

              const label = isUser ? "시민" : isBot ? "봇" : "관리자";

              return (
                <div
                  key={m.id}
                  style={{
                    marginBottom: 12,
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: isUser
                      ? "#eff6ff"
                      : isAdmin
                      ? "#fef3c7"
                      : "#f3f4f6",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      marginBottom: 4,
                    }}
                  >
                    {label} · {new Date(m.created_at).toLocaleString("ko-KR")}
                  </div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
                </div>
              );
            })
          )}
        </div>

        {/* 관리자 답변 입력 */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontSize: 23,
              fontWeight: 600,
              marginBottom: 8,
              marginTop: 10,
            }}
          >
            답변 작성
          </p>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="시민에게 안내할 내용을 입력해 주세요."
            style={{
              flex: 1,
              resize: "none",
              minHeight: 200,
              padding: 8,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 14,
            }}
          />
          <button
            onClick={handleSendReply}
            style={{
              marginTop: 12,
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "#4f46e5",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            답변 저장 (추후 문자 발송 연동)
          </button>
        </div>
      </div>
    </div>
  );
}
