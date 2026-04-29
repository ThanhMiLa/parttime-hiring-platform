import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import {
  getStoreReviewsService,
  checkStoreReviewPermissionService,
  createStoreReviewService,
} from "../../services/storeReviewService";
import { getAccessToken } from "../../utils/tokenStorage";

function formatDate(dateValue) {
  if (!dateValue) return "";
  try {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } catch {
    return dateValue;
  }
}

function StarRating({ value = 0, onChange, editable = false, size = 18 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = value >= star;
        const isHalf = value >= star - 0.5 && value < star;

        return (
          <span
            key={star}
            onClick={editable ? () => onChange(star) : undefined}
            style={{
              cursor: editable ? "pointer" : "default",
              position: "relative",
              display: "inline-flex",
            }}
          >
            <Star
              size={size}
              stroke={isFull || isHalf ? "#facc15" : "#e5e7eb"}
              fill={isFull ? "#facc15" : "#ffffff"}
            />
            {isHalf && (
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
            )}
          </span>
        );
      })}
    </span>
  );
}

export default function StoreReviewSection({ storeId, jobPostId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewError, setReviewError] = useState("");
  const [canComment, setCanComment] = useState(false);
  const [employmentRecordId, setEmploymentRecordId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchReviews() {
    if (!storeId) return;

    setLoading(true);
    setReviewError("");

    try {
      const res = await getStoreReviewsService(storeId);
      setReviews(res?.result || []);
    } catch (error) {
      setReviews([]);
      setReviewError(error?.response?.data?.message || "Không tải được đánh giá");
    } finally {
      setLoading(false);
    }
  }

  async function checkPermission() {
    if (!storeId || !jobPostId) return;

    setCanComment(false);
    setEmploymentRecordId(null);

    try {
      const token = getAccessToken();
      if (!token) return;

      const res = await checkStoreReviewPermissionService(storeId, jobPostId);
      const permission = res?.result;

      if (permission?.hasWorked) {
        setCanComment(true);
        setEmploymentRecordId(permission?.employmentRecordId || null);
      } else {
        setCanComment(false);
        setEmploymentRecordId(null);
      }
    } catch {
      setCanComment(false);
      setEmploymentRecordId(null);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [storeId]);

  useEffect(() => {
    checkPermission();
  }, [storeId, jobPostId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSuccess("");

    if (!getAccessToken()) {
      setSubmitError("Bạn cần đăng nhập để đánh giá");
      return;
    }

    if (!storeId || !jobPostId) {
      setSubmitError("Thiếu thông tin job post để kiểm tra quyền đánh giá");
      return;
    }

    if (!canComment || !employmentRecordId) {
      setSubmitError("Bạn chưa đủ điều kiện để đánh giá cửa hàng này");
      return;
    }

    if (!rating) {
      setSubmitError("Vui lòng chọn số sao");
      return;
    }

    if (!comment.trim()) {
      setSubmitError("Vui lòng nhập bình luận");
      return;
    }

    try {
      setSubmitting(true);

      const res = await createStoreReviewService({
        storeId,
        employmentRecordId,
        rating,
        comment: comment.trim(),
      });

      setSuccess(res?.message || "Đã gửi đánh giá thành công");
      setRating(0);
      setComment("");
      await fetchReviews();
      await checkPermission();
    } catch (error) {
      setSubmitError(error?.response?.data?.message || "Gửi đánh giá thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      style={{
        background: "#fff",
        borderRadius: 24,
        border: "1px solid #e2e8f0",
        padding: 32,
        marginTop: 32,
        boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
      }}
    >
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#0f172a",
          marginBottom: 18,
          borderLeft: "4px solid #10B981",
          paddingLeft: 14,
        }}
      >
        Đánh giá & Bình luận về cửa hàng
      </h2>

      {canComment ? (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: 32,
            background: "#f8fafc",
            borderRadius: 14,
            padding: 18,
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: 700, color: "#334155", fontSize: 15 }}>
              Đánh giá:
            </span>
            <StarRating value={rating} onChange={setRating} editable size={24} />
            {rating > 0 && (
              <span style={{ color: "#ca8a04", fontWeight: 700 }}>{rating}/5</span>
            )}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Viết bình luận của bạn về cửa hàng này..."
            rows={4}
            style={{
              width: "100%",
              borderRadius: 10,
              border: "1px solid #dbe3ef",
              padding: 12,
              fontSize: 15,
              marginBottom: 10,
              resize: "vertical",
            }}
            disabled={submitting}
            maxLength={500}
          />

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={submitting || !rating || !comment.trim()}
              style={{
                background: "#10B981",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "8px 22px",
                fontWeight: 800,
                fontSize: 15,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>

            {submitError && (
              <span style={{ color: "#dc2626", fontWeight: 700 }}>{submitError}</span>
            )}
            {success && (
              <span style={{ color: "#15803d", fontWeight: 700 }}>{success}</span>
            )}
          </div>
        </form>
      ) : (
        <div
          style={{
            marginBottom: 32,
            color: "#64748b",
            fontStyle: "italic",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            padding: 16,
            borderRadius: 14,
          }}
        >
          * Chỉ những người đã làm việc tại cửa hàng này trong job post này mới có thể
          đánh giá.
        </div>
      )}

      <div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 14 }}>
          Các đánh giá gần đây
        </h3>

        {loading ? (
          <p>Đang tải đánh giá...</p>
        ) : reviewError ? (
          <p style={{ color: "#dc2626" }}>{reviewError}</p>
        ) : reviews.length === 0 ? (
          <p style={{ color: "#64748b" }}>Chưa có đánh giá nào cho cửa hàng này.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {reviews.map((r, idx) => (
              <li
                key={`${r.displayName}-${r.createAt}-${idx}`}
                style={{ borderBottom: "1px solid #e2e8f0", padding: "18px 0" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 4,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>
                    {r.displayName}
                  </span>
                  <StarRating value={Number(r.rating) || 0} size={18} />
                  <span style={{ color: "#64748b", fontSize: 13 }}>
                    {formatDate(r.createAt)}
                  </span>
                </div>
                <div style={{ color: "#334155", fontSize: 15, whiteSpace: "pre-line" }}>
                  {r.comment}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}