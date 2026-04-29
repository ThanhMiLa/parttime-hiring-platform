import { useCallback, useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Search,
  Menu,
  X,
} from "lucide-react";
import JobCard from "../components/jobs/JobCard";
import JobSearchForm from "../components/jobs/JobSearchForm";
import { getJobsService, searchJobsService } from "../services/jobService";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    number: 0,
    totalPages: 0,
    totalElements: 0,
    size: 12,
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchPayload, setSearchPayload] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const fetchJobs = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getJobsService(page, 12);
      const result = response?.result;

      setJobs(result?.content || []);
      setPageInfo({
        number: result?.number || 0,
        totalPages: result?.totalPages || 0,
        totalElements: result?.totalElements || 0,
        size: result?.size || 12,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Không tải được danh sách công việc";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (payload, page = 0) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setIsSearching(true);
      setSearchPayload(payload);
      setIsMobileFilterOpen(false);

      const response = await searchJobsService(payload, page, 12);
      const result = response?.result;

      setJobs(result?.content || []);
      setPageInfo({
        number: result?.number || 0,
        totalPages: result?.totalPages || 0,
        totalElements: result?.totalElements || 0,
        size: result?.size || 12,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Tìm kiếm công việc thất bại";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResetSearch = useCallback(() => {
    setIsSearching(false);
    setSearchPayload(null);
    setIsMobileFilterOpen(false);
    fetchJobs(0);
  }, [fetchJobs]);

  const handlePrevPage = useCallback(() => {
    if (pageInfo.number > 0) {
      const newPage = pageInfo.number - 1;
      if (isSearching && searchPayload) {
        handleSearch(searchPayload, newPage);
      } else {
        fetchJobs(newPage);
      }
    }
  }, [pageInfo.number, isSearching, searchPayload, handleSearch, fetchJobs]);

  const handleNextPage = useCallback(() => {
    if (pageInfo.number < pageInfo.totalPages - 1) {
      const newPage = pageInfo.number + 1;
      if (isSearching && searchPayload) {
        handleSearch(searchPayload, newPage);
      } else {
        fetchJobs(newPage);
      }
    }
  }, [
    pageInfo.number,
    pageInfo.totalPages,
    isSearching,
    searchPayload,
    handleSearch,
    fetchJobs,
  ]);

  useEffect(() => {
    fetchJobs(0);
  }, [fetchJobs]);

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at top left, rgba(16,185,129,0.08) 0%, transparent 20%), radial-gradient(circle at top right, rgba(59,130,246,0.06) 0%, transparent 18%), #f8fafc",
        minHeight: "100vh",
      }}
    >
      <div className="container page-section jobs-page-shell">
        <section className="jobs-hero-premium">
          <div className="jobs-hero-content">
            <div className="jobs-hero-kicker">
              <Sparkles size={14} />
              <span>Nền tảng việc làm part-time hiện đại</span>
            </div>

            <h1 className="jobs-hero-title">
              Nền tảng tìm việc part-time dành cho bạn
            </h1>

            <p className="jobs-hero-subtitle">
              Khám phá các cơ hội việc làm theo ca phù hợp với thời gian, địa điểm
              và kỹ năng của bạn một cách nhanh chóng và thuận tiện.
            </p>
          </div>

          <div className="jobs-hero-stat-card">
            <div className="jobs-hero-stat-icon">
              <BriefcaseBusiness size={18} />
            </div>

            <div>
              <p className="jobs-hero-stat-label">Việc làm đang hiển thị</p>
              <p className="jobs-hero-stat-value">{pageInfo.totalElements}</p>
            </div>
          </div>
        </section>

        <div className="jobs-layout-premium">
          <aside
            className={`jobs-sidebar-premium ${
              isMobileFilterOpen ? "jobs-sidebar-premium-open" : ""
            }`}
          >
            <div className="jobs-sidebar-shell">
              <div className="jobs-mobile-filter-header">
                <button
                  type="button"
                  className="jobs-mobile-filter-close"
                  onClick={() => setIsMobileFilterOpen(false)}
                  aria-label="Đóng bộ lọc"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="jobs-sidebar-title-row">
                <div className="jobs-sidebar-icon">
                  <SlidersHorizontal size={16} />
                </div>
                <div>
                  <h3 className="jobs-sidebar-title">Bộ lọc tìm kiếm</h3>
                  <p className="jobs-sidebar-subtitle">
                    Tinh chỉnh danh sách công việc theo nhu cầu của bạn
                  </p>
                </div>
              </div>

              <div className="jobs-sidebar-scroll">
                <JobSearchForm
                  onSearch={handleSearch}
                  onReset={handleResetSearch}
                />
              </div>
            </div>
          </aside>

          {isMobileFilterOpen ? (
            <button
              type="button"
              className="jobs-mobile-filter-backdrop"
              onClick={() => setIsMobileFilterOpen(false)}
              aria-label="Đóng bộ lọc"
            />
          ) : null}

          <main className="jobs-main-premium">
            <div className="jobs-mobile-filter-trigger-wrap">
              <button
                type="button"
                className="jobs-mobile-filter-trigger"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <Menu size={18} />
                <span>Bộ lọc tìm kiếm</span>
              </button>
            </div>

            <section className="jobs-results-toolbar">
              <div className="jobs-results-toolbar-left">
                <h2 className="jobs-results-title">Danh sách việc làm</h2>
                <p className="jobs-results-subtitle">
                  {isSearching
                    ? "Kết quả đã được lọc theo tiêu chí bạn chọn"
                    : "Các công việc mới nhất đang tuyển dụng"}
                </p>
              </div>

              <div className="jobs-results-toolbar-right">
                <div className="jobs-results-count-chip">
                  <Search size={14} />
                  <span>
                    Tìm thấy <strong>{pageInfo.totalElements}</strong> việc làm
                  </span>
                </div>

                {isSearching ? (
                  <button
                    type="button"
                    className="jobs-clear-filter-btn"
                    onClick={handleResetSearch}
                  >
                    Xóa bộ lọc
                  </button>
                ) : null}
              </div>
            </section>

            {loading ? (
              <div className="jobs-premium-state-card">
                <div className="jobs-loading-pulse" />
                <p style={{ margin: 0 }}>Đang tải danh sách công việc...</p>
              </div>
            ) : errorMessage ? (
              <div className="jobs-premium-state-card jobs-premium-error-card">
                <h3 style={{ margin: 0, color: "#b91c1c" }}>Đã xảy ra lỗi</h3>
                <p className="error-text" style={{ marginBottom: 0 }}>
                  {errorMessage}
                </p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="jobs-premium-state-card">
                <h3 style={{ margin: 0, color: "#0f172a" }}>
                  Không có công việc phù hợp
                </h3>
                <p className="muted-text" style={{ marginBottom: 0 }}>
                  Hãy thử nới lỏng điều kiện lọc hoặc đặt lại bộ lọc tìm kiếm.
                </p>
              </div>
            ) : (
              <>
                <div className="jobs-grid">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                <div className="jobs-pagination-wrap">
                  <button
                    className="jobs-pagination-btn"
                    onClick={handlePrevPage}
                    disabled={pageInfo.number === 0}
                  >
                    <ChevronLeft size={16} />
                    <span>Trang trước</span>
                  </button>

                  <div className="jobs-pagination-center">
                    <span className="jobs-pagination-page-current">
                      {pageInfo.number + 1}
                    </span>
                    <span className="jobs-pagination-separator">/</span>
                    <span className="jobs-pagination-page-total">
                      {pageInfo.totalPages || 1}
                    </span>
                  </div>

                  <button
                    className="jobs-pagination-btn jobs-pagination-btn-next"
                    onClick={handleNextPage}
                    disabled={pageInfo.number >= pageInfo.totalPages - 1}
                  >
                    <span>Trang sau</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .jobs-page-shell {
          padding-bottom: 40px;
        }

        .jobs-hero-premium {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
          padding: 24px 28px;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(10px);
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          box-shadow: 0 18px 36px rgba(15,23,42,0.05);
        }

        .jobs-hero-content {
          min-width: 0;
          flex: 1;
        }

        .jobs-hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
          border-radius: 999px;
          color: #047857;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 14px;
        }

        .jobs-hero-title {
          margin: 0;
          font-size: clamp(28px, 3.4vw, 44px);
          line-height: 1.08;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.03em;
          max-width: 920px;
        }

        .jobs-hero-subtitle {
          margin: 12px 0 0 0;
          color: #64748b;
          font-size: 15px;
          line-height: 1.75;
          max-width: 760px;
        }

        .jobs-hero-stat-card {
          width: 320px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px 18px;
          border-radius: 22px;
          background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%);
          border: 1px solid #bbf7d0;
          box-shadow: 0 12px 26px rgba(16,185,129,0.08);
        }

        .jobs-hero-stat-icon {
          width: 46px;
          height: 46px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          color: #ffffff;
          flex-shrink: 0;
          box-shadow: 0 10px 22px rgba(16,185,129,0.22);
        }

        .jobs-hero-stat-label {
          margin: 0;
          font-size: 12px;
          font-weight: 900;
          color: #047857;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .jobs-hero-stat-value {
          margin: 6px 0 0 0;
          font-size: 36px;
          line-height: 1;
          font-weight: 900;
          color: #0f172a;
        }

        .jobs-layout-premium {
          display: grid;
          grid-template-columns: 360px minmax(0, 1fr);
          gap: 28px;
          align-items: start;
          position: relative;
        }

        .jobs-sidebar-premium {
          position: sticky;
          top: 24px;
          align-self: start;
          z-index: 5;
        }

        .jobs-sidebar-shell {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          padding: 22px;
          box-shadow: 0 16px 36px rgba(15,23,42,0.06);
        }

        .jobs-sidebar-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .jobs-sidebar-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #ecfdf5;
          color: #059669;
          flex-shrink: 0;
        }

        .jobs-sidebar-title {
          margin: 0;
          font-size: 20px;
          font-weight: 900;
          color: #0f172a;
        }

        .jobs-sidebar-subtitle {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
        }

        .jobs-sidebar-scroll {
          max-height: calc(100vh - 210px);
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 6px;
        }

        .jobs-sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .jobs-sidebar-scroll::-webkit-scrollbar-thumb {
          background: #dbe4f0;
          border-radius: 999px;
        }

        .jobs-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .jobs-main-premium {
          min-width: 0;
        }

        .jobs-mobile-filter-trigger-wrap {
          display: none;
          margin-bottom: 16px;
        }

        .jobs-mobile-filter-trigger {
          min-height: 44px;
          padding: 0 14px;
          border-radius: 14px;
          border: 1px solid #dbeafe;
          background: rgba(255,255,255,0.96);
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 10px 22px rgba(15,23,42,0.04);
          cursor: pointer;
        }

        .jobs-mobile-filter-header {
          display: none;
        }

        .jobs-mobile-filter-close {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #334155;
          display: grid;
          place-items: center;
          cursor: pointer;
          margin-left: auto;
          margin-bottom: 14px;
        }

        .jobs-mobile-filter-backdrop {
          display: none;
        }

        .jobs-results-toolbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .jobs-results-toolbar-left {
          min-width: 0;
        }

        .jobs-results-title {
          margin: 0;
          font-size: 28px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .jobs-results-subtitle {
          margin: 6px 0 0 0;
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
        }

        .jobs-results-toolbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .jobs-results-count-chip {
          min-height: 42px;
          padding: 0 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.95);
          border: 1px solid #e2e8f0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          color: #334155;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(15,23,42,0.04);
        }

        .jobs-results-count-chip strong {
          color: #0f172a;
        }

        .jobs-clear-filter-btn {
          min-height: 42px;
          padding: 0 15px;
          border-radius: 999px;
          border: 1px solid #dbeafe;
          background: #eff6ff;
          color: #2563eb;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .jobs-clear-filter-btn:hover {
          background: #dbeafe;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .jobs-premium-state-card {
          background: rgba(255,255,255,0.95);
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          padding: 42px 28px;
          text-align: center;
          box-shadow: 0 14px 34px rgba(15,23,42,0.05);
        }

        .jobs-premium-error-card {
          border-color: #fecaca;
          background: #fffafa;
        }

        .jobs-loading-pulse {
          width: 58px;
          height: 58px;
          margin: 0 auto 16px;
          border-radius: 999px;
          background: linear-gradient(135deg, #10b981 0%, #93c5fd 100%);
          opacity: 0.85;
          animation: jobsPulse 1.2s infinite ease-in-out;
        }

        .jobs-pagination-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          padding-top: 32px;
        }

        .jobs-pagination-btn {
          min-height: 46px;
          padding: 0 16px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: rgba(255,255,255,0.97);
          color: #334155;
          font-size: 14px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(15,23,42,0.04);
          transition: all 0.2s ease;
        }

        .jobs-pagination-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          border-color: #cbd5e1;
        }

        .jobs-pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .jobs-pagination-btn-next {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 14px 26px rgba(16,185,129,0.2);
        }

        .jobs-pagination-center {
          min-height: 46px;
          min-width: 132px;
          padding: 0 18px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: rgba(255,255,255,0.97);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 10px 22px rgba(15,23,42,0.04);
        }

        .jobs-pagination-page-current {
          font-size: 20px;
          font-weight: 900;
          color: #0f172a;
        }

        .jobs-pagination-separator,
        .jobs-pagination-page-total {
          font-size: 14px;
          font-weight: 700;
          color: #64748b;
        }

        @keyframes jobsPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.75;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @media (max-width: 1280px) {
          .jobs-layout-premium {
            grid-template-columns: 320px minmax(0, 1fr);
          }
        }

        @media (max-width: 1100px) {
          .jobs-hero-premium {
            flex-direction: column;
            align-items: flex-start;
          }

          .jobs-hero-stat-card {
            width: 100%;
            max-width: 320px;
          }

          .jobs-layout-premium {
            grid-template-columns: 1fr;
          }

          .jobs-mobile-filter-trigger-wrap {
            display: block;
          }

          .jobs-sidebar-premium {
            position: fixed;
            top: 0;
            left: 0;
            width: min(88vw, 380px);
            height: 100vh;
            z-index: 60;
            transform: translateX(-105%);
            transition: transform 0.28s ease;
            padding: 16px;
          }

          .jobs-sidebar-premium.jobs-sidebar-premium-open {
            transform: translateX(0);
          }

          .jobs-sidebar-shell {
            height: 100%;
            border-radius: 24px;
            padding: 18px;
            overflow: hidden;
          }

          .jobs-mobile-filter-header {
            display: block;
          }

          .jobs-sidebar-scroll {
            max-height: calc(100vh - 140px);
            overflow-y: auto;
            overflow-x: hidden;
            padding-right: 4px;
          }

          .jobs-mobile-filter-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 50;
            border: 0;
            background: rgba(15, 23, 42, 0.38);
            backdrop-filter: blur(3px);
          }
        }

        @media (max-width: 900px) {
          .jobs-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .jobs-hero-premium,
          .jobs-premium-state-card {
            padding: 18px;
          }

          .jobs-hero-title {
            font-size: 30px;
          }

          .jobs-hero-subtitle {
            font-size: 14px;
          }

          .jobs-results-title {
            font-size: 24px;
          }

          .jobs-results-toolbar {
            align-items: stretch;
          }

          .jobs-results-toolbar-right {
            width: 100%;
          }

          .jobs-results-count-chip,
          .jobs-clear-filter-btn {
            width: 100%;
            justify-content: center;
          }

          .jobs-pagination-wrap {
            gap: 10px;
          }

          .jobs-pagination-btn,
          .jobs-pagination-center {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default JobsPage;