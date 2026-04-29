import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Image,
  Video,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Send,
  Link as LinkIcon,
  BadgeCheck,
  Sparkles,
  BriefcaseBusiness,
  Lock,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

function EmployerVerifyPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    companyAddress: "",
    cccdFront: "",
    cccdBack: "",
    storeImages: "",
    video: "",
    note: "",
  });

  const [otpStep, setOtpStep] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateBeforeSendOtp() {
    if (!formData.companyName.trim()) {
      return "Vui lòng nhập tên công ty";
    }
    if (!formData.email.trim()) {
      return "Vui lòng nhập email công ty";
    }
    if (!formData.phone.trim()) {
      return "Vui lòng nhập số điện thoại";
    }

    if (!formData.companyAddress.trim()) {
      return "Vui lòng nhập địa chỉ công ty";
    }
    if (!formData.storeImages.trim()) {
      return "Vui lòng nhập link ảnh cửa hàng";
    }
    if (!formData.video.trim()) {
      return "Vui lòng nhập link video giới thiệu";
    }

    return "";
  }

  // STEP 1: Gửi OTP tới email doanh nghiệp
  async function handleSendOtp(event) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const validationError = validateBeforeSendOtp();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem("employer_verify_otp", otp);
      setGeneratedOtp(otp);

      const response = await fetch(`https://formsubmit.co/ajax/${formData.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "Mã OTP xác minh doanh nghiệp",
          _captcha: "false",
          message: `Mã OTP xác minh của bạn là: ${otp}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Không gửi được OTP");
      }

      setOtpStep(true);
      setSuccessMessage("OTP đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư để tiếp tục xác minh.");
    } catch (error) {
      setErrorMessage(error?.message || "Không gửi được OTP. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  // STEP 2 + 3: Kiểm tra OTP, đúng thì gửi form xác minh về Gmail quản trị
  async function handleVerifyOtp() {
    setSuccessMessage("");
    setErrorMessage("");

    const savedOtp = localStorage.getItem("employer_verify_otp");

    if (!otpInput.trim()) {
      setErrorMessage("Vui lòng nhập mã OTP");
      return;
    }

    if (otpInput !== savedOtp) {
      setErrorMessage("OTP không đúng. Vui lòng kiểm tra lại email.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("https://formsubmit.co/ajax/vntvlogs@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "Xác minh nhà tuyển dụng",
          _template: "table",
          _captcha: "false",
          _replyto: formData.email,
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          cccdFront: formData.cccdFront,
          cccdBack: formData.cccdBack,
          businessLicense: formData.businessLicense,
          storeImages: formData.storeImages,
          video: formData.video,
          note: formData.note,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Gửi xác minh thất bại");
      }

      localStorage.removeItem("employer_verify_otp");

      setSuccessMessage(
        "Xác minh thành công và hồ sơ đã được gửi tới quản trị viên. Chúng tôi sẽ kiểm tra và phản hồi trong vòng 24-48h làm việc. Nếu thành công, bạn sẻ được cấp tài khoảng Employer Premium để đăng tuyển không giới hạn và tiếp cận nhiều ứng viên hơn."
      );
      setErrorMessage("");
      setOtpStep(false);
      setOtpInput("");
      setGeneratedOtp("");

      setFormData({
        companyName: "",
        email: "",
        phone: "",
        companyAddress: "",
        cccdFront: "",
        cccdBack: "",
        storeImages: "",
        video: "",
        note: "",
      });
    } catch (error) {
      setErrorMessage(
        error?.message ||
        "Chưa gửi được yêu cầu xác minh. Hãy kiểm tra lại Gmail nhận FormSubmit hoặc thử lại sau."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleBackToForm() {
    setOtpStep(false);
    setOtpInput("");
    setSuccessMessage("");
    setErrorMessage("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(16,185,129,0.10) 0%, transparent 28%), radial-gradient(circle at top right, rgba(59,130,246,0.08) 0%, transparent 24%), #f8fafc",
      }}
    >
      <div
        className="container page-section"
        style={{ maxWidth: 1220, paddingTop: 28, paddingBottom: 48 }}
      >
        <Link
          to="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
            color: "#64748b",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={18} />
          Quay lại đăng nhập
        </Link>

        <div className="verify-premium-layout">
          <section className="verify-premium-form-card">
            <div className="verify-premium-header">
              <div className="verify-premium-icon-box">
                <ShieldCheck size={28} />
              </div>

              <div>
                <p className="verify-premium-kicker">Employer Verification</p>
                <h1 className="verify-premium-title">Xác minh doanh nghiệp</h1>
                <p className="verify-premium-subtitle">
                  Hoàn tất xác minh để mở khóa đăng tuyển, tăng độ tin cậy với ứng
                  viên và xây dựng thương hiệu tuyển dụng chuyên nghiệp.
                </p>
              </div>
            </div>

            <div className="verify-premium-badges">
              <MiniBadge icon={<Lock size={14} />} text="Bảo mật liên kết hồ sơ" />
              <MiniBadge icon={<BadgeCheck size={14} />} text="Đội ngũ kiểm duyệt" />
              <MiniBadge icon={<Sparkles size={14} />} text="Trải nghiệm chuyên nghiệp" />
            </div>

            {successMessage ? (
              <StatusBox type="success" message={successMessage} />
            ) : null}

            {errorMessage ? (
              <StatusBox type="error" message={errorMessage} />
            ) : null}

            {!otpStep ? (
              <form onSubmit={handleSendOtp} style={{ marginTop: 8 }}>
                <div className="verify-premium-form-grid">
                  <Input
                    label="Tên công ty"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    icon={<Building2 size={17} />}
                    placeholder="Ví dụ: Highlands Coffee Việt Nam"
                  />

                  <Input
                    label="Email công ty"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={<Mail size={17} />}
                    placeholder="contact@company.com"
                  />

                  <Input
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={<Phone size={17} />}
                    placeholder="Ví dụ: 0363636363"
                  />

                  <Input
                    label="Địa chỉ công ty"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    icon={<MapPin size={17} />}
                    placeholder="Ví dụ: 36 Thanh Hóa, TP.HCM"
                  />

                  <Input
                    label="CCCD mặt trước"
                    name="cccdFront"
                    value={formData.cccdFront}
                    onChange={handleChange}
                    icon={<Image size={17} />}
                    placeholder="Dán link Google Drive"
                    required={false}
                  />

                  <Input
                    label="CCCD mặt sau"
                    name="cccdBack"
                    value={formData.cccdBack}
                    onChange={handleChange}
                    icon={<FileText size={17} />}
                    placeholder="Dán link Google Drive"
                    required={false}
                  />

                  <Input
                    label="Ảnh cửa hàng"
                    name="storeImages"
                    value={formData.storeImages}
                    onChange={handleChange}
                    icon={<LinkIcon size={17} />}
                    placeholder="1 link hoặc folder Google Drive"
                  />

                  <Input
                    label="Video cửa hàng"
                    name="video"
                    value={formData.video}
                    onChange={handleChange}
                    icon={<Video size={17} />}
                    placeholder="Link video Google Drive"
                  />

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="verify-label">Ghi chú</label>
                    <textarea
                      className="verify-textarea"
                      rows={5}
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="Ví dụ: Công ty đã hoạt động 3 năm, hiện có 2 chi nhánh, đang tuyển part-time tại Đà Nẵng và TP.HCM..."
                    />
                  </div>
                </div>

                <div className="verify-premium-submit-wrap">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="verify-premium-submit-btn"
                  >
                    <Send size={18} />
                    {submitting ? "Đang gửi OTP..." : "Gửi OTP xác minh"}
                  </button>

                  <p className="verify-premium-submit-note">
                    Bằng cách tiếp tục, hệ thống sẽ gửi mã OTP tới email doanh nghiệp để
                    xác nhận trước khi chuyển hồ sơ đến đội ngũ kiểm duyệt.
                  </p>
                </div>
              </form>
            ) : (
              <div className="verify-otp-card">
                <div className="verify-otp-head">
                  <div className="verify-otp-icon">
                    <Mail size={24} />
                  </div>

                  <div>
                    <h3 className="verify-otp-title">Nhập mã OTP từ email</h3>
                    <p className="verify-otp-desc">
                      Chúng tôi đã gửi mã xác minh tới <strong>{formData.email}</strong>.
                      Vui lòng nhập mã OTP để hoàn tất gửi hồ sơ xác minh doanh nghiệp.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 22 }}>
                  <label className="verify-label">Mã OTP</label>
                  <input
                    className="verify-input no-icon verify-otp-input"
                    placeholder="Nhập mã OTP gồm 6 chữ số"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                  />
                </div>

                <div className="verify-otp-actions">
                  <button
                    type="button"
                    className="verify-otp-secondary-btn"
                    onClick={handleBackToForm}
                    disabled={submitting}
                  >
                    Quay lại chỉnh sửa
                  </button>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={submitting}
                    className="verify-premium-submit-btn"
                    style={{ marginTop: 0 }}
                  >
                    <ShieldCheck size={18} />
                    {submitting ? "Đang xác minh..." : "Xác nhận OTP"}
                  </button>
                </div>

                {generatedOtp ? (
                  <p className="verify-otp-note">
                    Nếu không thấy email, hãy kiểm tra mục Spam/Promotions.
                  </p>
                ) : null}
              </div>
            )}
          </section>

          <aside className="verify-premium-side">
            <div className="verify-premium-hero">
              <div className="verify-premium-hero-badge">
                <BadgeCheck size={15} />
                <span>Verified Employer</span>
              </div>

              <h2 className="verify-premium-hero-title">
                Tăng độ tin cậy tuyển dụng ngay từ lần đầu ứng viên nhìn thấy bạn
              </h2>

              <p className="verify-premium-hero-desc">
                Hồ sơ xác minh đầy đủ giúp tin tuyển dụng chuyên nghiệp hơn, rõ ràng
                hơn và tạo cảm giác an tâm cho ứng viên khi ứng tuyển.
              </p>

              <div className="verify-premium-hero-stats">
                <HeroStat value="24h" label="Kiểm tra thủ công" />
                <HeroStat value="100%" label="Bảo mật hồ sơ" />
                <HeroStat value="2 bước" label="OTP rồi gửi hồ sơ" />
              </div>
            </div>

            <div className="verify-premium-guide-card">
              <h3 className="verify-premium-side-title">Chuẩn bị hồ sơ đúng cách</h3>

              <div className="verify-premium-guide-list">
                <GuideItem
                  index="01"
                  title="Tải tài liệu lên Google Drive"
                  desc='CCCD, ảnh và video nên được đặt ở chế độ "Anyone with the link".'
                />
                <GuideItem
                  index="02"
                  title="Dán đúng từng loại liên kết"
                  desc="Mỗi mục nên điền đúng loại hồ sơ đầy đủ và rõ ràng để đội ngũ kiểm duyệt nhanh hơn."
                />
                <GuideItem
                  index="03"
                  title="Xác thực email bằng OTP"
                  desc="Sau khi gửi OTP, bạn cần nhập đúng mã xác minh được gửi về email doanh nghiệp để hoàn tất quá trình xác minh."
                />
              </div>
            </div>

            <div className="verify-premium-tip-card">
              <div className="verify-premium-tip-head">
                <ExternalLink size={18} />
                <span>Mẹo để tránh lỗi</span>
              </div>

              <ul className="verify-premium-tip-list">
                <li>Không dùng link Drive bị giới hạn quyền truy cập.</li>
                <li>Kiểm tra mục Spam / Promotions của email nhận OTP.</li>
                <li>Dùng email doanh nghiệp sẽ tạo cảm giác chuyên nghiệp hơn.</li>
              </ul>
            </div>

            <div className="verify-premium-brand-card">
              <div className="verify-premium-brand-icon">
                <BriefcaseBusiness size={22} />
              </div>
              <div>
                <p className="verify-premium-brand-title">Professional Employer Profile</p>
                <p className="verify-premium-brand-desc">
                  Hoàn thiện xác minh để xuất hiện đáng tin cậy hơn trong mắt ứng viên.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .verify-premium-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
          gap: 24px;
          align-items: start;
        }

        .verify-premium-form-card {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border: 1px solid #e2e8f0;
          border-radius: 30px;
          padding: 34px;
          box-shadow: 0 20px 50px rgba(15,23,42,0.08);
        }

        .verify-premium-header {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 22px;
        }

        .verify-premium-icon-box {
          width: 64px;
          height: 64px;
          border-radius: 22px;
          background: linear-gradient(135deg, #dcfce7 0%, #a7f3d0 100%);
          color: #047857;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .verify-premium-kicker {
          margin: 0 0 8px 0;
          font-size: 12px;
          font-weight: 800;
          color: #10b981;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .verify-premium-title {
          margin: 0;
          font-size: clamp(30px, 4vw, 40px);
          line-height: 1.1;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.03em;
        }

        .verify-premium-subtitle {
          margin: 12px 0 0 0;
          color: #64748b;
          font-size: 15px;
          line-height: 1.8;
          max-width: 720px;
        }

        .verify-premium-badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .verify-mini-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #047857;
          font-size: 12px;
          font-weight: 700;
          border: 1px solid #bbf7d0;
        }

        .verify-status-box {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          border-radius: 18px;
          padding: 14px 16px;
          margin-bottom: 18px;
        }

        .verify-status-box-success {
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .verify-status-box-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }

        .verify-premium-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .verify-label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 700;
          color: #334155;
        }

        .verify-input-wrap {
          position: relative;
        }

        .verify-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .verify-input {
          width: 100%;
          height: 52px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 0 16px 0 44px;
          color: #0f172a;
          font-size: 15px;
          outline: none;
          transition: all 0.2s ease;
        }

        .verify-input.no-icon {
          padding-left: 16px;
        }

        .verify-input::placeholder,
        .verify-textarea::placeholder {
          color: #94a3b8;
        }

        .verify-input:focus,
        .verify-textarea:focus {
          border-color: #10b981;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(16,185,129,0.12);
        }

        .verify-textarea {
          width: 100%;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 14px 16px;
          color: #0f172a;
          font-size: 15px;
          outline: none;
          resize: vertical;
          min-height: 130px;
          transition: all 0.2s ease;
        }

        .verify-premium-submit-wrap {
          margin-top: 24px;
        }

        .verify-premium-submit-btn {
          width: 100%;
          height: 56px;
          border-radius: 18px;
          border: none;
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          color: #ffffff;
          font-size: 16px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 16px 32px rgba(16,185,129,0.28);
          transition: all 0.2s ease;
        }

        .verify-premium-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 36px rgba(16,185,129,0.32);
        }

        .verify-premium-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .verify-premium-submit-note {
          margin: 12px 0 0 0;
          text-align: center;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        .verify-otp-card {
          margin-top: 8px;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          padding: 24px;
        }

        .verify-otp-head {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .verify-otp-icon {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          background: #ecfdf5;
          color: #059669;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .verify-otp-title {
          margin: 0;
          font-size: 24px;
          font-weight: 900;
          color: #0f172a;
        }

        .verify-otp-desc {
          margin: 8px 0 0 0;
          color: #64748b;
          line-height: 1.8;
          font-size: 14px;
        }

        .verify-otp-input {
          letter-spacing: 0.25em;
          font-weight: 800;
          font-size: 18px;
          text-align: center;
        }

        .verify-otp-actions {
          margin-top: 20px;
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 12px;
        }

        .verify-otp-secondary-btn {
          height: 56px;
          border-radius: 18px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #334155;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .verify-otp-secondary-btn:hover:not(:disabled) {
          background: #f8fafc;
        }

        .verify-otp-secondary-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .verify-otp-note {
          margin: 14px 0 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        .verify-premium-side {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .verify-premium-hero {
          border-radius: 30px;
          padding: 28px;
          background:
            linear-gradient(135deg, rgba(16,185,129,0.96) 0%, rgba(5,150,105,0.92) 100%);
          color: #ffffff;
          box-shadow: 0 22px 50px rgba(5,150,105,0.24);
          overflow: hidden;
          position: relative;
        }

        .verify-premium-hero::before {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          right: -70px;
          top: -70px;
          border-radius: 999px;
          background: rgba(255,255,255,0.10);
        }

        .verify-premium-hero::after {
          content: "";
          position: absolute;
          width: 140px;
          height: 140px;
          left: -40px;
          bottom: -40px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
        }

        .verify-premium-hero-badge {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.16);
          border: 1px solid rgba(255,255,255,0.22);
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .verify-premium-hero-title {
          position: relative;
          z-index: 1;
          margin: 0;
          font-size: 30px;
          line-height: 1.18;
          font-weight: 900;
          letter-spacing: -0.03em;
        }

        .verify-premium-hero-desc {
          position: relative;
          z-index: 1;
          margin: 14px 0 0 0;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255,255,255,0.94);
        }

        .verify-premium-hero-stats {
          position: relative;
          z-index: 1;
          margin-top: 22px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .verify-premium-hero-stat {
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 18px;
          padding: 14px;
        }

        .verify-premium-hero-stat-value {
          margin: 0;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.2;
        }

        .verify-premium-hero-stat-label {
          margin: 4px 0 0 0;
          font-size: 12px;
          color: rgba(255,255,255,0.86);
          line-height: 1.5;
        }

        .verify-premium-guide-card,
        .verify-premium-tip-card,
        .verify-premium-brand-card {
          background: rgba(255,255,255,0.95);
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 12px 30px rgba(15,23,42,0.05);
        }

        .verify-premium-side-title {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }

        .verify-premium-guide-list {
          margin-top: 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .verify-premium-guide-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .verify-premium-guide-index {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: #dcfce7;
          color: #047857;
          display: grid;
          place-items: center;
          font-size: 13px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .verify-premium-guide-item-title {
          margin: 0;
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
        }

        .verify-premium-guide-item-desc {
          margin: 6px 0 0 0;
          font-size: 14px;
          line-height: 1.7;
          color: #64748b;
        }

        .verify-premium-tip-head {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #1d4ed8;
          font-size: 15px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .verify-premium-tip-list {
          margin: 0;
          padding-left: 18px;
          color: #475569;
          line-height: 1.9;
          font-size: 14px;
        }

        .verify-premium-brand-card {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .verify-premium-brand-icon {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          color: #059669;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .verify-premium-brand-title {
          margin: 0;
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
        }

        .verify-premium-brand-desc {
          margin: 6px 0 0 0;
          font-size: 14px;
          color: #64748b;
          line-height: 1.7;
        }

        @media (max-width: 1024px) {
          .verify-premium-layout {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .verify-premium-form-card {
            padding: 24px;
          }

          .verify-premium-form-grid {
            grid-template-columns: 1fr !important;
          }

          .verify-premium-header {
            flex-direction: column;
          }

          .verify-premium-hero-stats {
            grid-template-columns: 1fr !important;
          }

          .verify-premium-title {
            font-size: 30px !important;
          }

          .verify-premium-hero-title {
            font-size: 26px;
          }

          .verify-otp-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  icon,
  value,
  onChange,
  placeholder,
  required = true,
}) {
  return (
    <div>
      <label className="verify-label">{label}</label>

      <div className="verify-input-wrap">
        {icon ? <div className="verify-input-icon">{icon}</div> : null}

        <input
          className={`verify-input ${icon ? "" : "no-icon"}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function MiniBadge({ icon, text }) {
  return (
    <span className="verify-mini-badge">
      {icon}
      <span>{text}</span>
    </span>
  );
}

function StatusBox({ type, message }) {
  const isSuccess = type === "success";

  return (
    <div
      className={`verify-status-box ${isSuccess ? "verify-status-box-success" : "verify-status-box-error"
        }`}
    >
      {isSuccess ? (
        <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 2 }} />
      ) : (
        <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
      )}
      <span style={{ fontWeight: 700, lineHeight: 1.7 }}>{message}</span>
    </div>
  );
}

function GuideItem({ index, title, desc }) {
  return (
    <div className="verify-premium-guide-item">
      <div className="verify-premium-guide-index">{index}</div>

      <div>
        <p className="verify-premium-guide-item-title">{title}</p>
        <p className="verify-premium-guide-item-desc">{desc}</p>
      </div>
    </div>
  );
}

function HeroStat({ value, label }) {
  return (
    <div className="verify-premium-hero-stat">
      <p className="verify-premium-hero-stat-value">{value}</p>
      <p className="verify-premium-hero-stat-label">{label}</p>
    </div>
  );
}

export default EmployerVerifyPage;