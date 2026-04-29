import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Plus,
  MapPin,
  Store,
  Star,
  MessageSquare,
  PencilLine,
  Save,
  X,
  Phone,
  FileText,
  Building2,
  MapPinned,
  BriefcaseBusiness,
  Users,
  Sparkles,
  Clock3,
} from "lucide-react";
import {
  countApplicationsByJobPostService,
  createEmployerJobPostService,
  getEmployerJobPostsByStoreService,
  getEmployerStoreDetailService,
  updateEmployerStoreService,
} from "../services/employerService";
import {
  getJobCategoriesService,
  getWorkShiftsService,
} from "../services/jobService";
import { getProfileService } from "../services/profileService";
import { getStoreReviewsService } from "../services/storeReviewService";

function emptyJobForm(storeId = "") {
  return {
    employerId: "",
    storeId: storeId ? Number(storeId) : "",
    title: "",
    jobDescription: "",
    requirements: "",
    benefits: "",
    hourlyWageMin: "",
    hourlyWageMax: "",
    currency: "VND",
    vacancyCount: 1,
    minAge: 18,
    maxAge: 25,
    genderRequirement: "ANY",
    employmentType: "PART_TIME",
    expiredAt: "",
    categoryIds: [],
    shiftIds: [],
  };
}

function buildStoreForm(storeData) {
  return {
    storeName: storeData?.storeName || "",
    phoneContact: storeData?.phoneContact || "",
    description: storeData?.description || "",
    city: storeData?.city || "",
    district: storeData?.district || "",
    ward: storeData?.ward || "",
    streetAddress: storeData?.streetAddress || "",
    latitude: storeData?.latitude ?? "",
    longitude: storeData?.longitude ?? "",
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

function getJobStatusBadgeClass(status) {
  switch (status) {
    case "ACTIVE":
      return "store-job-badge store-job-badge-active";
    case "INACTIVE":
    case "CLOSED":
    case "EXPIRED":
      return "store-job-badge store-job-badge-warning";
    default:
      return "store-job-badge store-job-badge-neutral";
  }
}

function formatPostedAt(dateValue) {
  if (!dateValue) return "Chưa có ngày đăng";
  try {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return `Đăng ${date.toLocaleDateString("vi-VN")}`;
  } catch {
    return dateValue;
  }
}

function formatReviewDate(dateValue) {
  if (!dateValue) return "";
  try {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString(
      "vi-VN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  } catch {
    return dateValue;
  }
}

function StarRating({ value = 0, size = 16 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = value >= star;
        const isHalf = value >= star - 0.5 && value < star;

        return (
          <span
            key={star}
            style={{
              position: "relative",
              display: "inline-flex",
              width: size,
              height: size,
            }}
          >
            <Star
              size={size}
              stroke={isFull || isHalf ? "#facc15" : "#e5e7eb"}
              fill={isFull ? "#facc15" : "#ffffff"}
            />
            {isHalf ? (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "50%",
                  overflow: "hidden",
                  display: "inline-flex",
                }}
              >
                <Star size={size} stroke="#facc15" fill="#facc15" />
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

function InfoBox({ icon, label, value, tone = "default" }) {
  return (
    <div className={`store-overview-info-box store-overview-info-box-${tone}`}>
      <div className="store-overview-info-label">
        {icon}
        <span>{label}</span>
      </div>
      <div className="store-overview-info-value">{value || "Chưa có"}</div>
    </div>
  );
}

function EmployerStoreDetailPage() {
  const { storeId } = useParams();

  const [profile, setProfile] = useState(null);
  const [store, setStore] = useState(null);
  const [storeForm, setStoreForm] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobApplicationCounts, setJobApplicationCounts] = useState({});
  const [storeReviews, setStoreReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingStore, setSavingStore] = useState(false);
  const [creatingJob, setCreatingJob] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCreateJobForm, setShowCreateJobForm] = useState(false);
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [categories, setCategories] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [jobForm, setJobForm] = useState(emptyJobForm(storeId));

  async function fetchData() {
    try {
      setLoading(true);
      setReviewsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      setReviewsError("");

      const [profileRes, storeRes, jobsRes, categoriesRes, shiftsRes, reviewsRes] =
        await Promise.all([
          getProfileService(),
          getEmployerStoreDetailService(storeId),
          getEmployerJobPostsByStoreService(storeId),
          getJobCategoriesService(),
          getWorkShiftsService(),
          getStoreReviewsService(storeId),
        ]);

      const currentProfile = profileRes?.result || null;
      const storeData = storeRes?.result;
      const jobList = jobsRes?.result || [];
      const reviewList = reviewsRes?.result || [];
      const categoryList = categoriesRes?.result || [];
      const shiftList = shiftsRes?.result || [];

      setProfile(currentProfile);
      setStore(storeData);
      setStoreForm(buildStoreForm(storeData));
      setJobs(jobList);
      setCategories(categoryList);
      setShifts(shiftList);
      setStoreReviews(reviewList);

      setJobForm({
        ...emptyJobForm(storeId),
        employerId: storeData?.employerId ?? currentProfile?.id ?? "",
        storeId: Number(storeId),
      });

      const applicationCountEntries = await Promise.all(
        jobList.map(async (job) => {
          try {
            const response = await countApplicationsByJobPostService(job.id);
            return [job.id, Number(response?.result || 0)];
          } catch {
            return [job.id, 0];
          }
        })
      );

      setJobApplicationCounts(Object.fromEntries(applicationCountEntries));
    } catch (error) {
      const message =
        error?.response?.data?.message || "Không tải được chi tiết store";
      setErrorMessage(message);
    } finally {
      setLoading(false);
      setReviewsLoading(false);
    }
  }

  async function fetchStoreReviewsOnly() {
    try {
      setReviewsLoading(true);
      setReviewsError("");
      const response = await getStoreReviewsService(storeId);
      setStoreReviews(response?.result || []);
    } catch (error) {
      setReviewsError(
        error?.response?.data?.message || "Không tải được đánh giá cửa hàng"
      );
      setStoreReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [storeId]);

  function handleStoreChange(field, value) {
    setStoreForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleStartEditStore() {
    setErrorMessage("");
    setSuccessMessage("");
    setStoreForm(buildStoreForm(store));
    setIsEditingStore(true);
  }

  function handleCancelEditStore() {
    setErrorMessage("");
    setSuccessMessage("");
    setStoreForm(buildStoreForm(store));
    setIsEditingStore(false);
  }

  async function handleUpdateStore(event) {
    event.preventDefault();

    try {
      setSavingStore(true);
      setErrorMessage("");
      setSuccessMessage("");

      const payload = {
        employerId: store?.employerId ?? profile?.id,
        storeName: storeForm.storeName.trim(),
        phoneContact: storeForm.phoneContact.trim(),
        description: storeForm.description.trim() || null,
        city: storeForm.city.trim(),
        district: storeForm.district.trim(),
        ward: storeForm.ward.trim(),
        streetAddress: storeForm.streetAddress.trim(),
        latitude: storeForm.latitude === "" ? null : Number(storeForm.latitude),
        longitude:
          storeForm.longitude === "" ? null : Number(storeForm.longitude),
      };

      const response = await updateEmployerStoreService(storeId, payload);
      const updatedStore = response?.result;

      setStore(updatedStore);
      setStoreForm(buildStoreForm(updatedStore));
      setSuccessMessage("Cập nhật store thành công");
      setIsEditingStore(false);
    } catch (error) {
      const message = error?.response?.data?.message || "Cập nhật store thất bại";
      setErrorMessage(message);
    } finally {
      setSavingStore(false);
    }
  }

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

  async function handleCreateJobPost(event) {
    event.preventDefault();

    try {
      setCreatingJob(true);
      setErrorMessage("");
      setSuccessMessage("");

      const payload = {
        employerId: Number(jobForm.employerId || store?.employerId || profile?.id),
        storeId: Number(storeId),
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

      await createEmployerJobPostService(payload);

      setSuccessMessage("Tạo tin tuyển dụng thành công");
      setJobForm({
        ...emptyJobForm(storeId),
        employerId: store?.employerId ?? profile?.id ?? "",
        storeId: Number(storeId),
      });
      setShowCreateJobForm(false);
      await fetchData();
    } catch (error) {
      const message = error?.response?.data?.message || "Tạo tin tuyển dụng thất bại";
      setErrorMessage(message);
    } finally {
      setCreatingJob(false);
    }
  }

  const mapLink = useMemo(() => {
    if (!store) return "#";
    if (store.latitude != null && store.longitude != null) {
      return `https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`;
    }
    return "#";
  }, [store]);

  const averageRating = useMemo(() => {
    if (!storeReviews.length) return 0;
    const total = storeReviews.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0
    );
    return total / storeReviews.length;
  }, [storeReviews]);

  const fullAddress = useMemo(() => {
    if (!store) return "Chưa có";
    return (
      store.fullAddress ||
      [store.streetAddress, store.ward, store.district, store.city]
        .filter(Boolean)
        .join(", ") ||
      "Chưa có"
    );
  }, [store]);

  const totalApplications = useMemo(() => {
    return jobs.reduce((sum, job) => sum + Number(jobApplicationCounts[job.id] || 0), 0);
  }, [jobs, jobApplicationCounts]);

  if (loading) {
    return (
      <div className="container page-section">
        <div className="store-loading-shell">
          <div className="store-loading-spinner" />
          <p>Đang tải chi tiết store...</p>
        </div>
      </div>
    );
  }

  if (errorMessage && !store) {
    return (
      <div className="container page-section">
        <div className="empty-state">
          <p className="error-text">{errorMessage}</p>
          <Link to="/employer" className="btn btn-secondary" style={{ marginTop: 12 }}>
            Quay lại dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container page-section"
      style={{ maxWidth: 1220, margin: "0 auto" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <Link
          to="/employer"
          className="store-back-link"
        >
          <ArrowLeft size={18} />
          <span>Quay lại dashboard employer</span>
        </Link>

        {errorMessage ? (
          <div className="store-alert-box store-alert-error">
            <p>{errorMessage}</p>
          </div>
        ) : null}

        {successMessage ? (
          <div className="store-alert-box store-alert-success">
            <p>{successMessage}</p>
          </div>
        ) : null}

        <section className="store-hero-premium">
          <div className="store-hero-premium-main">
            <div className="store-hero-badge">
              <Sparkles size={18} />
              <span>Quản lý cửa hàng</span>
            </div>

            <div className="store-hero-title-row">
              <div className="store-hero-icon">
                <Store size={22} />
              </div>

              <div style={{ minWidth: 0 }}>
                <h1 className="store-hero-title">{store?.storeName}</h1>
                <div className="store-hero-address">
                  <MapPin size={16} />
                  <span>{fullAddress}</span>
                </div>
              </div>
            </div>

            <p className="store-hero-description">
              {store?.description ||
                "Quản lý thông tin cửa hàng, theo dõi đánh giá và tạo bài đăng tuyển dụng từ một giao diện tập trung, rõ ràng và chuyên nghiệp."}
            </p>

            <div className="store-hero-actions">
              {!isEditingStore ? (
                <button
                  type="button"
                  className="store-main-primary-btn"
                  onClick={handleStartEditStore}
                >
                  <PencilLine size={16} />
                  <span>Cập nhật cửa hàng</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="store-main-secondary-btn"
                  onClick={handleCancelEditStore}
                >
                  <X size={16} />
                  <span>Hủy chỉnh sửa</span>
                </button>
              )}

              {store?.latitude != null && store?.longitude != null ? (
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="store-main-ghost-btn"
                >
                  <MapPin size={16} />
                  <span>Mở Google Maps</span>
                </a>
              ) : null}
            </div>
          </div>

          <div className="store-hero-premium-side">
            <div className="store-hero-stat-card">
              <div className="store-hero-stat-icon store-hero-stat-icon-green">
                <BriefcaseBusiness size={18} />
              </div>
              <div>
                <p className="store-hero-stat-label">Tin tuyển dụng</p>
                <p className="store-hero-stat-value">{jobs.length}</p>
              </div>
            </div>

            <div className="store-hero-stat-card">
              <div className="store-hero-stat-icon store-hero-stat-icon-emerald">
                <Users size={18} />
              </div>
              <div>
                <p className="store-hero-stat-label">Số lượng ứng tuyển chưa xử lý</p>
                <p className="store-hero-stat-value">{totalApplications}</p>
              </div>
            </div>

            <div className="store-hero-stat-card">
              <div className="store-hero-stat-icon store-hero-stat-icon-gold">
                <Star size={18} />
              </div>
              <div>
                <p className="store-hero-stat-label">Đánh giá trung bình</p>
                <p className="store-hero-stat-value">
                  {averageRating ? averageRating.toFixed(1) : "0.0"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {!isEditingStore ? (
          <section className="store-panel-card">
            <div className="store-section-head">
              <div>
                <h2 className="store-section-title">Thông tin tổng thể</h2>

              </div>

              <button
                type="button"
                className="store-inline-edit-btn"
                onClick={handleStartEditStore}
              >
                <PencilLine size={16} />
                <span>Chỉnh sửa</span>
              </button>
            </div>

            <div className="store-overview-grid">
              <InfoBox
                icon={<Building2 size={15} />}
                label="Tên cửa hàng"
                value={store?.storeName}

              />
              <InfoBox
                icon={<Phone size={15} />}
                label="Số điện thoại"
                value={store?.phoneContact}

              />
              <InfoBox
                icon={<MapPinned size={15} />}
                label="Thành phố"
                value={store?.city}

              />
              <InfoBox
                icon={<MapPinned size={15} />}
                label="Quận / Huyện"
                value={store?.district}

              />
              <InfoBox
                icon={<MapPinned size={15} />}
                label="Phường / Xã"
                value={store?.ward}

              />
              <InfoBox
                icon={<MapPin size={15} />}
                label="Địa chỉ đầy đủ"
                value={fullAddress}

              />
              <InfoBox
                icon={<MapPinned size={15} />}
                label="Latitude"
                value={store?.latitude != null ? String(store.latitude) : "Chưa có"}

              />
              <InfoBox
                icon={<MapPinned size={15} />}
                label="Longitude"
                value={store?.longitude != null ? String(store.longitude) : "Chưa có"}

              />
            </div>

            <div className="store-description-card">
              <div className="store-overview-info-label">
                <FileText size={15} />
                <span>Mô tả cửa hàng</span>
              </div>
              <p className="store-description-text">
                {store?.description || "Chưa có mô tả"}
              </p>
            </div>
          </section>
        ) : (
          <section className="store-panel-card store-panel-card-editing">
            <div className="store-section-head">
              <div>
                <h2 className="store-section-title">Chỉnh sửa cửa hàng</h2>
              </div>
            </div>

            <form
              onSubmit={handleUpdateStore}
              className="store-detail-form-grid"
              style={{ display: "grid", gap: 16 }}
            >
              <div className="form-group">
                <label className="form-label">Tên store</label>
                <input
                  className="input"
                  value={storeForm?.storeName || ""}
                  onChange={(e) => handleStoreChange("storeName", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input
                  className="input"
                  value={storeForm?.phoneContact || ""}
                  onChange={(e) => handleStoreChange("phoneContact", e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Mô tả</label>
                <textarea
                  className="textarea"
                  rows={4}
                  value={storeForm?.description || ""}
                  onChange={(e) => handleStoreChange("description", e.target.value)}
                />
              </div>

              <div
                className="store-detail-address-grid"
                style={{ gridColumn: "1 / -1" }}
              >
                <div className="form-group">
                  <label className="form-label">Thành phố</label>
                  <input
                    className="input"
                    value={storeForm?.city || ""}
                    onChange={(e) => handleStoreChange("city", e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Quận/Huyện</label>
                  <input
                    className="input"
                    value={storeForm?.district || ""}
                    onChange={(e) => handleStoreChange("district", e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phường/Xã</label>
                  <input
                    className="input"
                    value={storeForm?.ward || ""}
                    onChange={(e) => handleStoreChange("ward", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Địa chỉ đường</label>
                <input
                  className="input"
                  value={storeForm?.streetAddress || ""}
                  onChange={(e) => handleStoreChange("streetAddress", e.target.value)}
                  required
                />
              </div>

              <div
                className="store-detail-coord-grid"
                style={{ gridColumn: "1 / -1" }}
              >
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    className="input"
                    value={storeForm?.latitude ?? ""}
                    onChange={(e) => handleStoreChange("latitude", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    className="input"
                    value={storeForm?.longitude ?? ""}
                    onChange={(e) => handleStoreChange("longitude", e.target.value)}
                  />
                </div>
              </div>

              <div className="store-detail-form-actions">
                <button className="store-detail-save-btn" disabled={savingStore}>
                  <Save size={16} />
                  <span>{savingStore ? "Đang cập nhật..." : "Lưu cập nhật"}</span>
                </button>

                <button
                  type="button"
                  className="store-detail-cancel-btn"
                  onClick={handleCancelEditStore}
                  disabled={savingStore}
                >
                  <X size={16} />
                  <span>Hủy</span>
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="store-panel-card">
          <div className="store-section-head">
            <div>
              <h2 className="store-section-title">Đánh giá cửa hàng</h2>
            </div>

            <div className="store-review-summary-box">
              <div className="store-review-summary-top">
                <Star size={18} color="#f59e0b" fill="#f59e0b" />
                <span>{averageRating ? averageRating.toFixed(1) : "0.0"}</span>
              </div>
              <p>{storeReviews.length} đánh giá</p>
            </div>
          </div>

          {reviewsLoading ? (
            <div className="store-review-empty">
              <p>Đang tải đánh giá cửa hàng...</p>
            </div>
          ) : reviewsError ? (
            <div className="store-review-empty">
              <p style={{ color: "#dc2626", fontWeight: 700 }}>{reviewsError}</p>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: 14, borderRadius: 12 }}
                onClick={fetchStoreReviewsOnly}
              >
                Tải lại đánh giá
              </button>
            </div>
          ) : storeReviews.length === 0 ? (
            <div className="store-review-empty">
              <div className="store-review-empty-icon">
                <MessageSquare size={26} />
              </div>
              <h3>Chưa có đánh giá nào</h3>
            </div>
          ) : (
            <div className="store-review-list">
              {storeReviews.map((review, index) => (
                <div
                  key={`${review.displayName}-${review.createAt}-${index}`}
                  className="store-review-card"
                >
                  <div className="store-review-header">
                    <div style={{ minWidth: 0 }}>
                      <div className="store-review-user-name">
                        {review.displayName || "Người dùng"}
                      </div>
                      <div className="store-review-rating-row">
                        <StarRating value={Number(review.rating) || 0} size={16} />
                        <span>{Number(review.rating) || 0}/5</span>
                      </div>
                    </div>

                    <div className="store-review-date">
                      {formatReviewDate(review.createAt)}
                    </div>
                  </div>

                  <p className="store-review-comment">
                    {review.comment || "Không có nội dung đánh giá."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="store-section-head">
            <div>
              <h2 className="store-section-title">Danh sách tin tuyển dụng</h2>
            </div>

            <button
              type="button"
              className="store-create-job-btn"
              onClick={() => setShowCreateJobForm((prev) => !prev)}
            >
              <Plus size={16} />
              {showCreateJobForm ? "Ẩn form tạo tin tuyển dụng" : "Tạo tin tuyển dụng mới"}
            </button>
          </div>

          {showCreateJobForm ? (
            <section className="store-panel-card store-create-job-panel">
              <div style={{ marginBottom: 20 }}>
                <h3 className="store-create-job-title">Tạo tin tuyển dụng mới</h3>
              </div>

              <form
                onSubmit={handleCreateJobPost}
                className="store-detail-form-grid"
                style={{ display: "grid", gap: 16 }}
              >
                <div className="form-group">
                  <label className="form-label">Tiêu đề job</label>
                  <input
                    className="input"
                    value={jobForm.title}
                    onChange={(e) => handleJobFormChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Loại việc làm</label>
                  <select
                    className="select"
                    value={jobForm.employmentType}
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
                    value={jobForm.jobDescription}
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
                    value={jobForm.requirements}
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
                    value={jobForm.benefits}
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
                    value={jobForm.hourlyWageMin}
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
                    value={jobForm.hourlyWageMax}
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
                    value={jobForm.vacancyCount}
                    onChange={(e) =>
                      handleJobFormChange("vacancyCount", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tiền tệ</label>
                  <input
                    className="input"
                    value={jobForm.currency}
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
                    value={jobForm.minAge}
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
                    value={jobForm.maxAge}
                    onChange={(e) =>
                      handleJobFormChange("maxAge", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="select"
                    value={jobForm.genderRequirement}
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
                    value={jobForm.expiredAt}
                    onChange={(e) =>
                      handleJobFormChange("expiredAt", e.target.value)
                    }
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Danh mục</label>
                  <div className="store-detail-check-grid">
                    {categories.map((category) => (
                      <label
                        key={Number(category.id)}
                        className="store-detail-check-item"
                      >
                        <input
                          type="checkbox"
                          checked={jobForm.categoryIds.includes(Number(category.id))}
                          onChange={() =>
                            handleToggleMultiValue("categoryIds", Number(category.id))
                          }
                        />
                        <span>{category.categoryName}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Ca làm việc</label>
                  <div className="store-detail-check-grid">
                    {shifts.map((shift, index) => {
                      const shiftId = Number(shift.id);
                      return (
                        <label
                          key={
                            Number.isFinite(shiftId)
                              ? shiftId
                              : `${shift.shiftName}-${index}`
                          }
                          className="store-detail-check-item"
                        >
                          <input
                            type="checkbox"
                            checked={jobForm.shiftIds.includes(shiftId)}
                            onChange={() =>
                              handleToggleMultiValue("shiftIds", shiftId)
                            }
                          />
                          <span>{shift.shiftName}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="store-detail-form-actions">
                  <button className="store-detail-save-btn" disabled={creatingJob}>
                    <Save size={16} />
                    <span>{creatingJob ? "Đang tạo..." : "Lưu tin tuyển dụng"}</span>
                  </button>
                  <button
                    type="button"
                    className="store-detail-cancel-btn"
                    onClick={() => {
                      setShowCreateJobForm(false);
                      setJobForm({
                        ...emptyJobForm(storeId),
                        employerId: store?.employerId ?? profile?.id ?? "",
                        storeId: Number(storeId),
                      });
                    }}
                  >
                    <X size={16} />
                    <span>Hủy</span>
                  </button>
                </div>
              </form>
            </section>
          ) : null}

          <section className="store-job-table-shell">
            <div className="store-job-table-wrap">
              <table className="store-detail-table">
                <thead>
                  <tr>
                    <th>Tiêu đề tin tuyển dụng</th>
                    <th>Mức lương</th>
                    <th>Đơn ứng tuyển</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div className="store-job-title-cell">{job.title}</div>
                          <div className="store-job-date-cell">
                            <Clock3 size={13} />
                            <span>{formatPostedAt(job.publishedAt)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="store-job-salary-cell">{formatSalary(job)}</td>

                      <td>
                        <span className="store-job-apply-pill">
                          {jobApplicationCounts[job.id] ?? 0} apply
                        </span>
                      </td>

                      <td>
                        <span className={getJobStatusBadgeClass(job.status)}>
                          {job.status}
                        </span>
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <Link
                          to={`/employer/job-posts/${job.id}`}
                          state={{ storeId: Number(storeId) }}
                          className="store-detail-action-btn"
                        >
                          <Eye size={16} />
                          <span>Chi tiết</span>
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="store-detail-empty">
                          <div className="store-detail-empty-icon">
                            <Plus size={28} />
                          </div>
                          <h3>Store này chưa có tin tuyển dụng nào</h3>
                          <p>
                            Bắt đầu thu hút ứng viên bằng cách tạo tin tuyển dụng đầu tiên
                            cho cửa hàng của bạn.
                          </p>
                          <button
                            type="button"
                            className="store-create-job-btn"
                            style={{ marginTop: 18 }}
                            onClick={() => setShowCreateJobForm(true)}
                          >
                            <Plus size={16} />
                            <span>Tạo mới tin tuyển dụng</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>

      <style>{`
        .store-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          font-weight: 700;
          width: fit-content;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .store-back-link:hover {
          color: #059669;
          transform: translateX(-2px);
        }

        .store-alert-box {
          border-radius: 18px;
          padding: 16px 18px;
          border: 1px solid transparent;
          box-shadow: 0 8px 20px rgba(15,23,42,0.04);
        }

        .store-alert-box p {
          margin: 0;
          font-weight: 700;
        }

        .store-alert-error {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .store-alert-error p {
          color: #b91c1c;
        }

        .store-alert-success {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .store-alert-success p {
          color: #15803d;
        }

        .store-loading-shell {
          min-height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          box-shadow: 0 14px 32px rgba(15,23,42,0.05);
        }

        .store-loading-shell p {
          margin: 0;
          color: #64748b;
          font-weight: 700;
        }

        .store-loading-spinner {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 4px solid #dcfce7;
          border-top-color: #10b981;
          animation: storeSpin 0.8s linear infinite;
        }

        @keyframes storeSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .store-hero-premium {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.8fr);
          gap: 20px;
          align-items: stretch;
        }

        .store-hero-premium-main,
        .store-hero-premium-side {
          background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%);
          border: 1px solid #e2e8f0;
          border-radius: 30px;
          box-shadow: 0 18px 40px rgba(15,23,42,0.06);
        }

        .store-hero-premium-main {
          padding: 30px;
        }

        .store-hero-premium-side {
          padding: 22px;
          display: grid;
          gap: 14px;
          align-content: start;
        }

        .store-hero-badge {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 34px;
          padding: 0 12px;
          border-radius: 999px;
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
          color: #047857;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 18px;
        }

        .store-hero-title-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .store-hero-icon {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          color: #ffffff;
          flex-shrink: 0;
          box-shadow: 0 14px 28px rgba(16,185,129,0.25);
        }

        .store-hero-title {
          margin: 0;
          font-size: clamp(30px, 4vw, 40px);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .store-hero-address {
          margin-top: 10px;
          display: inline-flex;
          align-items: flex-start;
          gap: 8px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.75;
        }

        .store-hero-description {
          margin: 18px 0 0 0;
          color: #475569;
          font-size: 15px;
          line-height: 1.85;
          max-width: 780px;
          white-space: pre-line;
        }

        .store-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 22px;
        }

        .store-main-primary-btn,
        .store-main-secondary-btn,
        .store-main-ghost-btn,
        .store-create-job-btn {
          min-height: 46px;
          padding: 0 16px;
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
          text-decoration: none;
        }

        .store-main-primary-btn,
        .store-create-job-btn {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          color: #ffffff;
          box-shadow: 0 12px 26px rgba(16,185,129,0.22);
        }

        .store-main-primary-btn:hover,
        .store-create-job-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 30px rgba(16,185,129,0.26);
        }

        .store-main-secondary-btn {
          background: #ffffff;
          color: #334155;
          border-color: #e2e8f0;
        }

        .store-main-secondary-btn:hover {
          background: #f8fafc;
        }

        .store-main-ghost-btn {
          background: #f8fafc;
          color: #065f46;
          border-color: #d1fae5;
        }

        .store-main-ghost-btn:hover {
          background: #ecfdf5;
        }

        .store-hero-stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border-radius: 22px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .store-hero-stat-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .store-hero-stat-icon-green {
          background: #ecfdf5;
          color: #059669;
        }

        .store-hero-stat-icon-emerald {
          background: #f0fdfa;
          color: #0f766e;
        }

        .store-hero-stat-icon-gold {
          background: #fffbeb;
          color: #d97706;
        }

        .store-hero-stat-label {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
        }

        .store-hero-stat-value {
          margin: 4px 0 0 0;
          color: #0f172a;
          font-size: 24px;
          font-weight: 900;
          line-height: 1.15;
        }

        .store-panel-card {
          border-radius: 28px;
          padding: 28px;
          border: 1px solid #e2e8f0;
          background: linear-gradient(180deg, #ffffff 0%, #fcfefd 100%);
          box-shadow: 0 14px 36px rgba(15,23,42,0.05);
        }

        .store-panel-card-editing,
        .store-create-job-panel {
          background: linear-gradient(180deg, #fafffc 0%, #ffffff 100%);
          border-color: #d1fae5;
        }

        .store-section-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .store-section-title {
          margin: 0;
          font-size: 28px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .store-section-desc {
          margin: 8px 0 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
        }

        .store-inline-edit-btn {
          min-height: 42px;
          padding: 0 15px;
          border-radius: 12px;
          border: 1px solid #bbf7d0;
          background: #ecfdf5;
          color: #047857;
          font-size: 14px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .store-inline-edit-btn:hover {
          background: #d1fae5;
        }

        .store-overview-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .store-overview-info-box {
          border-radius: 20px;
          border: 1px solid #bbf7d0;
          transition: all 0.2s ease;
          padding: 18px;
          box-shadow: 0 6px 16px rgba(15,23,42,0.03);
        }

        .store-overview-info-box-green {
          background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%);
          border-color: #d1fae5;
        }

        .store-overview-info-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: #059669; /* xanh lá chính */
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: #ecfdf5;
          border-radius: 8px;
          width: fit-content;
        }

        .store-overview-info-value {
          font-weight: 800;
          color: #0f172a;
          line-height: 1.7;
          font-size: 15px;
        }

        .store-description-card {
          border-radius: 22px;
          border: 1px solid #e2e8f0;
          padding: 20px;
        }

        .store-description-text {
          margin: 0;
          color: #334155;
          line-height: 1.85;
          white-space: pre-line;
          font-size: 15px;
        }

        .store-detail-form-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .store-detail-address-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .store-detail-coord-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .store-detail-check-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .store-detail-check-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 14px;
          border: 1px solid #dbeafe;
          background: #ffffff;
          color: #334155;
          font-size: 14px;
          font-weight: 600;
          transition: 0.2s ease;
        }

        .store-detail-check-item:hover {
          border-color: #bbf7d0;
          background: #f0fdf4;
        }

        .store-detail-check-item input {
          margin: 0;
          accent-color: #10b981;
        }

        .store-detail-form-actions {
          grid-column: 1 / -1;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 8px;
        }

        .store-detail-save-btn,
        .store-detail-cancel-btn {
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

        .store-detail-save-btn {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(16,185,129,0.22);
        }

        .store-detail-save-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .store-detail-cancel-btn {
          background: #ffffff;
          color: #334155;
          border-color: #e2e8f0;
        }

        .store-detail-cancel-btn:hover:not(:disabled) {
          background: #f8fafc;
        }

        .store-detail-save-btn:disabled,
        .store-detail-cancel-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .store-review-summary-box {
          min-width: 150px;
          padding: 14px 18px;
          border-radius: 20px;
          background: linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%);
          border: 1px solid #fde68a;
          text-align: center;
        }

        .store-review-summary-top {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .store-review-summary-top span {
          font-size: 24px;
          font-weight: 900;
          color: #0f172a;
        }

        .store-review-summary-box p {
          margin: 4px 0 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .store-review-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .store-review-card {
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 18px;
          background: linear-gradient(180deg, #ffffff 0%, #fbfefd 100%);
        }

        .store-review-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 10px;
        }

        .store-review-user-name {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .store-review-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .store-review-rating-row span {
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
        }

        .store-review-date {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 600;
          text-align: right;
        }

        .store-review-comment {
          margin: 0;
          color: #334155;
          font-size: 15px;
          line-height: 1.8;
          white-space: pre-line;
        }

        .store-review-empty {
          min-height: 190px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px dashed #d1d5db;
          border-radius: 20px;
          background: #f8fafc;
          padding: 24px;
        }

        .store-review-empty p {
          margin: 0;
          color: #64748b;
          font-weight: 600;
        }

        .store-review-empty h3 {
          margin: 0;
          color: #0f172a;
          font-size: 20px;
          font-weight: 800;
        }

        .store-review-empty-icon {
          width: 56px;
          height: 56px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #94a3b8;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .store-job-table-shell {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 10px 26px rgba(15,23,42,0.05);
        }

        .store-job-table-wrap {
          overflow-x: auto;
        }

        .store-detail-table {
          width: 100%;
          border-collapse: collapse;
        }

        .store-detail-table thead tr {
  background: #eefaf3;
}

.store-detail-table th {
  padding: 16px 24px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #059669;
  text-align: left;
  border-bottom: 1px solid #cfead8;
  white-space: nowrap;
}

        .store-detail-table td {
          padding: 18px 24px;
          font-size: 14px;
          color: #0f172a;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .store-detail-table tbody tr:hover {
          background: #fcfefc;
        }

        .store-job-title-cell {
          font-weight: 800;
          color: #0f172a;
          font-size: 15px;
        }

        .store-job-date-cell {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
        }

        .store-job-salary-cell {
          color: #166534;
          font-weight: 800;
        }

        .store-job-apply-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 86px;
          height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #334155;
          font-size: 12px;
          font-weight: 800;
        }

        .store-job-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .store-job-badge-active {
          background: rgba(34, 197, 94, 0.12);
          color: #15803d;
        }

        .store-job-badge-warning {
          background: rgba(245, 158, 11, 0.12);
          color: #d97706;
        }

        .store-job-badge-neutral {
          background: #f1f5f9;
          color: #64748b;
        }

        .store-detail-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 108px;
          height: 38px;
          padding: 0 14px;
          border-radius: 12px;
          background: #ffffff;
          color: #047857;
          border: 1px solid #bbf7d0;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .store-detail-action-btn:hover {
          background: #f0fdf4;
          border-color: #86efac;
        }

        .store-detail-empty {
          padding: 54px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .store-detail-empty h3 {
          margin: 0;
          color: #0f172a;
          font-size: 20px;
          font-weight: 800;
        }

        .store-detail-empty p {
          margin: 8px 0 0 0;
          color: #64748b;
          font-size: 14px;
          max-width: 460px;
          line-height: 1.8;
        }

        .store-detail-empty-icon {
          width: 66px;
          height: 66px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #94a3b8;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .store-create-job-title {
          margin: 0;
          font-size: 22px;
          font-weight: 900;
          color: #0f172a;
        }

        .store-create-job-desc {
          margin: 6px 0 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
        }

        @media (max-width: 1100px) {
          .store-hero-premium {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 1024px) {
          .store-detail-form-grid,
          .store-detail-address-grid,
          .store-detail-coord-grid,
          .store-overview-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .store-hero-premium-main,
          .store-hero-premium-side,
          .store-panel-card {
            padding: 20px;
          }

          .store-hero-title {
            font-size: 28px;
          }

          .store-section-title {
            font-size: 24px;
          }

          .store-review-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .store-detail-table th,
          .store-detail-table td {
            padding: 14px 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default EmployerStoreDetailPage;