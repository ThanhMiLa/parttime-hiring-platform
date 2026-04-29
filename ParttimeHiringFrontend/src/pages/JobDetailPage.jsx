import { useEffect, useMemo, useState } from "react";
import StoreReviewSection from "../components/jobs/StoreReviewSection";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Wallet,
  Users,
  Calendar,
  UserCircle,
  Clock,
  Phone,
  CheckCircle,
  Share2,
  Send,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import {
  getJobDetailService,
  extractSingleJobFromDetailResponse,
} from "../services/jobService";
import { applyJobService } from "../services/jobApplicationService";
import { getAccessToken } from "../utils/tokenStorage";

function formatSalary(min, max, currency) {
  if (min == null && max == null) return "Thỏa thuận";
  const unit = currency === "VND" ? "VNĐ" : currency || "";
  return `${Number(min || 0).toLocaleString("vi-VN")} - ${Number(
    max || 0
  ).toLocaleString("vi-VN")} ${unit}`;
}

function formatDate(dateValue) {
  if (!dateValue) return "Chưa có";
  try {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString("vi-VN");
  } catch {
    return dateValue;
  }
}

function splitTextToList(text) {
  if (!text) return [];
  if (Array.isArray(text)) return text.filter(Boolean);

  return text
    .split(/\n|\. /)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeShifts(shifts = []) {
  if (!Array.isArray(shifts)) return [];

  return shifts.map((shift) => {
    if (
      shift?.isFlexible === true ||
      shift?.shiftName?.toLowerCase().includes("linh hoat") ||
      shift?.shiftName?.toLowerCase().includes("linh hoạt")
    ) {
      return {
        label: shift.shiftName || "Ca linh hoạt",
        time: "Linh hoạt",
        dotColor: "#10b981",
      };
    }

    return {
      label: shift.shiftName || "Ca làm việc",
      time: `${shift.startTime || ""}${shift.startTime || shift.endTime ? " - " : ""
        }${shift.endTime || ""}`,
      dotColor: "#10b981",
    };
  });
}

function getBadgeStyle(type) {
  switch (type) {
    case "employment":
      return { background: "#dcfce7", color: "#15803d" };
    case "category":
      return { background: "#dbeafe", color: "#1d4ed8" };
    case "status":
      return { background: "#fef3c7", color: "#b45309" };
    default:
      return { background: "#f1f5f9", color: "#475569" };
  }
}

function getMapEmbedUrl(job) {
  if (job?.latitude != null && job?.longitude != null) {
    return `https://www.google.com/maps?q=${job.latitude},${job.longitude}&z=16&output=embed`;
  }

  const fallbackAddress =
    job?.fullAddress ||
    [job?.streetAddress, job?.ward, job?.district, job?.city]
      .filter(Boolean)
      .join(", ");

  if (fallbackAddress) {
    return `https://www.google.com/maps?q=${encodeURIComponent(
      fallbackAddress
    )}&z=16&output=embed`;
  }

  return "";
}

function getGoogleMapLink(job) {
  if (job?.latitude != null && job?.longitude != null) {
    return `https://www.google.com/maps/search/?api=1&query=${job.latitude},${job.longitude}`;
  }

  const fallbackAddress =
    job?.fullAddress ||
    [job?.streetAddress, job?.ward, job?.district, job?.city]
      .filter(Boolean)
      .join(", ");

  if (fallbackAddress) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      fallbackAddress
    )}`;
  }

  return "#";
}

function InfoCard({
  icon,
  label,
  value,
  iconBg = "#f8fafc",
  iconColor = "#0f172a",
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: 16,
        borderRadius: 18,
        border: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 1px 2px rgba(15,23,42,0.03)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: iconBg,
          display: "grid",
          placeItems: "center",
          color: iconColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "#64748b",
            fontWeight: 600,
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "4px 0 0 0",
            fontSize: 15,
            color: "#0f172a",
            fontWeight: 800,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: 22,
        fontWeight: 800,
        color: "#0f172a",
        margin: "0 0 18px 0",
        paddingLeft: 14,
        borderLeft: "4px solid #10B981",
      }}
    >
      {children}
    </h2>
  );
}

function ApplyJobModal({
  open,
  onClose,
  onSubmit,
  submitting,
  defaultPhone = "",
  jobTitle = "",
}) {
  const [contactPhone, setContactPhone] = useState(defaultPhone || "");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setContactPhone(defaultPhone || "");
      setNote("");
    }
  }, [open, defaultPhone]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      contactPhone: contactPhone.trim(),
      note: note.trim(),
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#fff",
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.18)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Ứng tuyển công việc
            </h3>
            <p
              style={{
                margin: "8px 0 0 0",
                color: "#64748b",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {jobTitle || "Vui lòng điền thông tin ứng tuyển"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              background: "#fff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#334155",
                }}
              >
                Số điện thoại liên hệ
              </label>

              <div style={{ position: "relative" }}>
                <Phone
                  size={18}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Ví dụ: 0905001003"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 14px 14px 42px",
                    borderRadius: 14,
                    border: "1px solid #dbe3ef",
                    background: "#f8fafc",
                    outline: "none",
                    fontSize: 15,
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#334155",
                }}
              >
                Ghi chú
              </label>

              <div style={{ position: "relative" }}>
                <FileText
                  size={18}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: 16,
                    color: "#94a3b8",
                  }}
                />
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Em có thể làm ca tối và cuối tuần."
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "14px 14px 14px 42px",
                    borderRadius: 14,
                    border: "1px solid #dbe3ef",
                    background: "#f8fafc",
                    outline: "none",
                    fontSize: 15,
                    resize: "vertical",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 6,
              }}
            >
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="btn btn-secondary"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Send size={16} />
                {submitting ? "Đang gửi..." : "Xác nhận ứng tuyển"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function FeedbackToast({ open, type = "success", message, onClose }) {
  if (!open) return null;

  const isSuccess = type === "success";

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 1200,
        minWidth: 320,
        maxWidth: 420,
        background: "#fff",
        borderRadius: 18,
        border: isSuccess ? "1px solid #bbf7d0" : "1px solid #fecaca",
        boxShadow: "0 20px 40px rgba(15,23,42,0.14)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 5,
          background: isSuccess ? "#10b981" : "#ef4444",
        }}
      />

      <div style={{ padding: 18, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: isSuccess ? "#ecfdf5" : "#fef2f2",
            color: isSuccess ? "#059669" : "#dc2626",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            fontWeight: 900,
            fontSize: 18,
          }}
        >
          {isSuccess ? "✓" : "!"}
        </div>

        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            {isSuccess ? "Thành công" : "Thông báo"}
          </p>

          <p
            style={{
              margin: "6px 0 0 0",
              fontSize: 14,
              lineHeight: 1.6,
              color: "#475569",
            }}
          >
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccessMessage, setApplySuccessMessage] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [feedback, setFeedback] = useState({
    open: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    async function fetchJobDetail() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await getJobDetailService(id);
        const jobData = extractSingleJobFromDetailResponse(response, id);

        if (!jobData) {
          setErrorMessage("Không tìm thấy công việc");
          return;
        }

        setJob(jobData);
        setActiveImageIndex(0);
      } catch (error) {
        const message =
          error?.response?.data?.message || "Không tải được chi tiết công việc";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    }

    fetchJobDetail();
  }, [id]);

  useEffect(() => {
    if (!feedback.open) return;

    const timer = setTimeout(() => {
      setFeedback((prev) => ({ ...prev, open: false }));
    }, 3500);

    return () => clearTimeout(timer);
  }, [feedback.open]);

  async function handleApplyJob(formData) {
    const token = getAccessToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setApplyLoading(true);
      setApplySuccessMessage("");

      const payload = {
        jobPostId: Number(id),
        contactPhone: formData.contactPhone,
        note: formData.note,
      };

      const response = await applyJobService(payload);
      const successMsg = response?.message || "Ứng tuyển thành công";

      setApplySuccessMessage(successMsg);
      setShowApplyModal(false);
      setFeedback({
        open: true,
        type: "success",
        message: successMsg,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Ứng tuyển thất bại, vui lòng thử lại";

      setFeedback({
        open: true,
        type: "error",
        message,
      });
    } finally {
      setApplyLoading(false);
    }
  }

  function handlePrevImage() {
    if (!jobImages.length) return;
    setActiveImageIndex((prev) => (prev === 0 ? jobImages.length - 1 : prev - 1));
  }

  function handleNextImage() {
    if (!jobImages.length) return;
    setActiveImageIndex((prev) =>
      prev === jobImages.length - 1 ? 0 : prev + 1
    );
  }

  const descriptionList = useMemo(
    () => splitTextToList(job?.jobDescription),
    [job?.jobDescription]
  );

  const requirementsList = useMemo(
    () => splitTextToList(job?.requirements),
    [job?.requirements]
  );

  const benefitsList = useMemo(
    () => splitTextToList(job?.benefits),
    [job?.benefits]
  );

  const shifts = useMemo(() => normalizeShifts(job?.shifts || []), [job?.shifts]);

  const mapEmbedUrl = useMemo(() => getMapEmbedUrl(job), [job]);
  const googleMapLink = useMemo(() => getGoogleMapLink(job), [job]);

  const jobImages = useMemo(() => {
    if (!Array.isArray(job?.images)) return [];
    return job.images.map((item) => item?.imageUrl).filter(Boolean);
  }, [job?.images]);

  const activeImage = jobImages[activeImageIndex] || "";

  if (loading) {
    return (
      <div className="container page-section">
        <div className="empty-state">
          <p>Đang tải chi tiết công việc...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container page-section">
        <div className="empty-state">
          <p className="error-text">{errorMessage}</p>
          <Link to="/jobs" className="btn btn-secondary" style={{ marginTop: 12 }}>
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <main className="container" style={{ paddingTop: 32, paddingBottom: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 2fr) minmax(320px, 1fr)",
              gap: 32,
              alignItems: "start",
            }}
            className="job-detail-layout"
          >
            <section
              style={{
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  padding: 32,
                  borderRadius: 24,
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <Link
                    to="/jobs"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#64748b",
                      fontWeight: 600,
                      width: "fit-content",
                    }}
                  >
                    <ArrowLeft size={18} />
                    <span>Quay lại danh sách</span>
                  </Link>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    <span
                      style={{
                        ...getBadgeStyle("employment"),
                        padding: "7px 14px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {job.employmentType || "Toàn thời gian"}
                    </span>

                    {(job.categories || []).map((category) => (
                      <span
                        key={category}
                        style={{
                          ...getBadgeStyle("category"),
                          padding: "7px 14px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                        }}
                      >
                        {category}
                      </span>
                    ))}

                    <span
                      style={{
                        ...getBadgeStyle("status"),
                        padding: "7px 14px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {job.status || "Mới đăng"}
                    </span>
                  </div>

                  <h1
                    style={{
                      margin: 0,
                      fontSize: "clamp(28px, 4vw, 42px)",
                      lineHeight: 1.2,
                      fontWeight: 800,
                      color: "#0f172a",
                    }}
                  >
                    {job.title}
                  </h1>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                      color: "#475569",
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 18 }}>{job.storeName}</span>
                    <CheckCircle size={17} color="#3b82f6" />
                    <span>{job.employerName}</span>
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(true)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "12px 24px",
                        background: "#059669",
                        color: "#fff",
                        borderRadius: 16,
                        fontWeight: 800,
                        border: "none",
                        cursor: "pointer",
                        width: "fit-content",
                        boxShadow: "0 12px 24px rgba(16,185,129,0.18)",
                      }}
                    >
                      Ứng tuyển ngay
                    </button>

                    {applySuccessMessage ? (
                      <p
                        style={{
                          margin: 0,
                          color: "#15803d",
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {applySuccessMessage}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 16,
                }}
                className="job-detail-info-grid"
              >
                <InfoCard
                  icon={<Wallet size={24} />}
                  label="Mức lương"
                  value={formatSalary(
                    job.hourlyWageMin,
                    job.hourlyWageMax,
                    job.currency
                  )}
                  iconBg="#ecfdf5"
                  iconColor="#059669"
                />
                <InfoCard
                  icon={<Users size={24} />}
                  label="Số lượng"
                  value={`${job.vacancyCount || 0} người`}
                  iconBg="#eff6ff"
                  iconColor="#2563eb"
                />
                <InfoCard
                  icon={<Calendar size={24} />}
                  label="Độ tuổi"
                  value={`${job.minAge || "-"} - ${job.maxAge || "-"} tuổi`}
                  iconBg="#faf5ff"
                  iconColor="#9333ea"
                />
                <InfoCard
                  icon={<UserCircle size={24} />}
                  label="Giới tính"
                  value={job.genderRequirement || "Không yêu cầu"}
                  iconBg="#fdf2f8"
                  iconColor="#db2777"
                />
                <InfoCard
                  icon={<Clock size={24} />}
                  label="Ngày đăng"
                  value={formatDate(job.publishedAt)}
                  iconBg="#fffbeb"
                  iconColor="#d97706"
                />
                <InfoCard
                  icon={<Clock size={24} />}
                  label="Ngày hết hạn"
                  value={formatDate(job.expiredAt)}
                  iconBg="#fef2f2"
                  iconColor="#dc2626"
                />
              </div>

              <div
                style={{
                  background: "#ffffff",
                  padding: 32,
                  borderRadius: 24,
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 36,
                }}
              >
                <section>
                  <SectionTitle>Mô tả công việc</SectionTitle>
                  {descriptionList.length ? (
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        color: "#475569",
                        lineHeight: 1.8,
                      }}
                    >
                      {descriptionList.map((item, index) => (
                        <li
                          key={index}
                          style={{
                            position: "relative",
                            paddingLeft: 24,
                            marginBottom: 10,
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              color: "#10B981",
                              fontWeight: 700,
                            }}
                          >
                            •
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "#64748b", margin: 0 }}>
                      Chưa có mô tả công việc.
                    </p>
                  )}
                </section>

                <section>
                  <SectionTitle>Yêu cầu ứng viên</SectionTitle>
                  {requirementsList.length ? (
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        color: "#475569",
                        lineHeight: 1.8,
                      }}
                    >
                      {requirementsList.map((item, index) => (
                        <li
                          key={index}
                          style={{
                            position: "relative",
                            paddingLeft: 24,
                            marginBottom: 10,
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              color: "#10B981",
                              fontWeight: 700,
                            }}
                          >
                            •
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "#64748b", margin: 0 }}>
                      Chưa có yêu cầu ứng viên.
                    </p>
                  )}
                </section>

                <section>
                  <SectionTitle>Quyền lợi</SectionTitle>
                  {benefitsList.length ? (
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        color: "#475569",
                        lineHeight: 1.8,
                      }}
                    >
                      {benefitsList.map((item, index) => (
                        <li
                          key={index}
                          style={{
                            position: "relative",
                            paddingLeft: 24,
                            marginBottom: 10,
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              color: "#10B981",
                              fontWeight: 700,
                            }}
                          >
                            •
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "#64748b", margin: 0 }}>
                      Chưa có quyền lợi.
                    </p>
                  )}
                </section>
              </div>

              {job?.storeId ? <StoreReviewSection storeId={job.storeId} jobPostId={job.id} /> : null}
            </section>

            <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <a
                href={job.phoneContact ? `tel:${job.phoneContact}` : "#"}
                style={{
                  width: "100%",
                  background: "#0052CC",
                  color: "#ffffff",
                  padding: "12px 16px",
                  borderRadius: 20,
                  fontWeight: 800,
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  boxShadow: "0 14px 28px rgba(59,130,246,0.2)",
                  opacity: job.phoneContact ? 1 : 0.6,
                  pointerEvents: job.phoneContact ? "auto" : "none",
                  textAlign: "left",
                  textDecoration: "none",
                }}
              >
                <Phone size={22} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    lineHeight: 1.25,
                  }}
                >
                  <span style={{ fontSize: 17, fontWeight: 800 }}>
                    Gọi điện ngay
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      letterSpacing: "0.01em",
                      marginTop: 2,
                    }}
                  >
                    {job.phoneContact || "Chưa có số liên hệ"}
                  </span>
                </span>
              </a>

              <div
                style={{
                  background: "#ffffff",
                  padding: 24,
                  borderRadius: 24,
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                }}
              >
                <h3
                  style={{
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    margin: "0 0 16px 0",
                  }}
                >
                  Nhà tuyển dụng
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "999px",
                      background: "#dbeafe",
                      display: "grid",
                      placeItems: "center",
                      color: "#2563eb",
                      fontWeight: 800,
                      fontSize: 22,
                      border: "2px solid #f8fafc",
                      flexShrink: 0,
                    }}
                  >
                    {(job.employerName || "N").charAt(0)}
                  </div>

                  <div>
                    <p style={{ margin: 0, fontWeight: 800, color: "#0f172a" }}>
                      {job.employerName || "Nhà tuyển dụng"}
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: 14,
                        color: "#64748b",
                      }}
                    >
                      Đơn vị tuyển dụng
                    </p>
                  </div>
                </div>
              </div>

              {jobImages.length > 0 ? (
                <div
                  style={{
                    background: "#ffffff",
                    padding: 20,
                    borderRadius: 24,
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          color: "#64748b",
                          fontWeight: 700,
                          fontSize: 12,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          margin: "0 0 6px 0",
                        }}
                      >
                        Hình ảnh công việc
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          color: "#0f172a",
                          fontWeight: 700,
                        }}
                      >
                        {activeImageIndex + 1} / {jobImages.length} ảnh
                      </p>
                    </div>

                    {jobImages.length > 1 ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          onClick={handlePrevImage}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            border: "1px solid #e2e8f0",
                            background: "#fff",
                            display: "grid",
                            placeItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={handleNextImage}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            border: "1px solid #e2e8f0",
                            background: "#fff",
                            display: "grid",
                            placeItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: 260,
                      borderRadius: 18,
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
                    }}
                  >
                    <img
                      src={activeImage}
                      alt={`job-image-${activeImageIndex + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      overflowX: "auto",
                      paddingBottom: 2,
                    }}
                    className="job-detail-thumbnail-row"
                  >
                    {jobImages.map((imageUrl, index) => {
                      const isActive = index === activeImageIndex;

                      return (
                        <button
                          key={`${imageUrl}-${index}`}
                          type="button"
                          onClick={() => setActiveImageIndex(index)}
                          style={{
                            padding: 0,
                            border: isActive
                              ? "2px solid #10b981"
                              : "1px solid #e2e8f0",
                            borderRadius: 14,
                            overflow: "hidden",
                            background: "#fff",
                            cursor: "pointer",
                            minWidth: 92,
                            width: 92,
                            height: 68,
                            flexShrink: 0,
                            boxShadow: isActive
                              ? "0 8px 18px rgba(16,185,129,0.16)"
                              : "none",
                          }}
                        >
                          <img
                            src={imageUrl}
                            alt={`job-thumb-${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "#ffffff",
                    padding: 20,
                    borderRadius: 24,
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                  }}
                >
                  <h3
                    style={{
                      color: "#64748b",
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      margin: "0 0 12px 0",
                    }}
                  >
                    Hình ảnh công việc
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      color: "#64748b",
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <ImageIcon size={18} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
                        Chưa có hình ảnh
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: 13 }}>
                        Job post này chưa được thêm ảnh.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{
                  background: "#ffffff",
                  padding: 24,
                  borderRadius: 24,
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                }}
              >
                <h3
                  style={{
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    margin: "0 0 16px 0",
                  }}
                >
                  Địa điểm làm việc
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <MapPin
                    size={18}
                    color="#94a3b8"
                    style={{ marginTop: 2, flexShrink: 0 }}
                  />
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, color: "#0f172a" }}>
                      {job.storeName}
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: 14,
                        color: "#64748b",
                        lineHeight: 1.7,
                      }}
                    >
                      {job.fullAddress ||
                        [job.streetAddress, job.ward, job.district, job.city]
                          .filter(Boolean)
                          .join(", ")}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 220,
                    borderRadius: 18,
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                  }}
                >
                  {mapEmbedUrl ? (
                    <iframe
                      title="Google Map"
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{
                        border: 0,
                        width: "100%",
                        height: "100%",
                      }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%)",
                      }}
                    >
                      <MapPin size={34} color="#ef4444" />
                    </div>
                  )}

                  <a
                    href={googleMapLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      position: "absolute",
                      right: 10,
                      bottom: 10,
                      padding: "6px 10px",
                      background: "rgba(255,255,255,0.94)",
                      fontSize: 11,
                      borderRadius: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      boxShadow: "0 1px 6px rgba(15,23,42,0.12)",
                      color: "#0f172a",
                      textDecoration: "none",
                    }}
                  >
                    Phóng to
                  </a>
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  padding: 24,
                  borderRadius: 24,
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                }}
              >
                <h3
                  style={{
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    margin: "0 0 16px 0",
                  }}
                >
                  Thời gian & Ca làm
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {shifts.length ? (
                    shifts.map((shift, index) => (
                      <div
                        key={`${shift.label}-${index}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 12,
                          padding: 14,
                          background: "#f8fafc",
                          borderRadius: 16,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "999px",
                              background: shift.dotColor,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#334155",
                            }}
                          >
                            {shift.label}
                          </span>
                        </div>

                        <span
                          style={{
                            fontSize: 14,
                            color: "#475569",
                            fontWeight: 800,
                          }}
                        >
                          {shift.time}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
                      Chưa có thông tin ca làm việc.
                    </p>
                  )}

                  <p
                    style={{
                      margin: "4px 0 0 0",
                      fontSize: 12,
                      color: "#94a3b8",
                      fontStyle: "italic",
                    }}
                  >
                    * Vui lòng liên hệ nhà tuyển dụng để xác nhận chi tiết thời
                    gian làm việc.
                  </p>
                </div>
              </div>

              <button
                type="button"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  border: "none",
                  background: "transparent",
                  color: "#64748b",
                  fontWeight: 600,
                  padding: "8px 0",
                  cursor: "pointer",
                }}
              >
                <Share2 size={18} />
                Chia sẻ công việc này
              </button>
            </aside>
          </div>
        </div>
      </main>

      <footer
        style={{
          background: "#0f172a",
          color: "#94a3b8",
          padding: "40px 16px",
          marginTop: 32,
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 16px 0" }}>
            © 2023 JobPortal. Tất cả quyền được bảo lưu.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              flexWrap: "wrap",
              fontSize: 14,
            }}
          >
            <span>Điều khoản</span>
            <span>Chính sách bảo mật</span>
            <span>Liên hệ</span>
          </div>
        </div>
      </footer>

      <ApplyJobModal
        open={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSubmit={handleApplyJob}
        submitting={applyLoading}
        defaultPhone={job?.phoneContact || ""}
        jobTitle={job?.title || ""}
      />

      <FeedbackToast
        open={feedback.open}
        type={feedback.type}
        message={feedback.message}
        onClose={() =>
          setFeedback({
            open: false,
            type: "success",
            message: "",
          })
        }
      />

      <style>{`
        .job-detail-thumbnail-row::-webkit-scrollbar {
          height: 8px;
        }

        .job-detail-thumbnail-row::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }

        .job-detail-thumbnail-row::-webkit-scrollbar-track {
          background: transparent;
        }

        @media (max-width: 1024px) {
          .job-detail-layout {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .job-detail-info-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .job-detail-thumbnail-row {
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default JobDetailPage;