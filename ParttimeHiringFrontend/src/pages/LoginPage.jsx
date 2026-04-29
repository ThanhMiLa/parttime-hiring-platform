import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  Mail,
  Lock,
} from "lucide-react";
import { loginService } from "../services/authService";
import { getProfileService } from "../services/profileService";
import { setTokens, setCurrentUser } from "../utils/tokenStorage";

function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    setLoading(true);

    try {
      const response = await loginService(formData);
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
      const message = error?.response?.data?.message || "Đăng nhập thất bại";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-modern-shell">
      <div className="auth-modern-left">
        <div className="auth-modern-left-bg auth-modern-left-login" />
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
              Hành trình nghề nghiệp của bạn
              <br />
              <span>bắt đầu từ đây.</span>
            </h2>

            <p>
              Kết nối với các nhà tuyển dụng uy tín cùng những công việc part-time
              linh hoạt, phù hợp dành cho sinh viên.
            </p>
          </div>

          <div className="auth-modern-image-card">
            <div className="auth-modern-image auth-modern-image-login" />
          </div>

          <div className="auth-modern-users">
            <div className="auth-modern-avatars">
              <div className="auth-modern-avatar" />
              <div className="auth-modern-avatar" />
              <div className="auth-modern-avatar" />
            </div>

            <p>
              Tham gia cùng <strong>5,000+ sinh viên</strong> đã tìm được công việc!
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
            <h2>Chào mừng bạn quay lại</h2>
            <p>Vui lòng nhập thông tin để đăng nhập vào tài khoản của bạn.</p>
          </div>

          <div className="auth-modern-socials">
            <button type="button" className="auth-modern-social-btn">
              <span>Google</span>
            </button>
            <button type="button" className="auth-modern-social-btn">
              <span>Facebook</span>
            </button>
          </div>

          <div className="auth-modern-divider">
            <span>Hoặc tiếp tục với username</span>
          </div>

          <form className="auth-modern-form" onSubmit={handleSubmit}>
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
                  placeholder="Nhập username của bạn"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-modern-field">
              <div className="auth-modern-field-top">
                <label htmlFor="password">Mật khẩu</label>
                <button type="button" className="auth-modern-link-btn">
                  Quên mật khẩu?
                </button>
              </div>

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

            <div className="auth-modern-checkbox-row">
              <label className="auth-modern-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                />
                <span>Ghi nhớ đăng nhập trong 30 ngày</span>
              </label>
            </div>

            {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

            <button type="submit" className="auth-modern-submit-btn" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập tài khoản"}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <Link
              to="/employer-verify"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#10b981",
                textDecoration: "none",
              }}
            >
              Tôi là nhà tuyển dụng → Xác minh ngay
            </Link>
          </div>

          <p className="auth-modern-switch-text">
            Chưa có tài khoản?
            <Link to="/register"> Đăng ký miễn phí</Link>
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

export default LoginPage;