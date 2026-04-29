import { useEffect, useRef, useState } from "react";
import {
  Filter,
  BadgeDollarSign,
  Briefcase,
  MapPin,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  getJobCategoriesService,
  getWorkShiftsService,
} from "../../services/jobService";

const initialForm = {
  categoryId: "",
  shiftId: "",
  title: "",
  storeName: "",
  city: "",
  district: "",
  ward: "",
  streetAddress: "",
  minHourlyWage: "",
  maxHourlyWage: "",
};

function JobSearchForm({ onSearch, onReset }) {
  const [formData, setFormData] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [workShifts, setWorkShifts] = useState([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    async function fetchFilters() {
      try {
        const [categoriesRes, shiftsRes] = await Promise.all([
          getJobCategoriesService(),
          getWorkShiftsService(),
        ]);

        setCategories(categoriesRes?.result || []);
        setWorkShifts(shiftsRes?.result || []);
      } catch (error) {
        console.error("Load filters error:", error);
      }
    }

    fetchFilters();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function buildPayload(data = formData) {
    const payload = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value !== "") {
        if (
          key === "categoryId" ||
          key === "shiftId" ||
          key === "minHourlyWage" ||
          key === "maxHourlyWage"
        ) {
          payload[key] = Number(value);
        } else {
          payload[key] = value.trim();
        }
      }
    });

    return payload;
  }

  function handleReset() {
    setFormData(initialForm);
    onReset();
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      const payload = buildPayload(formData);
      const isEmpty = Object.keys(payload).length === 0;

      if (isEmpty) {
        onReset();
      } else {
        onSearch(payload);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, onSearch, onReset]);

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="job-search-premium-form"
      >


        <div className="job-search-premium-section">
          <div className="job-search-premium-section-head">
            <Briefcase size={16} />
            <span>Thông tin cơ bản</span>
          </div>

          <div className="form-group">
            <label className="form-label">Tên công việc</label>
            <input
              className="input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ví dụ: phục vụ, pha chế..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tên cửa hàng</label>
            <input
              className="input"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="Ví dụ: Highlands, Phúc Long..."
            />
          </div>

          <div className="job-search-premium-grid">
            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <select
                className="select"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">Tất cả</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ca làm</label>
              <select
                className="select"
                name="shiftId"
                value={formData.shiftId}
                onChange={handleChange}
              >
                <option value="">Tất cả</option>
                {workShifts.map((item, index) => (
                  <option key={`${item.shiftName}-${index}`} value={item.id}>
                    {item.shiftName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="job-search-premium-section">
          <div className="job-search-premium-section-head">
            <BadgeDollarSign size={16} />
            <span>Mức lương theo giờ</span>
          </div>

          <div className="job-search-premium-grid">
            <div className="form-group">
              <label className="form-label">Từ</label>
              <input
                className="input"
                type="number"
                name="minHourlyWage"
                value={formData.minHourlyWage}
                onChange={handleChange}
                placeholder="20000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Đến</label>
              <input
                className="input"
                type="number"
                name="maxHourlyWage"
                value={formData.maxHourlyWage}
                onChange={handleChange}
                placeholder="35000"
              />
            </div>
          </div>
        </div>

        <div className="job-search-premium-section">
          <div className="job-search-premium-section-head">
            <MapPin size={16} />
            <span>Khu vực làm việc</span>
          </div>

          <div className="form-group">
            <label className="form-label">Thành phố</label>
            <input
              className="input"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ví dụ: Đà Nẵng, Hà Nội..."
            />
          </div>

          <div className="job-search-premium-stack">
            <div className="form-group">
              <label className="form-label">Quận / Huyện</label>
              <input
                className="input"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Ví dụ: Hải Châu"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phường / Xã</label>
              <input
                className="input"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                placeholder="Ví dụ: Phước Ninh"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Địa chỉ đường</label>
            <input
              className="input"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              placeholder="Ví dụ: 12 Lê Duẩn"
            />
          </div>
        </div>

        <div className="job-search-premium-actions">
          <button
            className="job-search-reset-btn"
            type="button"
            onClick={handleReset}
          >
            <RotateCcw size={16} />
            <span>Xóa tất cả lọc</span>
          </button>
        </div>
      </form>

      <style>{`
        .job-search-premium-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .job-search-premium-hero {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border-radius: 20px;
          background: linear-gradient(135deg, #ecfdf5 0%, #f8fafc 100%);
          border: 1px solid #d1fae5;
        }

        .job-search-premium-hero-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #ffffff;
          border: 1px solid #d1fae5;
          color: #059669;
          flex-shrink: 0;
        }

        .job-search-premium-title {
          margin: 0;
          font-size: 20px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .job-search-premium-subtitle {
          margin: 6px 0 0 0;
          font-size: 13px;
          line-height: 1.7;
          color: #64748b;
        }

        .job-search-premium-section {
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          background: #ffffff;
          padding: 18px;
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.03);
        }

        .job-search-premium-section-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
        }

        .job-search-premium-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .job-search-premium-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .job-search-premium-actions {
          display: grid;
          gap: 10px;
        }

        .job-search-submit-btn,
        .job-search-reset-btn {
          min-height: 48px;
          border-radius: 16px;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .job-search-submit-btn {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          color: #ffffff;
          box-shadow: 0 14px 26px rgba(16,185,129,0.2);
        }

        .job-search-submit-btn:hover {
          transform: translateY(-1px);
        }

        .job-search-reset-btn {
          background: #f8fafc;
          color: #334155;
          border-color: #e2e8f0;
        }

        .job-search-reset-btn:hover {
          background: #f1f5f9;
        }

        @media (max-width: 640px) {
          .job-search-premium-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

export default JobSearchForm;