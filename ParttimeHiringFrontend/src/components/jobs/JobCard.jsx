import { Link } from "react-router-dom";
import {
  Coffee,
  Clock3,
  MapPin,
  Users,
  Heart,
  History,
  ChevronRight,
  Wallet,
} from "lucide-react";

function formatSalary(min, max, currency) {
  if (min == null && max == null) return "Thỏa thuận";
  return `${Number(min || 0).toLocaleString("vi-VN")}đ - ${Number(
    max || 0
  ).toLocaleString("vi-VN")}đ/${currency === "VND" ? "giờ" : currency || "giờ"}`;
}

function renderShifts(shifts = []) {
  if (!Array.isArray(shifts) || shifts.length === 0) return ["Chưa có ca làm"];

  return shifts.map((shift) => {
    if (
      shift?.isFlexible ||
      shift?.shiftName?.toLowerCase().includes("linh hoat") ||
      shift?.shiftName?.toLowerCase().includes("linh hoạt")
    ) {
      return `${shift.shiftName || "Ca linh hoạt"} (linh hoạt)`;
    }

    if (shift?.startTime || shift?.endTime) {
      return `${shift.startTime || "--:--"} - ${shift.endTime || "--:--"}`;
    }

    return shift?.shiftName || "Ca làm việc";
  });
}

function formatPostedDate(dateValue) {
  if (!dateValue) return "Vừa đăng";
  try {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "Vừa đăng";
    return date.toLocaleDateString("vi-VN");
  } catch {
    return "Vừa đăng";
  }
}

function getStatusBadge(status) {
  if (status === "ACTIVE") {
    return <span className="job-card-status job-card-status-active">Đang tuyển</span>;
  }

  if (status === "EXPIRED" || status === "CLOSED" || status === "INACTIVE") {
    return <span className="job-card-status job-card-status-muted">Tạm đóng</span>;
  }

  return (
    <span className="job-card-status job-card-status-neutral">
      {status || "Khác"}
    </span>
  );
}

function JobCard({ job }) {
  const shiftTexts = renderShifts(job?.shifts || []);
  const primaryShift = shiftTexts[0] || "Chưa có ca làm";
  const extraShiftCount = shiftTexts.length > 1 ? shiftTexts.length - 1 : 0;

  return (
    <>
      <article className="job-card-premium">
        <div className="job-card-premium-top">
          <div className="job-card-premium-brand">
            <div className="job-card-premium-logo">
              <Coffee size={20} />
            </div>

            <div className="job-card-premium-main">
              <div className="job-card-premium-topline">
                {getStatusBadge(job?.status)}

                <button
                  type="button"
                  className="job-card-premium-fav"
                  aria-label="Yêu thích công việc"
                >
                  <Heart size={16} />
                </button>
              </div>

              <Link to={`/jobs/${job?.id}`} className="job-card-premium-title-link">
                <h3 className="job-card-premium-title">
                  {job?.title || "Chưa có tiêu đề"}
                </h3>
              </Link>

              <p className="job-card-premium-company">
                {job?.storeName || "Cửa hàng"} •{" "}
                {job?.district || job?.city || "Chưa rõ khu vực"}
              </p>
            </div>
          </div>
        </div>

        <div className="job-card-premium-salary">
          <div className="job-card-premium-salary-icon">
            <Wallet size={15} />
          </div>
          <div>
            <p className="job-card-premium-salary-label">Mức lương</p>
            <p className="job-card-premium-salary-value">
              {formatSalary(job?.hourlyWageMin, job?.hourlyWageMax, job?.currency)}
            </p>
          </div>
        </div>

        <div className="job-card-premium-shift-box">
          <div className="job-card-premium-shift-head">
            <span className="job-card-premium-shift-label">Ca làm nổi bật</span>
            {extraShiftCount > 0 ? (
              <span className="job-card-premium-shift-count">
                +{extraShiftCount} ca khác
              </span>
            ) : null}
          </div>

          <div className="job-card-premium-shift-chip">
            <Clock3 size={14} />
            <span>{primaryShift}</span>
          </div>
        </div>

        <div className="job-card-premium-info-list">
          <div className="job-card-premium-info-item">
            <MapPin size={15} />
            <span>{job?.fullAddress || "Chưa có địa chỉ cụ thể"}</span>
          </div>

          <div className="job-card-premium-info-item">
            <Users size={15} />
            <span>
              Cần tuyển: <strong>{job?.vacancyCount || 0}</strong> người
            </span>
          </div>
        </div>

        <div className="job-card-premium-footer">
          <div className="job-card-premium-meta">
            <History size={14} />
            <span>{formatPostedDate(job?.publishedAt)}</span>
          </div>

          <Link to={`/jobs/${job?.id}`} className="job-card-premium-detail-btn">
            <span>Xem chi tiết</span>
            <ChevronRight size={15} />
          </Link>
        </div>
      </article>

      <style>{`
        .job-card-premium {
          background: rgba(255,255,255,0.97);
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          min-height: 100%;
          box-shadow: 0 12px 30px rgba(15,23,42,0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .job-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 42px rgba(15,23,42,0.09);
          border-color: #cbd5e1;
        }

        .job-card-premium-top {
          margin-bottom: 14px;
        }

        .job-card-premium-brand {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .job-card-premium-logo {
          width: 50px;
          height: 50px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%);
          color: #059669;
          border: 1px solid #d1fae5;
          flex-shrink: 0;
        }

        .job-card-premium-main {
          min-width: 0;
          flex: 1;
        }

        .job-card-premium-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .job-card-premium-title-link {
          text-decoration: none;
          color: inherit;
        }

        .job-card-premium-title {
          margin: 0;
          font-size: 20px;
          line-height: 1.35;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .job-card-premium-title-link:hover .job-card-premium-title {
          color: #059669;
        }

        .job-card-premium-company {
          margin: 8px 0 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
          font-weight: 600;
        }

        .job-card-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 28px;
          padding: 0 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .job-card-status-active {
          background: #dcfce7;
          color: #15803d;
        }

        .job-card-status-muted {
          background: #fff7ed;
          color: #c2410c;
        }

        .job-card-status-neutral {
          background: #f1f5f9;
          color: #64748b;
        }

        .job-card-premium-fav {
          width: 32px;
          height: 32px;
          border-radius: 11px;
          border: 1px solid #e2e8f0;
          background: #fff;
          display: grid;
          place-items: center;
          cursor: pointer;
          color: #94a3b8;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .job-card-premium-fav:hover {
          color: #ef4444;
          border-color: #fecaca;
          background: #fff5f5;
        }

        .job-card-premium-salary {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 18px;
          background: linear-gradient(135deg, #ecfdf5 0%, #f8fafc 100%);
          border: 1px solid #d1fae5;
          margin-bottom: 14px;
        }

        .job-card-premium-salary-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #ffffff;
          color: #059669;
          border: 1px solid #d1fae5;
          flex-shrink: 0;
        }

        .job-card-premium-salary-label {
          margin: 0;
          font-size: 11px;
          color: #64748b;
          font-weight: 700;
        }

        .job-card-premium-salary-value {
          margin: 4px 0 0 0;
          font-size: 16px;
          font-weight: 900;
          color: #065f46;
          line-height: 1.45;
        }

        .job-card-premium-shift-box {
          border: 1px solid #d1fae5;
          background: linear-gradient(135deg, #ecfdf5 0%, #f8fafc 100%);
          border-radius: 18px;
          padding: 14px;
          margin-bottom: 14px;
        }

        .job-card-premium-shift-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 9px;
        }

        .job-card-premium-shift-label {
          font-size: 11px;
          font-weight: 800;
          color: #047857;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .job-card-premium-shift-count {
          font-size: 11px;
          font-weight: 700;
          color: #059669;
        }

        .job-card-premium-shift-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 36px;
          padding: 0 12px;
          border-radius: 12px;
          background: #ffffff;
          border: 1px solid #bbf7d0;
          color: #065f46;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 6px 16px rgba(16,185,129,0.08);
        }

        .job-card-premium-info-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin-bottom: 16px;
        }

        .job-card-premium-info-item {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        .job-card-premium-info-item svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .job-card-premium-info-item strong {
          color: #0f172a;
        }

        .job-card-premium-footer {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .job-card-premium-meta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
        }

        .job-card-premium-detail-btn {
          min-height: 40px;
          padding: 0 14px;
          border-radius: 13px;
          text-decoration: none;
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 12px 24px rgba(16,185,129,0.2);
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .job-card-premium {
            padding: 18px;
          }

          .job-card-premium-title {
            font-size: 18px;
          }

          .job-card-premium-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .job-card-premium-detail-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

export default JobCard;