import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserCircle2,
  CalendarDays,
  AtSign,
  Sparkles,
  BriefcaseBusiness,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import { getProfileService } from "../services/profileService";

function formatDate(dateValue) {
  if (!dateValue) return "Chưa cập nhật";
  try {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString("vi-VN");
  } catch {
    return dateValue;
  }
}

function getInitials(name) {
  if (!name) return "U";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

function ProfileInfoCard({ icon, label, value }) {
  return (
    <div className="profile-info-card">
      <div className="profile-info-icon">{icon}</div>
      <div>
        <div className="profile-info-label">{label}</div>
        <div className="profile-info-value">{value || "Chưa cập nhật"}</div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await getProfileService();
        setProfile(response?.result || null);
      } catch (error) {
        const message =
          error?.response?.data?.message || "Không tải được profile";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const roleNames = useMemo(
    () => (profile?.roles || []).map((role) => role.name),
    [profile]
  );

  const isEmployer = roleNames.includes("EMPLOYER");
  const displayName = profile?.displayName || "Người dùng";
  const username = profile?.username || "unknown";
  const dob = formatDate(profile?.dob);
  const initials = getInitials(displayName);

  if (loading) {
    return (
      <div className="container page-section">
        <div className="profile-loading-card">
          <p style={{ margin: 0 }}>Đang tải dữ liệu hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container page-section">
        <div className="profile-loading-card">
          <p className="error-text" style={{ margin: 0 }}>
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-section">
      <div className="profile-page-shell">
        <section className="profile-hero-card">
          <div className="profile-hero-top">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">{initials}</div>
              <div className="profile-avatar-ring" />
            </div>

            <div className="profile-hero-text">
              <div className="profile-badge">
                <Sparkles size={14} />
                <span>Hồ sơ cá nhân</span>
              </div>

              <h1 className="profile-display-name">{displayName}</h1>

              <div className="profile-username-line">
                <AtSign size={15} />
                <span>{username}</span>
              </div>

              <p className="profile-subtitle">
                Quản lý thông tin cơ bản của tài khoản và truy cập nhanh đến các
                chức năng phù hợp với vai trò hiện tại.
              </p>
            </div>
          </div>

          <div className="profile-summary-grid">
            <ProfileInfoCard
              icon={<UserRound size={18} />}
              label="Tên hiển thị"
              value={displayName}
            />
            <ProfileInfoCard
              icon={<AtSign size={18} />}
              label="Username"
              value={username}
            />
            <ProfileInfoCard
              icon={<CalendarDays size={18} />}
              label="Ngày sinh"
              value={dob}
            />
          </div>

          <div className="profile-action-row">
            {isEmployer ? (
              <Link to="/employer" className="profile-primary-btn">
                <LayoutDashboard size={16} />
                <span>Đi tới dashboard employer</span>
              </Link>
            ) : (
              <Link to="/my-applications" className="profile-primary-btn">
                <BriefcaseBusiness size={16} />
                <span>Xem việc đã ứng tuyển</span>
              </Link>
            )}
          </div>
        </section>

        <section className="profile-extra-grid">
          <div className="profile-note-card">
            <h3 className="profile-section-title">Thông tin tài khoản</h3>
            <p className="profile-note-text">
              Đây là phần thông tin cơ bản đang được hiển thị trên hệ thống. Bạn
              có thể dùng trang này để kiểm tra nhanh tên người dùng, tên hiển
              thị và ngày sinh của mình.
            </p>

            <div className="profile-mini-list">
              <div className="profile-mini-item">
                <span className="profile-mini-label">Display name</span>
                <span className="profile-mini-value">{displayName}</span>
              </div>
              <div className="profile-mini-item">
                <span className="profile-mini-label">Username</span>
                <span className="profile-mini-value">@{username}</span>
              </div>
              <div className="profile-mini-item">
                <span className="profile-mini-label">Ngày sinh</span>
                <span className="profile-mini-value">{dob}</span>
              </div>
            </div>
          </div>

          <div className="profile-note-card">
            <h3 className="profile-section-title">Truy cập nhanh</h3>
            <p className="profile-note-text">
              Chọn lối tắt phù hợp để tiếp tục thao tác nhanh trong hệ thống.
            </p>

            <div className="profile-link-list">
              {isEmployer ? (
                <>
                  <Link to="/employer" className="profile-link-item">
                    <LayoutDashboard size={16} />
                    <span>Dashboard employer</span>
                  </Link>
                  <Link to="/jobs" className="profile-link-item">
                    <BriefcaseBusiness size={16} />
                    <span>Xem danh sách việc làm</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/my-applications" className="profile-link-item">
                    <BriefcaseBusiness size={16} />
                    <span>Việc đã ứng tuyển</span>
                  </Link>
                  <Link to="/jobs" className="profile-link-item">
                    <BriefcaseBusiness size={16} />
                    <span>Tìm việc mới</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .profile-page-shell {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-loading-card {
          min-height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 28px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 12px 32px rgba(15,23,42,0.06);
          color: #64748b;
          font-weight: 600;
        }

        .profile-hero-card {
          border-radius: 30px;
          padding: 32px;
          background:
            radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 28%),
            radial-gradient(circle at top left, rgba(16,185,129,0.10), transparent 24%),
            linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          box-shadow: 0 16px 40px rgba(15,23,42,0.08);
        }

        .profile-hero-top {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .profile-avatar-wrap {
          position: relative;
          width: 110px;
          height: 110px;
          flex-shrink: 0;
        }

        .profile-avatar {
          width: 110px;
          height: 110px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
          color: #ffffff;
          font-size: 34px;
          font-weight: 900;
          letter-spacing: 0.04em;
          position: relative;
          z-index: 2;
          box-shadow: 0 14px 28px rgba(37,99,235,0.22);
        }

        .profile-avatar-ring {
          position: absolute;
          inset: -8px;
          border-radius: 999px;
          border: 2px dashed rgba(37,99,235,0.18);
          z-index: 1;
        }

        .profile-hero-text {
          min-width: 0;
          flex: 1;
        }

        .profile-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 32px;
          padding: 0 12px;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 14px;
          border: 1px solid #dbeafe;
        }

        .profile-display-name {
          margin: 0;
          font-size: clamp(28px, 4vw, 40px);
          line-height: 1.12;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.03em;
        }

        .profile-username-line {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          font-size: 15px;
          font-weight: 700;
        }

        .profile-subtitle {
          margin: 14px 0 0 0;
          color: #64748b;
          font-size: 15px;
          line-height: 1.8;
          max-width: 760px;
        }

        .profile-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .profile-info-card {
          background: rgba(255,255,255,0.82);
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          box-shadow: 0 6px 18px rgba(15,23,42,0.04);
        }

        .profile-info-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          flex-shrink: 0;
        }

        .profile-info-label {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 6px;
        }

        .profile-info-value {
          color: #0f172a;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.6;
          word-break: break-word;
        }

        .profile-action-row {
          margin-top: 22px;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          gap: 12px;
        }

        .profile-primary-btn {
          min-height: 46px;
          padding: 0 18px;
          border-radius: 14px;
          background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          box-shadow: 0 12px 24px rgba(37,99,235,0.18);
        }

        .profile-primary-btn:hover {
          transform: translateY(-1px);
        }

        .profile-extra-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .profile-note-card {
          border-radius: 24px;
          padding: 24px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 28px rgba(15,23,42,0.06);
        }

        .profile-section-title {
          margin: 0 0 10px 0;
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }

        .profile-note-text {
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.75;
        }

        .profile-mini-list {
          margin-top: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .profile-mini-item {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .profile-mini-label {
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
        }

        .profile-mini-value {
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
          text-align: right;
          word-break: break-word;
        }

        .profile-link-list {
          margin-top: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .profile-link-item {
          min-height: 48px;
          padding: 0 16px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .profile-link-item:hover {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #1d4ed8;
        }

        @media (max-width: 1024px) {
          .profile-summary-grid,
          .profile-extra-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .profile-hero-card {
            padding: 22px;
          }

          .profile-hero-top {
            align-items: flex-start;
          }

          .profile-avatar-wrap,
          .profile-avatar {
            width: 86px;
            height: 86px;
          }

          .profile-avatar {
            font-size: 28px;
          }

          .profile-mini-item {
            flex-direction: column;
          }

          .profile-mini-value {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;