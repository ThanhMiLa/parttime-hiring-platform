import { useState } from "react";
import { X, Phone, FileText, Send } from "lucide-react";

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

export default ApplyJobModal;