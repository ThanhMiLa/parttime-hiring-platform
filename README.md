# 🚀 Part-time Hiring Platform

Nền tảng kết nối sinh viên và nhà tuyển dụng cho các công việc bán thời gian. Dự án được xây dựng với kiến trúc hiện đại, tập trung vào trải nghiệm người dùng và tính bảo mật cao.

---

## 🌟 Tính năng chính

### 👤 Dành cho Người tìm việc (Student)
- **Khám phá công việc**: Tìm kiếm và lọc công việc theo địa điểm, mức lương, và loại hình.
- **Ứng tuyển nhanh chóng**: Gửi hồ sơ ứng tuyển trực tiếp qua nền tảng.
- **Quản lý hồ sơ**: Cập nhật thông tin cá nhân và xem lịch sử ứng tuyển.
- **Theo dõi trạng thái**: Nhận phản hồi về trạng thái hồ sơ (Chờ duyệt, Đã chấp nhận, Từ chối).

### 🏢 Dành cho Nhà tuyển dụng (Employer)
- **Quản lý tin tuyển dụng**: Đăng mới, chỉnh sửa và quản lý các bài đăng công việc.
- **Quản lý ứng viên**: Duyệt danh sách ứng viên, xem hồ sơ và thay đổi trạng thái ứng tuyển.
- **Xác thực doanh nghiệp**: Hệ thống xác thực thông tin cửa hàng/công ty để đảm bảo uy tín.
- **Dashboard trực quan**: Theo dõi các chỉ số về lượt ứng tuyển và tin đăng.

### 🔐 Hệ thống & Bảo mật
- **Xác thực JWT**: Bảo mật thông tin người dùng với cơ chế Token-based authentication.
- **Phân quyền (RBAC)**: Phân chia quyền hạn rõ rệt giữa Admin, Employer và User.
- **Lưu trữ hình ảnh**: Tích hợp Cloudinary để quản lý hình ảnh profile và bài đăng.

---

## 🛠 Tech Stack

### Backend
- **Core**: Java 21, Spring Boot 3.5.5
- **Database**: MySQL, Spring Data JPA
- **Security**: Spring Security, OAuth2 Resource Server (JWT)
- **Mapping & Utilities**: MapStruct, Lombok
- **File Storage**: Cloudinary API
- **Validation**: Spring Boot Starter Validation
- **Deployment Ready**: Dockerfile included

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 8
- **Routing**: React Router 7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Modern Vanilla CSS (Custom Design System)

---

## 📂 Cấu trúc dự án

```text
parttime-hiring-platform/
├── ParttimeHiringBackend/      # Mã nguồn Spring Boot
│   ├── src/main/java/...       # Logic nghiệp vụ (Controller, Service, Entity)
│   ├── Dockerfile              # Cấu hình container hóa
│   └── pom.xml                 # Quản lý dependencies Maven
└── ParttimeHiringFrontend/     # Mã nguồn React
    ├── src/pages/              # Các trang chính của ứng dụng
    ├── src/components/         # Thành phần UI dùng chung
    ├── src/services/           # API integration với Axios
    └── package.json            # Quản lý dependencies npm
```

---

## ⚙️ Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- JDK 21 trở lên
- Node.js 18+ & npm
- MySQL Server 8.0+

### 2. Cài đặt Backend
1. Truy cập thư mục backend: `cd ParttimeHiringBackend`
2. Cấu hình file `.env` hoặc `application.yml` với các thông tin:
   - MySQL connection (URL, Username, Password)
   - Cloudinary Credentials
   - JWT Secret Key
3. Chạy ứng dụng:
   ```bash
   ./mvnw spring-boot:run
   ```

### 3. Cài đặt Frontend
1. Truy cập thư mục frontend: `cd ParttimeHiringFrontend`
2. Cài đặt thư viện:
   ```bash
   npm install
   ```
3. Chạy ứng dụng ở môi trường dev:
   ```bash
   npm run dev
   ```

---

## 📸 Screenshots
*(Bạn có thể thêm hình ảnh demo vào đây)*

---

## 📝 Giấy phép
Dự án được phát triển cho mục đích học tập và quản lý công việc bán thời gian.

---
**Phát triển bởi [Tên của bạn]** 🚀
