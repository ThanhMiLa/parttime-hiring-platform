import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  BriefcaseBusiness,
  FileClock,
  Plus,
  Eye,
  Search,
  MapPin,
  Phone,
} from "lucide-react";
import {
  countApplicationsByStoreService,
  countEmployerActiveJobPostsService,
  countEmployerStoresService,
  countPendingApplicationsOfEmployerService,
  createEmployerStoreService,
  getEmployerStoresService,
} from "../services/employerService";
import { getProfileService } from "../services/profileService";

function emptyStoreForm() {
  return {
    storeName: "",
    phoneContact: "",
    description: "",
    city: "",
    district: "",
    ward: "",
    streetAddress: "",
    latitude: "",
    longitude: "",
  };
}

function getStoreInitials(name) {
  if (!name) return "ST";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase();
}

function getFilteredStores(stores, keyword) {
  const q = keyword.trim().toLowerCase();
  if (!q) return stores;

  return stores.filter((store) => {
    const searchable = [
      store.storeName,
      store.phoneContact,
      store.fullAddress,
      store.city,
      store.district,
      store.ward,
      store.streetAddress,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(q);
  });
}

function EmployerDashboardPage() {
  const [stores, setStores] = useState([]);
  const [storeApplicationCounts, setStoreApplicationCounts] = useState({});
  const [summary, setSummary] = useState({
    totalStores: 0,
    totalActiveJobs: 0,
    totalPendingApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState(emptyStoreForm());
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  async function fetchAllData() {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const [
        storesRes,
        countStoresRes,
        countJobsRes,
        countPendingRes,
        profileRes,
      ] = await Promise.all([
        getEmployerStoresService(),
        countEmployerStoresService(),
        countEmployerActiveJobPostsService(),
        countPendingApplicationsOfEmployerService(),
        getProfileService(),
      ]);

      const storeList = storesRes?.result || [];
      setStores(storeList);
      setProfile(profileRes?.result || null);

      setSummary({
        totalStores: Number(countStoresRes?.result || 0),
        totalActiveJobs: Number(countJobsRes?.result || 0),
        totalPendingApplications: Number(countPendingRes?.result || 0),
      });

      const countResults = await Promise.all(
        storeList.map(async (store) => {
          try {
            const response = await countApplicationsByStoreService(store.id);
            return [store.id, Number(response?.result || 0)];
          } catch {
            return [store.id, 0];
          }
        })
      );

      setStoreApplicationCounts(Object.fromEntries(countResults));
    } catch (error) {
      const message =
        error?.response?.data?.message || "Không tải được dashboard employer";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  function handleChange(field, value) {
    setCreateForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleCreateStore(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const payload = {
        employerId: profile?.id,
        storeName: createForm.storeName.trim(),
        phoneContact: createForm.phoneContact.trim(),
        description: createForm.description.trim() || null,
        city: createForm.city.trim(),
        district: createForm.district.trim(),
        ward: createForm.ward.trim(),
        streetAddress: createForm.streetAddress.trim(),
        latitude: createForm.latitude === "" ? null : Number(createForm.latitude),
        longitude:
          createForm.longitude === "" ? null : Number(createForm.longitude),
      };

      await createEmployerStoreService(payload);

      setSuccessMessage("Tạo store mới thành công");
      setCreateForm(emptyStoreForm());
      setShowCreateForm(false);
      await fetchAllData();
    } catch (error) {
      const message = error?.response?.data?.message || "Tạo store thất bại";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  const filteredStores = useMemo(
    () => getFilteredStores(stores, searchKeyword),
    [stores, searchKeyword]
  );

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
            Đang tải dashboard employer...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container page-section"
      style={{ maxWidth: 1280, margin: "0 auto" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 36,
                fontWeight: 900,
                lineHeight: 1.15,
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              Quản lý cửa hàng và bài đăng
            </h1>
            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: 16,
                lineHeight: 1.6,
              }}
            >
              Chào mừng {profile?.displayName || "Employer"} quay trở lại, đây là
              tổng quan công việc của bạn hôm nay.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowCreateForm((prev) => !prev)}
            style={{
              minWidth: 180,
              height: 48,
              borderRadius: 14,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 10px 30px rgba(19,236,182,0.18)",
            }}
          >
            <Plus size={18} />
            {showCreateForm ? "Ẩn form tạo store" : "Tạo store mới"}
          </button>
        </section>

        {errorMessage ? (
          <div
            className="card"
            style={{
              borderRadius: 20,
              borderColor: "#fecaca",
              background: "#fef2f2",
            }}
          >
            <p style={{ margin: 0, color: "#b91c1c", fontWeight: 700 }}>
              {errorMessage}
            </p>
          </div>
        ) : null}

        {successMessage ? (
          <div
            className="card"
            style={{
              borderRadius: 20,
              borderColor: "#bbf7d0",
              background: "#f0fdf4",
            }}
          >
            <p style={{ margin: 0, color: "#15803d", fontWeight: 700 }}>
              {successMessage}
            </p>
          </div>
        ) : null}

        <section className="dashboard-kpi-grid">
          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-top">
              <div className="dashboard-kpi-icon">
                <Store size={18} />
              </div>
              <span className="dashboard-kpi-chip success">Cửa hàng hiện có</span>
            </div>
            <div>
              <p className="dashboard-kpi-label">Tổng số cửa hàng</p>
              <p className="dashboard-kpi-value">{summary.totalStores}</p>
            </div>
          </div>

          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-top">
              <div className="dashboard-kpi-icon">
                <BriefcaseBusiness size={18} />
              </div>
              <span className="dashboard-kpi-chip success">Đang hoạt động</span>
            </div>
            <div>
              <p className="dashboard-kpi-label">Bài đăng đang hoạt động</p>
              <p className="dashboard-kpi-value">{summary.totalActiveJobs}</p>
            </div>
          </div>

          <div className="dashboard-kpi-card">
            <div className="dashboard-kpi-top">
              <div
                className="dashboard-kpi-icon"
                style={{
                  background: "rgba(245,158,11,0.12)",
                  color: "#d97706",
                }}
              >
                <FileClock size={18} />
              </div>
              <span className="dashboard-kpi-chip warning">Cần xử lý</span>
            </div>
            <div>
              <p className="dashboard-kpi-label">Đơn ứng tuyển cần xử lý</p>
              <p className="dashboard-kpi-value">
                {summary.totalPendingApplications}
              </p>
            </div>
          </div>
        </section>

        {showCreateForm ? (
          <section
            className="card"
            style={{
              borderRadius: 24,
              padding: 24,
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Tạo store mới
              </h2>
              <p
                style={{
                  margin: "6px 0 0 0",
                  color: "#64748b",
                  fontSize: 14,
                }}
              >
                Điền đầy đủ thông tin để thêm store mới cho employer.
              </p>
            </div>

            <form
              onSubmit={handleCreateStore}
              className="dashboard-form-grid"
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              <div className="form-group">
                <label className="form-label">Tên store</label>
                <input
                  className="input"
                  value={createForm.storeName}
                  onChange={(e) => handleChange("storeName", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input
                  className="input"
                  value={createForm.phoneContact}
                  onChange={(e) => handleChange("phoneContact", e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Mô tả</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Thành phố</label>
                <input
                  className="input"
                  value={createForm.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quận/Huyện</label>
                <input
                  className="input"
                  value={createForm.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phường/Xã</label>
                <input
                  className="input"
                  value={createForm.ward}
                  onChange={(e) => handleChange("ward", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Địa chỉ đường</label>
                <input
                  className="input"
                  value={createForm.streetAddress}
                  onChange={(e) => handleChange("streetAddress", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input
                  type="number"
                  step="any"
                  className="input"
                  value={createForm.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input
                  type="number"
                  step="any"
                  className="input"
                  value={createForm.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                />
              </div>

              <div
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 6,
                }}
              >
                <button
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ borderRadius: 12, minWidth: 140 }}
                >
                  {submitting ? "Đang tạo..." : "Lưu store"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ borderRadius: 12 }}
                  onClick={() => {
                    setShowCreateForm(false);
                    setCreateForm(emptyStoreForm());
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </section>
        ) : null}

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
          }}
        >
          <div className="dashboard-table-header">
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Danh sách store
              </h2>
              <p
                style={{
                  margin: "6px 0 0 0",
                  color: "#64748b",
                  fontSize: 14,
                }}
              >
              </p>
            </div>

            <div className="dashboard-search-box">
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Tìm kiếm store..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Tên store</th>
                  <th>Liên hệ</th>
                  <th>Địa chỉ</th>
                  <th style={{ textAlign: "center" }}>Đơn ứng tuyển</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((store) => (
                  <tr key={store.id}>
                    <td>
                      <div className="store-cell">
                        <div
                          className="store-avatar"
                          style={{
                            background: store.isActive
                              ? "rgba(19,236,182,0.12)"
                              : "#f1f5f9",
                            color: store.isActive ? "#0f766e" : "#94a3b8",
                          }}
                        >
                          {getStoreInitials(store.storeName)}
                        </div>
                        <div>
                          <div className="store-name">{store.storeName}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          color: "#475569",
                          fontSize: 14,
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Phone size={14} />
                          <span>{store.phoneContact || "Chưa có"}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "flex-start",
                          gap: 8,
                          color: "#475569",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        <MapPin size={14} style={{ marginTop: 3, flexShrink: 0 }} />
                        <span>{store.fullAddress || "Chưa có địa chỉ"}</span>
                      </div>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <span className="apply-count-pill">
                        {storeApplicationCounts[store.id] ?? 0}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          store.isActive
                            ? "status-pill status-active"
                            : "status-pill status-inactive"
                        }
                      >
                        {store.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <Link
                        to={`/employer/stores/${store.id}`}
                        className="detail-action-btn"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                        <span>Chi tiết</span>
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredStores.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="dashboard-empty-row">
                        {searchKeyword.trim()
                          ? "Không tìm thấy store phù hợp"
                          : "Chưa có store nào"}
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="dashboard-table-footer">
            <p style={{ margin: 0 }}>
              Hiển thị {filteredStores.length} trong tổng số {stores.length} store
            </p>
          </div>
        </section>
      </div>

      <style>{`
        .dashboard-kpi-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .dashboard-kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .dashboard-kpi-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .dashboard-kpi-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(19, 236, 182, 0.12);
          color: #0f766e;
        }

        .dashboard-kpi-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .dashboard-kpi-chip.success {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }

        .dashboard-kpi-chip.warning {
          background: rgba(245, 158, 11, 0.12);
          color: #d97706;
        }

        .dashboard-kpi-label {
          margin: 0 0 6px 0;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
        }

        .dashboard-kpi-value {
          margin: 0;
          color: #0f172a;
          font-size: 34px;
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .dashboard-form-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .dashboard-table-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .dashboard-search-box {
          min-width: 280px;
          height: 42px;
          padding: 0 14px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .dashboard-search-box input {
          width: 100%;
          border: none;
          background: transparent;
          outline: none;
          color: #0f172a;
          font-size: 14px;
        }

        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
        }

        .dashboard-table thead tr {
          background: #eefaf3;
        }

        .dashboard-table th {
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

        .dashboard-table td {
          padding: 18px 24px;
          font-size: 14px;
          color: #0f172a;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .dashboard-table tbody tr:hover {
          background: #fafafa;
        }

        .store-cell {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .store-avatar {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .store-name {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.4;
        }

        .store-sub {
          margin-top: 4px;
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
        }

        .apply-count-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          height: 32px;
          padding: 0 10px;
          border-radius: 999px;
          background: #ecfeff;
          color: #0f766e;
          font-weight: 800;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .status-active {
          background: rgba(19, 236, 182, 0.14);
          color: #0f766e;
        }

        .status-inactive {
          background: #f1f5f9;
          color: #64748b;
        }

        .detail-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 108px;
          height: 38px;
          padding: 0 14px;
          border-radius: 12px;
          background: #ffffff;
          color: #0f766e;
          border: 1px solid #ccfbf1;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .detail-action-btn:hover {
          background: #f0fdfa;
          border-color: #99f6e4;
        }

        .dashboard-empty-row {
          padding: 32px 16px;
          text-align: center;
          color: #64748b;
          font-weight: 600;
        }

        .dashboard-table-footer {
          padding: 16px 24px;
          border-top: 1px solid #f1f5f9;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .dashboard-kpi-grid {
            grid-template-columns: 1fr !important;
          }

          .dashboard-form-grid {
            grid-template-columns: 1fr !important;
          }

          .dashboard-search-box {
            width: 100%;
            min-width: unset;
          }
        }
      `}</style>
    </div>
  );
}

export default EmployerDashboardPage;