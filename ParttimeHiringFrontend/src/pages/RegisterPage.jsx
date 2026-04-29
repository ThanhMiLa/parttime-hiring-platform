import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  CalendarDays,
} from "lucide-react";
import { registerService } from "../services/authService";
import { getProfileService } from "../services/profileService";
import { setTokens, setCurrentUser } from "../utils/tokenStorage";

function RegisterPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const response = await registerService(formData);
      const result = response?.result;

      setTokens(result?.accessToken, result?.refreshToken);

      const meResponse = await getProfileService();
      const me = meResponse?.result;

      const roleNames = (me?.roles || []).map((role) => role.name);

      setCurrentUser({
        id: me?.id ?? result?.id,
        displayName: me?.displayName ?? result?.displayName,
        username: me?.username ?? result?.username,
        dob: me?.dob ?? result?.dob,
        roles: roleNames,
      });

      if (roleNames.includes("EMPLOYER")) {
        navigate("/employer");
      } else {
        navigate("/jobs");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Đăng ký thất bại";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-modern-shell">
      <div className="auth-modern-left">
        <div className="auth-modern-left-bg auth-modern-left-register" />
        <div className="auth-modern-overlay" />

        <div className="auth-modern-content">
          <div className="auth-modern-brand">
            <div className="auth-modern-brand-icon">
              <BriefcaseBusiness size={24} />
            </div>
            <h1>JobPortal</h1>
          </div>

          <div className="auth-modern-copy">
            <h2>
              Tạo tài khoản và
              <br />
              <span>bắt đầu ngay hôm nay.</span>
            </h2>

            <p>
              Tham gia nền tảng tìm việc part-time hiện đại, dễ dùng và tối ưu
              cho sinh viên trên toàn quốc.
            </p>
          </div>

          <div className="auth-modern-image-card">
            <div className="auth-modern-image auth-modern-image-register" />
          </div>

          <div className="auth-modern-users">
            <div className="auth-modern-avatars">
              <div className="auth-modern-avatar" />
              <div className="auth-modern-avatar" />
              <div className="auth-modern-avatar" />
            </div>

            <p>
              Hơn <strong>5,000+ sinh viên</strong> đã tham gia cùng JobPortal.
            </p>
          </div>
        </div>
      </div>

      <div className="auth-modern-right">
        <div className="auth-modern-form-wrap">
          <div className="auth-modern-mobile-brand">
            <div className="auth-modern-brand-icon">
              <BriefcaseBusiness size={22} />
            </div>
            <h2>JobPortal</h2>
          </div>

          <div className="auth-modern-header">
            <h2>Tạo tài khoản mới</h2>
            <p>Điền thông tin bên dưới để bắt đầu sử dụng hệ thống.</p>
          </div>

          <div className="auth-modern-divider" style={{ marginTop: 0 }}>
            <span>Đăng ký tài khoản sinh viên</span>
          </div>

          <form className="auth-modern-form" onSubmit={handleSubmit}>
            <div className="auth-modern-field">
              <label htmlFor="displayName">Tên hiển thị</label>
              <div className="auth-modern-input-wrap">
                <span className="auth-modern-input-icon">
                  <User size={18} />
                </span>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-modern-field">
              <label htmlFor="username">Username</label>
              <div className="auth-modern-input-wrap">
                <span className="auth-modern-input-icon">
                  <Mail size={18} />
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Nhập username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-modern-field">
              <label htmlFor="dob">Ngày sinh</label>
              <div className="auth-modern-input-wrap">
                <span className="auth-modern-input-icon">
                  <CalendarDays size={18} />
                </span>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-modern-field">
              <label htmlFor="password">Mật khẩu</label>
              <div className="auth-modern-input-wrap">
                <span className="auth-modern-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="auth-modern-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-modern-field">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <div className="auth-modern-input-wrap">
                <span className="auth-modern-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="auth-modern-password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

            <button type="submit" className="auth-modern-submit-btn" disabled={loading}>
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>

          <p className="auth-modern-switch-text">
            Đã có tài khoản?
            <Link to="/login"> Đăng nhập ngay</Link>
          </p>

          <footer className="auth-modern-footer">
            <div>
              <a href="#">Chính sách bảo mật</a>
              <a href="#">Điều khoản dịch vụ</a>
              <a href="#">Trung tâm hỗ trợ</a>
            </div>
            <p>© 2024 JobPortal. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;