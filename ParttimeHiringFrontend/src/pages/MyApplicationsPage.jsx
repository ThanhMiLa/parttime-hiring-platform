import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Phone,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";
import { getMyApplicationsService } from "../services/jobApplicationService";

function getStatusBadge(status) {
  switch (status) {
    case "ACCEPTED":
      return {
        bg: "#dcfce7",
        color: "#15803d",
        text: "Đã chấp nhận",
      };
    case "REJECTED":
      return {
        bg: "#fee2e2",
        color: "#b91c1c",
        text: "Đã từ chối",
      };
    case "PENDING":
    default:
      return {
        bg: "#fef3c7",
        color: "#b45309",
        text: "Đang chờ duyệt",
      };
  }
}

function formatDate(dateValue) {
  if (!dateValue) return "Chưa có";
  try {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleString("vi-VN");
  } catch {
    return dateValue;
  }
}

function StatusIcon({ status }) {
  if (status === "ACCEPTED") return <CheckCircle2 size={18} color="#15803d" />;
  if (status === "REJECTED") return <XCircle size={18} color="#b91c1c" />;
  return <Hourglass size={18} color="#b45309" />;
}

function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchMyApplications() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await getMyApplicationsService();
        setApplications(response?.result || []);
      } catch (error) {
        const message =
          error?.response?.data?.message || "Không tải được danh sách ứng tuyển";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    }

    fetchMyApplications();
  }, []);

  return (
    <div className="container page-section">
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div className="card" style={{ borderRadius: 22 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Công việc đã ứng tuyển
          </h1>
          <p
            style={{
              margin: "10px 0 0 0",
              color: "#64748b",
              fontSize: 15,
            }}
          >
            Theo dõi toàn bộ công việc bạn đã gửi đơn ứng tuyển.
          </p>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Đang tải danh sách ứng tuyển...</p>
          </div>
        ) : errorMessage ? (
          <div className="empty-state">
            <p className="error-text">{errorMessage}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <h3>Bạn chưa ứng tuyển công việc nào</h3>
            <p className="muted-text">Hãy quay lại trang jobs để tìm việc phù hợp.</p>
            <Link to="/jobs" className="btn btn-primary" style={{ marginTop: 14 }}>
              Đi đến trang việc làm
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 18,
            }}
          >
            {applications.map((item) => {
              const statusBadge = getStatusBadge(item.status);

              return (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    borderRadius: 20,
                    padding: 22,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 24,
                          fontWeight: 800,
                          color: "#0f172a",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.jobTitle}
                      </h3>
                      <p
                        style={{
                          margin: "8px 0 0 0",
                          color: "#64748b",
                          fontWeight: 600,
                        }}
                      >
                        {item.companyName}
                      </p>
                    </div>

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 12px",
                        borderRadius: 999,
                        background: statusBadge.bg,
                        color: statusBadge.color,
                        fontSize: 12,
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <StatusIcon status={item.status} />
                      {statusBadge.text}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      color: "#475569",
                      fontSize: 14,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <Phone size={17} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>SĐT liên hệ: {item.contactPhone || "Chưa có"}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <FileText size={17} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>Ghi chú: {item.note || "Không có"}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <Clock size={17} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>Ngày ứng tuyển: {formatDate(item.appliedAt)}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      paddingTop: 14,
                      borderTop: "1px solid #e2e8f0",
                      marginTop: "auto",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        color: "#64748b",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      <Briefcase size={16} />
                      Mã đơn: #{item.id}
                    </div>

                    <Link to={`/jobs/${item.jobPostId}`} className="btn btn-primary">
                      Xem công việc
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyApplicationsPage;