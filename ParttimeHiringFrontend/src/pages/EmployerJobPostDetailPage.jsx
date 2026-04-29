import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Clock,
  UserCircle,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  BriefcaseBusiness,
  PencilLine,
  Save,
  X,
  Layers3,
  CircleDollarSign,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import {
  getEmployerJobPostDetailService,
  getJobApplicationsByJobPostService,
  updateEmployerJobPostService,
  updateJobApplicationStatusService,
} from "../services/employerService";
import {
  getJobCategoriesService,
  getWorkShiftsService,
} from "../services/jobService";
import { getProfileService } from "../services/profileService";

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

function splitTextToList(text) {
  if (!text) return [];
  return text
    .split(/\n|\. /)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeShiftIds(jobShifts, allShifts) {
  if (!Array.isArray(jobShifts) || !Array.isArray(allShifts)) return [];

  const matchedIds = allShifts
    .filter((shift) =>
      jobShifts.some((jobShift) => {
        const shiftIdMatched =
          jobShift?.id != null &&
          shift?.id != null &&
          Number(jobShift.id) === Number(shift.id);

        const shiftNameMatched =
          jobShift?.shiftName &&
          shift?.shiftName &&
          String(jobShift.shiftName).trim().toLowerCase() ===
          String(shift.shiftName).trim().toLowerCase();

        return shiftIdMatched || shiftNameMatched;
      })
    )
    .map((shift) => Number(shift.id))
    .filter((id) => Number.isFinite(id));

  return [...new Set(matchedIds)];
}

function normalizeCategoryIds(jobCategories, allCategories) {
  if (!Array.isArray(allCategories)) return [];

  const categoryNames = Array.isArray(jobCategories) ? jobCategories : [];

  const matchedIds = allCategories
    .filter((category) => categoryNames.includes(category.categoryName))
    .map((category) => Number(category.id))
    .filter((id) => Number.isFinite(id));

  return [...new Set(matchedIds)];
}

function buildJobForm(
  jobData,
  currentProfile,
  categoryList,
  shiftList,
  locationStoreId
) {
  return {
    employerId: currentProfile?.id ?? "",
    storeId: Number(jobData?.storeId || locationStoreId || ""),
    title: jobData?.title || "",
    jobDescription: jobData?.jobDescription || "",
    requirements: jobData?.requirements || "",
    benefits: jobData?.benefits || "",
    hourlyWageMin: jobData?.hourlyWageMin ?? "",
    hourlyWageMax: jobData?.hourlyWageMax ?? "",
    currency: jobData?.currency || "VND",
    vacancyCount: jobData?.vacancyCount ?? 1,
    minAge: jobData?.minAge ?? "",
    maxAge: jobData?.maxAge ?? "",
    genderRequirement: jobData?.genderRequirement || "ANY",
    employmentType: jobData?.employmentType || "PART_TIME",
    expiredAt: jobData?.expiredAt ? jobData.expiredAt.slice(0, 16) : "",
    categoryIds: normalizeCategoryIds(jobData?.categories || [], categoryList),
    shiftIds: normalizeShiftIds(jobData?.shifts || [], shiftList),
  };
}

function formatSalary(job) {
  const min =
    job?.hourlyWageMin != null
      ? Number(job.hourlyWageMin).toLocaleString("vi-VN")
      : "0";
  const max =
    job?.hourlyWageMax != null
      ? Number(job.hourlyWageMax).toLocaleString("vi-VN")
      : "0";
  return `${min} - ${max} ${job?.currency || "VND"}`;
}

function getApplicationBadgeClass(status) {
  switch (status) {
    case "PENDING":
      return "job-detail-app-badge job-detail-app-badge-pending";
    case "ACCEPTED":
      return "job-detail-app-badge job-detail-app-badge-accepted";
    case "REJECTED":
      return "job-detail-app-badge job-detail-app-badge-rejected";
    default:
      return "job-detail-app-badge job-detail-app-badge-default";
  }
}

function getJobStatusBadgeClass(status) {
  switch (status) {
    case "ACTIVE":
      return "job-detail-status job-detail-status-active";
    case "INACTIVE":
    case "CLOSED":
    case "EXPIRED":
      return "job-detail-status job-detail-status-warning";
    default:
      return "job-detail-status job-detail-status-default";
  }
}

function formatEmploymentType(value) {
  switch (value) {
    case "PART_TIME":
      return "Part-time";
    case "SHIFT_BASED":
      return "Theo ca";
    case "SEASONAL":
      return "Thời vụ";
    case "TEMPORARY":
      return "Tạm thời";
    default:
      return value || "Chưa có";
  }
}

function formatGenderRequirement(value) {
  switch (value) {
    case "ANY":
      return "Không yêu cầu";
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    default:
      return value || "Chưa có";
  }
}

function SectionList({ title, items }) {
  return (
    <div className="job-overview-section-card">
      <h3 className="job-overview-section-title">{title}</h3>

      {items?.length ? (
        <ul className="job-overview-section-list">
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="muted-text" style={{ margin: 0 }}>
          Chưa có dữ liệu
        </p>
      )}
    </div>
  );
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="job-overview-info-box">
      <div className="job-overview-info-label">
        {icon}
        <span>{label}</span>
      </div>
      <div className="job-overview-info-value">{value || "Chưa có"}</div>
    </div>
  );
}

function EmployerJobPostDetailPage() {
  const { jobPostId } = useParams();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [job, setJob] = useState(null);
  const [jobForm, setJobForm] = useState(null);
  const [applications, setApplications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingJob, setSavingJob] = useState(false);
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  async function fetchData() {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const [profileRes, jobRes, applicationRes, categoryRes, shiftRes] =
        await Promise.all([
          getProfileService(),
          getEmployerJobPostDetailService(jobPostId),
          getJobApplicationsByJobPostService(jobPostId),
          getJobCategoriesService(),
          getWorkShiftsService(),
        ]);

      const currentProfile = profileRes?.result || null;
      const jobData = jobRes?.result;
      const categoryList = categoryRes?.result || [];
      const shiftList = shiftRes?.result || [];

      setProfile(currentProfile);
      setCategories(categoryList);
      setShifts(shiftList);
      setJob(jobData);
      setApplications(applicationRes?.result || []);
      setJobForm(
        buildJobForm(
          jobData,
          currentProfile,
          categoryList,
          shiftList,
          location?.state?.storeId
        )
      );
      setActiveImageIndex(0);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Không tải được chi tiết job post";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [jobPostId]);

  function handleJobFormChange(field, value) {
    setJobForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleToggleMultiValue(field, rawValue) {
    const value = Number(rawValue);

    setJobForm((prev) => {
      const currentValues = Array.isArray(prev[field])
        ? prev[field]
          .map((item) => Number(item))
          .filter((item) => Number.isFinite(item))
        : [];

      const existed = currentValues.includes(value);

      return {
        ...prev,
        [field]: existed
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  }

  function handleStartEditJob() {
    setErrorMessage("");
    setSuccessMessage("");
    setJobForm(
      buildJobForm(
        job,
        profile,
        categories,
        shifts,
        location?.state?.storeId
      )
    );
    setIsEditingJob(true);
  }

  function handleCancelEditJob() {
    setErrorMessage("");
    setSuccessMessage("");
    setJobForm(
      buildJobForm(
        job,
        profile,
        categories,
        shifts,
        location?.state?.storeId
      )
    );
    setIsEditingJob(false);
  }

  async function handleUpdateJob(event) {
    event.preventDefault();

    try {
      setSavingJob(true);
      setErrorMessage("");
      setSuccessMessage("");

      const payload = {
        employerId: Number(jobForm.employerId || profile?.id),
        storeId: Number(jobForm.storeId || job?.storeId || location?.state?.storeId),
        title: jobForm.title.trim(),
        jobDescription: jobForm.jobDescription.trim(),
        requirements: jobForm.requirements.trim() || null,
        benefits: jobForm.benefits.trim() || null,
        hourlyWageMin: Number(jobForm.hourlyWageMin),
        hourlyWageMax:
          jobForm.hourlyWageMax === "" ? null : Number(jobForm.hourlyWageMax),
        currency: jobForm.currency || "VND",
        vacancyCount: Number(jobForm.vacancyCount),
        minAge: jobForm.minAge === "" ? null : Number(jobForm.minAge),
        maxAge: jobForm.maxAge === "" ? null : Number(jobForm.maxAge),
        genderRequirement: jobForm.genderRequirement,
        employmentType: jobForm.employmentType,
        expiredAt: jobForm.expiredAt || null,
        categoryIds: Array.isArray(jobForm.categoryIds) ? jobForm.categoryIds : [],
        shiftIds: Array.isArray(jobForm.shiftIds) ? jobForm.shiftIds : [],
      };

      await updateEmployerJobPostService(jobPostId, payload);
      await fetchData();
      setSuccessMessage("Cập nhật job post thành công");
      setIsEditingJob(false);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Cập nhật job post thất bại";
      setErrorMessage(message);
    } finally {
      setSavingJob(false);
    }
  }

  async function handleUpdateApplicationStatus(applicationId, status) {
    try {
      setUpdatingApplicationId(applicationId);
      setErrorMessage("");
      setSuccessMessage("");

      await updateJobApplicationStatusService(applicationId, status);
      setSuccessMessage("Cập nhật trạng thái ứng tuyển thành công");
      await fetchData();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Cập nhật trạng thái ứng tuyển thất bại";
      setErrorMessage(message);
    } finally {
      setUpdatingApplicationId(null);
    }
  }

  function handlePrevImage() {
    if (!jobImages.length) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? jobImages.length - 1 : prev - 1
    );
  }

  function handleNextImage() {
    if (!jobImages.length) return;
    setActiveImageIndex((prev) =>
      prev === jobImages.length - 1 ? 0 : prev + 1
    );
  }

  const descriptionList = useMemo(
    () => splitTextToList(job?.jobDescription),
    [job]
  );
  const requirementsList = useMemo(
    () => splitTextToList(job?.requirements),
    [job]
  );
  const benefitsList = useMemo(() => splitTextToList(job?.benefits), [job]);

  const categoryDisplay = useMemo(() => {
    return Array.isArray(job?.categories) && job.categories.length
      ? job.categories.join(", ")
      : "Chưa có";
  }, [job]);

  const shiftDisplay = useMemo(() => {
    if (!Array.isArray(job?.shifts) || job.shifts.length === 0) return "Chưa có";
    return job.shifts.map((shift) => shift.shiftName || "Ca làm việc").join(", ");
  }, [job]);

  const jobImages = useMemo(() => {
    if (!Array.isArray(job?.images)) return [];
    return job.images.map((item) => item?.imageUrl).filter(Boolean);
  }, [job?.images]);

  const activeImage = jobImages[activeImageIndex] || "";

  if (loading) {
    return (
      <div className="container page-section">
        <div
          className="card"
          style={{
            borderRadius: 24,
            padding: 32,
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "#64748b", fontWeight: 600 }}>
            Đang tải chi tiết job post...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage && !job) {
    return (
      <div className="container page-section">
        <div className="empty-state">
          <p className="error-text">{errorMessage}</p>
          <Link
            to="/employer"
            className="btn btn-secondary"
            style={{ marginTop: 12 }}
          >
            Quay lại dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-page-bg">
      <div
        className="container page-section"
        style={{ maxWidth: 1180, margin: "0 auto" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <Link
            to={
              location?.state?.storeId
                ? `/employer/stores/${location.state.storeId}`
                : "/employer"
            }
            className="job-detail-back-link"
          >
            <ArrowLeft size={18} />
            Quay lại
          </Link>

          {errorMessage ? (
            <div className="job-message-card job-message-card-error">
              <p style={{ margin: 0, fontWeight: 700 }}>{errorMessage}</p>
            </div>
          ) : null}

          {successMessage ? (
            <div className="job-message-card job-message-card-success">
              <p style={{ margin: 0, fontWeight: 700 }}>{successMessage}</p>
            </div>
          ) : null}

          <section className="job-detail-hero">
            <div className="job-detail-hero-left">
              <div className="job-detail-hero-title-wrap">
                <div className="job-detail-hero-icon">
                  <BriefcaseBusiness size={20} />
                </div>

                <div style={{ minWidth: 0 }}>
                  <h1 className="job-detail-hero-title">{job?.title}</h1>
                  <div className="job-detail-hero-address">
                    <MapPin size={16} style={{ marginTop: 3, flexShrink: 0 }} />
                    <span>
                      {job?.storeName} • {job?.fullAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="job-detail-hero-right">
              <span className={getJobStatusBadgeClass(job?.status)}>
                {job?.status}
              </span>

              {!isEditingJob ? (
                <button
                  type="button"
                  className="job-detail-top-primary-btn"
                  onClick={handleStartEditJob}
                >
                  <PencilLine size={16} />
                  <span>Cập nhật</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="job-detail-top-secondary-btn"
                  onClick={handleCancelEditJob}
                >
                  <X size={16} />
                  <span>Hủy chỉnh sửa</span>
                </button>
              )}
            </div>
          </section>

          <section className="job-detail-summary-grid">
            <div className="job-detail-summary-card">
              <p className="job-detail-summary-label">Mức lương</p>
              <p className="job-detail-summary-value">{formatSalary(job)}</p>
            </div>

            <div className="job-detail-summary-card">
              <p className="job-detail-summary-label">Số lượng tuyển</p>
              <p className="job-detail-summary-value">{job?.vacancyCount}</p>
            </div>

            <div className="job-detail-summary-card">
              <p className="job-detail-summary-label">Ngày hết hạn</p>
              <p className="job-detail-summary-value">
                {formatDate(job?.expiredAt)}
              </p>
            </div>
          </section>

          {!isEditingJob ? (
            <section className="job-detail-overview-card">
              <div className="job-detail-section-head">
                <div>
                  <h2 className="job-detail-section-title">Thông tin tổng thể</h2>
                </div>

                <button
                  type="button"
                  className="job-detail-inline-edit-btn"
                  onClick={handleStartEditJob}
                >
                  <PencilLine size={16} />
                  <span>Chỉnh sửa</span>
                </button>
              </div>

              <div className="job-detail-info-grid">
                <InfoBox
                  icon={<CircleDollarSign size={15} />}
                  label="Lương"
                  value={formatSalary(job)}
                />
                <InfoBox
                  icon={<Users size={15} />}
                  label="Số lượng"
                  value={`${job?.vacancyCount ?? "Chưa có"} người`}
                />
                <InfoBox
                  icon={<UserCircle size={15} />}
                  label="Giới tính"
                  value={formatGenderRequirement(job?.genderRequirement)}
                />
                <InfoBox
                  icon={<Calendar size={15} />}
                  label="Độ tuổi"
                  value={
                    job?.minAge != null || job?.maxAge != null
                      ? `${job?.minAge ?? "-"} - ${job?.maxAge ?? "-"} tuổi`
                      : "Không yêu cầu"
                  }
                />
                <InfoBox
                  icon={<BriefcaseBusiness size={15} />}
                  label="Loại việc làm"
                  value={formatEmploymentType(job?.employmentType)}
                />
                <InfoBox
                  icon={<Clock size={15} />}
                  label="Hạn ứng tuyển"
                  value={formatDate(job?.expiredAt)}
                />
                <InfoBox
                  icon={<Layers3 size={15} />}
                  label="Danh mục"
                  value={categoryDisplay}
                />
                <InfoBox
                  icon={<Clock size={15} />}
                  label="Ca làm việc"
                  value={shiftDisplay}
                />
              </div>

              <div className="job-detail-content-grid">
                <SectionList title="Mô tả công việc" items={descriptionList} />
                <SectionList title="Yêu cầu" items={requirementsList} />
                <SectionList title="Quyền lợi" items={benefitsList} />
              </div>
            </section>
          ) : (
            <section className="job-detail-edit-card">
              <div className="job-detail-section-head">
                <div>
                  <h2 className="job-detail-section-title">Chỉnh sửa đơn tuyển dụng</h2>
                </div>
              </div>

              <form
                onSubmit={handleUpdateJob}
                className="job-detail-form-grid"
                style={{ display: "grid", gap: 18 }}
              >
                <div className="form-group">
                  <label className="form-label">Tiêu đề</label>
                  <input
                    className="input"
                    value={jobForm?.title || ""}
                    onChange={(e) => handleJobFormChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Loại việc làm</label>
                  <select
                    className="select"
                    value={jobForm?.employmentType || "PART_TIME"}
                    onChange={(e) =>
                      handleJobFormChange("employmentType", e.target.value)
                    }
                  >
                    <option value="PART_TIME">PART_TIME</option>
                    <option value="SHIFT_BASED">SHIFT_BASED</option>
                    <option value="SEASONAL">SEASONAL</option>
                    <option value="TEMPORARY">TEMPORARY</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Mô tả công việc</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    value={jobForm?.jobDescription || ""}
                    onChange={(e) =>
                      handleJobFormChange("jobDescription", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Yêu cầu</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    value={jobForm?.requirements || ""}
                    onChange={(e) =>
                      handleJobFormChange("requirements", e.target.value)
                    }
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Quyền lợi</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    value={jobForm?.benefits || ""}
                    onChange={(e) =>
                      handleJobFormChange("benefits", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lương tối thiểu</label>
                  <input
                    type="number"
                    className="input"
                    value={jobForm?.hourlyWageMin ?? ""}
                    onChange={(e) =>
                      handleJobFormChange("hourlyWageMin", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lương tối đa</label>
                  <input
                    type="number"
                    className="input"
                    value={jobForm?.hourlyWageMax ?? ""}
                    onChange={(e) =>
                      handleJobFormChange("hourlyWageMax", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Số lượng tuyển</label>
                  <input
                    type="number"
                    className="input"
                    value={jobForm?.vacancyCount ?? ""}
                    onChange={(e) =>
                      handleJobFormChange("vacancyCount", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tiền tệ</label>
                  <input
                    className="input"
                    value={jobForm?.currency || "VND"}
                    onChange={(e) =>
                      handleJobFormChange("currency", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tuổi tối thiểu</label>
                  <input
                    type="number"
                    className="input"
                    value={jobForm?.minAge ?? ""}
                    onChange={(e) =>
                      handleJobFormChange("minAge", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tuổi tối đa</label>
                  <input
                    type="number"
                    className="input"
                    value={jobForm?.maxAge ?? ""}
                    onChange={(e) =>
                      handleJobFormChange("maxAge", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="select"
                    value={jobForm?.genderRequirement || "ANY"}
                    onChange={(e) =>
                      handleJobFormChange("genderRequirement", e.target.value)
                    }
                  >
                    <option value="ANY">ANY</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Hạn ứng tuyển</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={jobForm?.expiredAt || ""}
                    onChange={(e) =>
                      handleJobFormChange("expiredAt", e.target.value)
                    }
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Danh mục</label>
                  <div className="job-detail-check-grid">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="job-detail-check-item"
                      >
                        <input
                          type="checkbox"
                          checked={jobForm?.categoryIds?.includes(
                            Number(category.id)
                          )}
                          onChange={() =>
                            handleToggleMultiValue(
                              "categoryIds",
                              Number(category.id)
                            )
                          }
                        />
                        <span>{category.categoryName}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Ca làm việc</label>
                  <div className="job-detail-check-grid">
                    {shifts.map((shift) => (
                      <label
                        key={Number(shift.id)}
                        className="job-detail-check-item"
                      >
                        <input
                          type="checkbox"
                          checked={jobForm?.shiftIds?.includes(Number(shift.id))}
                          onChange={() =>
                            handleToggleMultiValue("shiftIds", Number(shift.id))
                          }
                        />
                        <span>{shift.shiftName}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="job-detail-form-actions">
                  <button
                    type="submit"
                    className="job-detail-save-btn"
                    disabled={savingJob}
                  >
                    <Save size={16} />
                    <span>{savingJob ? "Đang cập nhật..." : "Lưu cập nhật"}</span>
                  </button>

                  <button
                    type="button"
                    className="job-detail-cancel-btn"
                    onClick={handleCancelEditJob}
                    disabled={savingJob}
                  >
                    <X size={16} />
                    <span>Hủy</span>
                  </button>
                </div>
              </form>
            </section>
          )}

          {jobImages.length > 0 ? (
            <section className="job-detail-gallery-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2 className="job-block-title">Hình ảnh công việc</h2>
                </div>

                {jobImages.length > 1 ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="job-detail-gallery-nav-btn"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="job-detail-gallery-nav-btn"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="job-detail-gallery-main">
                <img
                  src={activeImage}
                  alt={`job-image-${activeImageIndex + 1}`}
                  className="job-detail-gallery-main-image"
                />

                <div className="job-detail-gallery-count-badge">
                  {activeImageIndex + 1} / {jobImages.length}
                </div>
              </div>

              <div className="job-detail-gallery-thumb-row">
                {jobImages.map((imageUrl, index) => {
                  const isActive = index === activeImageIndex;

                  return (
                    <button
                      key={`${imageUrl}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`job-detail-gallery-thumb-btn ${isActive ? "job-detail-gallery-thumb-btn-active" : ""
                        }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`job-thumb-${index + 1}`}
                        className="job-detail-gallery-thumb-image"
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="job-detail-gallery-card">
              <div className="job-detail-gallery-empty">
                <div className="job-detail-gallery-empty-icon">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h2 className="job-block-title">Hình ảnh công việc</h2>
                  <p className="job-block-desc">
                    Job post này hiện chưa có ảnh nào.
                  </p>
                </div>
              </div>
            </section>
          )}

          <section className="job-applications-card">
            <div className="job-applications-head">
              <div>
                <h2 className="job-applications-title">Danh sách đơn ứng tuyển</h2>
              </div>

              <div className="job-detail-application-count-chip">
                {applications.length} ứng viên
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="job-detail-table">
                <thead>
                  <tr>
                    <th>Ứng viên</th>
                    <th>SĐT</th>
                    <th>Ghi chú</th>
                    <th>Trạng thái</th>
                    <th>Ngày ứng tuyển</th>
                    <th>Xác nhận</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => {
                    const isPending = application.status === "PENDING";
                    const isAccepted = application.status === "ACCEPTED";
                    const isRejected = application.status === "REJECTED";

                    return (
                      <tr key={application.id}>
                        <td style={{ fontWeight: 700, color: "#0f172a" }}>
                          {application.applicantFullName}
                        </td>
                        <td>{application.contactPhone || "Chưa có"}</td>
                        <td>{application.note || "Không có"}</td>
                        <td>
                          <span
                            className={getApplicationBadgeClass(application.status)}
                          >
                            {application.status}
                          </span>
                        </td>
                        <td>{formatDate(application.appliedAt)}</td>
                        <td>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {isPending ? (
                              <>
                                <button
                                  type="button"
                                  className="job-detail-action-primary"
                                  disabled={updatingApplicationId === application.id}
                                  onClick={() =>
                                    handleUpdateApplicationStatus(
                                      application.id,
                                      "ACCEPTED"
                                    )
                                  }
                                >
                                  <CheckCircle2 size={15} />
                                  <span>ACCEPTED</span>
                                </button>

                                <button
                                  type="button"
                                  className="job-detail-action-secondary"
                                  disabled={updatingApplicationId === application.id}
                                  onClick={() =>
                                    handleUpdateApplicationStatus(
                                      application.id,
                                      "REJECTED"
                                    )
                                  }
                                >
                                  <XCircle size={15} />
                                  <span>REJECTED</span>
                                </button>
                              </>
                            ) : null}

                            {isAccepted ? (
                              <button
                                type="button"
                                className="job-detail-action-secondary"
                                disabled={updatingApplicationId === application.id}
                                onClick={() =>
                                  handleUpdateApplicationStatus(
                                    application.id,
                                    "REJECTED"
                                  )
                                }
                              >
                                <XCircle size={15} />
                                <span>Chuyển REJECTED</span>
                              </button>
                            ) : null}

                            {isRejected ? (
                              <span className="job-detail-readonly-text">
                                Không thể sửa thêm
                              </span>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="job-detail-empty">
                          Chưa có đơn ứng tuyển nào
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <style>{`
.job-detail-page-bg {
  min-height: 100vh;
  background: #ffffff;
}

          .job-detail-back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #475569;
            font-weight: 700;
            width: fit-content;
            text-decoration: none;
            padding: 8px 12px;
            border-radius: 12px;
            transition: all 0.2s ease;
          }

          .job-detail-back-link:hover {
            background: rgba(255,255,255,0.75);
            color: #0f172a;
          }

          .job-message-card {
            border-radius: 18px;
            padding: 16px 18px;
            border: 1px solid transparent;
            box-shadow: 0 8px 24px rgba(15,23,42,0.04);
            backdrop-filter: blur(8px);
          }

          .job-message-card-error {
            background: rgba(254, 242, 242, 0.92);
            border-color: #fecaca;
            color: #b91c1c;
          }

          .job-message-card-success {
            background: rgba(240, 253, 244, 0.95);
            border-color: #bbf7d0;
            color: #15803d;
          }

          .job-detail-hero {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 20px;
            flex-wrap: wrap;
            padding: 30px;
            border-radius: 30px;
            background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,253,244,0.78) 100%);
            border: 1px solid #d8f3e4;
            box-shadow: 0 20px 42px rgba(16,185,129,0.07);
            backdrop-filter: blur(10px);
          }

          .job-detail-hero-left {
            min-width: 0;
            flex: 1;
          }

          .job-detail-hero-title-wrap {
            display: flex;
            align-items: flex-start;
            gap: 14px;
          }

          .job-detail-hero-icon {
            width: 54px;
            height: 54px;
            border-radius: 18px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #dcfce7 0%, #ecfdf5 100%);
            color: #059669;
            flex-shrink: 0;
            border: 1px solid #bbf7d0;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.92);
          }

          .job-detail-hero-title {
            margin: 0;
            font-size: clamp(30px, 4vw, 38px);
            font-weight: 900;
            line-height: 1.12;
            letter-spacing: -0.03em;
            color: #0f172a;
          }

          .job-detail-hero-address {
            margin-top: 12px;
            display: inline-flex;
            align-items: flex-start;
            gap: 8px;
            color: #64748b;
            font-size: 15px;
            line-height: 1.7;
          }

          .job-detail-hero-right {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          .job-detail-top-primary-btn,
          .job-detail-top-secondary-btn {
            min-height: 46px;
            padding: 0 18px;
            border-radius: 14px;
            border: 1px solid transparent;
            font-size: 14px;
            font-weight: 800;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .job-detail-top-primary-btn {
            background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
            color: #ffffff;
            box-shadow: 0 12px 28px rgba(16,185,129,0.22);
          }

          .job-detail-top-primary-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 16px 32px rgba(16,185,129,0.28);
          }

          .job-detail-top-secondary-btn {
            background: rgba(255,255,255,0.95);
            color: #334155;
            border-color: #dbe4ea;
          }

          .job-detail-top-secondary-btn:hover {
            background: #f8fafc;
          }

          .job-detail-summary-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 20px;
          }

          .job-detail-summary-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 28px rgba(15,23,42,0.05);
}

          .job-detail-summary-label {
            margin: 0 0 8px 0;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #059669;
          }

          .job-detail-summary-value {
            margin: 0;
            font-size: 22px;
            font-weight: 900;
            color: #0f172a;
            line-height: 1.35;
          }

          .job-detail-status {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 14px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.04em;
          }

          .job-detail-status-active {
            background: #dcfce7;
            color: #15803d;
          }

          .job-detail-status-warning {
            background: #fef3c7;
            color: #b45309;
          }

          .job-detail-status-default {
            background: #f1f5f9;
            color: #64748b;
          }

          .job-detail-overview-card,
          .job-detail-edit-card,
          .job-detail-gallery-card,
          .job-applications-card {
            border-radius: 30px;
            border: 1px solid #d8f3e4;
            background: rgba(255,255,255,0.96);
            box-shadow: 0 18px 40px rgba(16,185,129,0.06);
            backdrop-filter: blur(10px);
          }

          .job-detail-overview-card {
            padding: 30px;
          }

          .job-detail-edit-card {
            padding: 30px;
            background: linear-gradient(180deg, rgba(240,253,244,0.72) 0%, rgba(255,255,255,0.98) 100%);
          }

          .job-detail-section-head {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
            margin-bottom: 24px;
          }

          .job-detail-section-title {
            margin: 0;
            font-size: 30px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.02em;
          }

          .job-detail-section-desc {
            margin: 8px 0 0 0;
            color: #64748b;
            font-size: 14px;
            line-height: 1.7;
          }

          .job-detail-inline-edit-btn {
            min-height: 42px;
            padding: 0 15px;
            border-radius: 12px;
            border: 1px solid #bbf7d0;
            background: #ecfdf5;
            color: #059669;
            font-size: 14px;
            font-weight: 800;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .job-detail-inline-edit-btn:hover {
            background: #dff7ea;
          }

          .job-detail-form-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .job-detail-check-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
          }

          .job-detail-check-item {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 11px 14px;
            border-radius: 14px;
            border: 1px solid #d8f3e4;
            background: #f7fdfa;
            color: #166534;
            font-size: 14px;
            font-weight: 600;
          }

          .job-detail-check-item input {
            margin: 0;
            accent-color: #10b981;
          }

          .job-detail-info-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          }

          .job-overview-info-box {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 18px;
  box-shadow: 0 4px 14px rgba(15,23,42,0.04);
  transition: all 0.2s ease;
}

          .job-overview-info-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 22px rgba(16,185,129,0.10);
          }

          .job-overview-info-label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            color: #059669;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .job-overview-info-value {
            font-weight: 800;
            color: #0f172a;
            line-height: 1.6;
          }

          .job-detail-content-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .job-overview-section-card {
  background: #ffffff;
  border-radius: 22px;
  border: 1px solid #e2e8f0;
  padding: 22px;
}

          .job-overview-section-title {
            margin: 0 0 14px 0;
            font-size: 20px;
            font-weight: 800;
            color: #059669;
          }

          .job-overview-section-list {
            margin: 0;
            padding-left: 18px;
            color: #475569;
            line-height: 1.9;
          }

          .job-detail-form-actions {
            grid-column: 1 / -1;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            padding-top: 8px;
          }

          .job-detail-save-btn,
          .job-detail-cancel-btn {
            min-width: 170px;
            height: 48px;
            border-radius: 14px;
            border: 1px solid transparent;
            font-size: 14px;
            font-weight: 800;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .job-detail-save-btn {
            background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
            color: #ffffff;
            box-shadow: 0 10px 24px rgba(16,185,129,0.22);
          }

          .job-detail-save-btn:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          .job-detail-cancel-btn {
            background: #ffffff;
            color: #334155;
            border-color: #dbe4ea;
          }

          .job-detail-cancel-btn:hover:not(:disabled) {
            background: #f8fafc;
          }

          .job-detail-save-btn:disabled,
          .job-detail-cancel-btn:disabled {
            opacity: 0.65;
            cursor: not-allowed;
          }

          .job-block-title {
            margin: 0;
            font-size: 28px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.02em;
          }

          .job-block-desc {
            margin: 8px 0 0 0;
            color: #64748b;
            font-size: 14px;
            line-height: 1.7;
          }

          .job-detail-gallery-card {
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }

          .job-detail-gallery-nav-btn {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            border: 1px solid #d8f3e4;
            background: #f4fcf7;
            display: grid;
            place-items: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #047857;
          }

          .job-detail-gallery-nav-btn:hover {
            background: #e8f8ee;
            transform: translateY(-1px);
          }

          .job-detail-gallery-main {
            position: relative;
            width: 100%;
            border-radius: 22px;
            overflow: hidden;
            border: 1px solid #d8f3e4;
            background: linear-gradient(135deg, #f5fff9 0%, #eefcf3 100%);
            box-shadow: 0 10px 30px rgba(16,185,129,0.06);
          }

          .job-detail-gallery-main-image {
            width: 100%;
            height: 460px;
            object-fit: cover;
            display: block;
          }

          .job-detail-gallery-count-badge {
            position: absolute;
            left: 16px;
            bottom: 16px;
            padding: 9px 13px;
            border-radius: 12px;
            background: rgba(15,23,42,0.66);
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            backdrop-filter: blur(8px);
          }

          .job-detail-gallery-thumb-row {
            display: flex;
            gap: 12px;
            overflow-x: auto;
            padding-bottom: 4px;
          }

          .job-detail-gallery-thumb-row::-webkit-scrollbar {
            height: 8px;
          }

          .job-detail-gallery-thumb-row::-webkit-scrollbar-thumb {
            background: #b7ebc8;
            border-radius: 999px;
          }

          .job-detail-gallery-thumb-row::-webkit-scrollbar-track {
            background: transparent;
          }

          .job-detail-gallery-thumb-btn {
            padding: 0;
            border: 1px solid #d8f3e4;
            border-radius: 16px;
            overflow: hidden;
            background: #ffffff;
            cursor: pointer;
            min-width: 132px;
            width: 132px;
            height: 90px;
            flex-shrink: 0;
            box-shadow: 0 3px 8px rgba(16,185,129,0.03);
            transition: all 0.2s ease;
          }

          .job-detail-gallery-thumb-btn-active {
            border: 2px solid #10b981;
            box-shadow: 0 10px 22px rgba(16,185,129,0.16);
            transform: translateY(-1px);
          }

          .job-detail-gallery-thumb-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .job-detail-gallery-empty {
            min-height: 160px;
            display: flex;
            align-items: center;
            gap: 16px;
            border: 1px dashed #c8ead5;
            border-radius: 20px;
            background: linear-gradient(135deg, #f8fffb 0%, #f1fbf5 100%);
            padding: 24px;
          }

          .job-detail-gallery-empty-icon {
            width: 54px;
            height: 54px;
            border-radius: 16px;
            background: #ffffff;
            border: 1px solid #d8f3e4;
            color: #059669;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .job-applications-head {
            padding: 28px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
            border-bottom: 1px solid #edf7f1;
          }

          .job-applications-title {
            margin: 0;
            font-size: 28px;
            font-weight: 900;
            color: #0f172a;
          }

          .job-applications-desc {
            margin: 8px 0 0 0;
            color: #64748b;
            font-size: 14px;
            line-height: 1.7;
          }

          .job-detail-table {
            width: 100%;
            border-collapse: collapse;
          }

          .job-detail-table thead tr {
            background: #f5fcf8;
          }

          .job-detail-table th {
            padding: 16px 24px;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #059669;
            text-align: left;
            border-bottom: 1px solid #e6f3eb;
          }

          .job-detail-table td {
            padding: 18px 24px;
            font-size: 14px;
            color: #475569;
            border-bottom: 1px solid #f0f7f3;
            vertical-align: middle;
          }

          .job-detail-table tbody tr:hover {
            background: #fbfffc;
          }

          .job-detail-app-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 5px 9px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.05em;
          }

          .job-detail-app-badge-pending {
            background: #fef3c7;
            color: #b45309;
          }

          .job-detail-app-badge-accepted {
            background: #dcfce7;
            color: #15803d;
          }

          .job-detail-app-badge-rejected {
            background: #f1f5f9;
            color: #64748b;
          }

          .job-detail-app-badge-default {
            background: #f1f5f9;
            color: #64748b;
          }

          .job-detail-action-primary,
          .job-detail-action-secondary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            min-height: 36px;
            padding: 0 12px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 800;
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .job-detail-action-primary {
            background: #10b981;
            color: #ffffff;
          }

          .job-detail-action-primary:hover:not(:disabled) {
            background: #059669;
          }

          .job-detail-action-secondary {
            background: #f8fafc;
            color: #334155;
            border-color: #dbe4ea;
          }

          .job-detail-action-secondary:hover:not(:disabled) {
            background: #eef2f7;
          }

          .job-detail-action-primary:disabled,
          .job-detail-action-secondary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .job-detail-readonly-text {
            font-size: 14px;
            color: #94a3b8;
            font-style: italic;
            font-weight: 600;
          }

          .job-detail-empty {
            padding: 36px 20px;
            text-align: center;
            color: #64748b;
            font-weight: 600;
          }

          .job-detail-application-count-chip {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 40px;
            padding: 0 14px;
            border-radius: 999px;
            background: #f0fdf4;
            color: #059669;
            font-size: 13px;
            font-weight: 800;
            border: 1px solid #ccefd9;
          }

          @media (max-width: 1024px) {
            .job-detail-summary-grid,
            .job-detail-form-grid,
            .job-detail-info-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            .job-detail-hero,
            .job-detail-overview-card,
            .job-detail-edit-card,
            .job-detail-gallery-card {
              padding: 20px;
            }

            .job-detail-hero-title {
              font-size: 28px;
            }

            .job-detail-section-title,
            .job-applications-title,
            .job-block-title {
              font-size: 24px;
            }

            .job-detail-gallery-main-image {
              height: 320px;
            }

            .job-applications-head {
              padding: 20px;
            }
          }

          @media (max-width: 640px) {
            .job-detail-gallery-thumb-btn {
              min-width: 100px;
              width: 100px;
              height: 72px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default EmployerJobPostDetailPage;