# GHI CHÚ PHÁT HÀNH: PHIÊN BẢN 2409 (OFFICIAL PRODUCTION RELEASE)

## 📌 Tổng Quan Bản Phát Hành
Phiên bản **Release 2409** là bản nâng cấp và đóng gói triển khai chính thức của dự án **Tử Vi Hồng Ân**. Bản phát hành này tập trung tối ưu hóa nhận diện thương hiệu, thiết lập các tiêu chuẩn bảo mật trước triển khai (Pre-deployment Security), dọn dẹp mã nguồn, vô hiệu hóa source maps và đóng gói toàn diện vào thư mục phát hành `release website 2409`.

---

## 🌟 Các Cải Tiến & Tính Năng Nổi Bật

### 1. Đồng Bộ Nhận Diện Thương Hiệu (Branding & Identity)
- **Favicon Trình Duyệt**: Cập nhật biểu tượng favicon và apple-touch-icon trên tab trình duyệt sang logo chính thức `HA.png`.
- **Tiêu Đề Trang (Title Bar)**: Đổi tên hiển thị trên thanh tiêu đề thành **"Tử Vi Hồng Ân"** trên toàn bộ hệ thống (trang chính `index.html`, phân hệ `laso-tuvi.html`, `boi-que-kieu.html`).

### 2. Bảo Mật Trước Triển Khai (Pre-deployment Security)
- **Quản Lý Biến Môi Trường (`.env`)**:
  - Tách bạch thông tin nhạy cảm (Google OAuth Client Secret, Firebase Service Account, Secret Key) ra khỏi mã nguồn.
  - Cung cấp tệp mẫu `.env.example` chuẩn hóa để cấu hình an toàn trên máy chủ.
  - Tự động nạp cấu hình từ `.env` trong cả Backend Python và Frontend Vite.
- **Vô Hiệu Hóa Source Maps**:
  - Cấu hình `sourcemap: false` trong `vite.config.js` nhằm triệt tiêu hoàn toàn các tệp `.map`, ngăn ngừa rủi ro dịch ngược hoặc lộ cấu trúc mã nguồn dự án trên môi trường production.
- **Dọn Dẹp Mã Nguồn (Code Sanitization)**:
  - Loại bỏ và ngăn chặn tự động `console.log` / `debugger` trên bản build chính thức.
  - Sửa lỗi phạm vi khai báo biến (`ReferenceError`) trong khối `try-finally` của module xuất lá số (`export-engine.js`).
  - Tối ưu hóa và loại bỏ các biến/hàm không sử dụng được phát hiện bởi linter `oxlint`.
- **Bảo Vệ Bí Mật Kho Mã Nguồn (.gitignore Shield)**:
  - Bổ sung quy tắc cách ly tuyệt đối các tệp nhạy cảm: `client_secret*.json`, `firebase-service-account*.json`, cơ sở dữ liệu `*.db`, tệp mã hóa `*.enc` và các thư mục build.

### 3. Cấu Trúc & Đóng Gói (Build & Packaging)
- **Biên Dịch Đầu Ra**: Biên dịch mã nguồn React 19 + Vite 8 trực tiếp vào thư mục đầu ra chuẩn hóa mang tên `release website 2409`.
- **Hỗ Trợ Phục Vụ Tĩnh Đa Dạng**: Cập nhật máy chủ `backend/server.py` tự động nhận diện và ưu tiên phục vụ thư mục tĩnh `release website 2409` và `dist`.
- **Gói Triển Khai Máy Chủ**: Đồng bộ toàn bộ tài nguyên sang thư mục đích công khai phục vụ lưu trữ và bàn giao triển khai.

---

## 🚀 Hướng Dẫn Vận Hành & Khởi Chạy
1. **Sao chép và cấu hình biến môi trường**:
   ```bash
   cp .env.example .env
   # Chỉnh sửa API keys và thông tin xác thực trong .env
   ```

2. **Cài đặt và biên dịch Frontend**:
   ```bash
   npm install
   npm run build
   ```

3. **Khởi động hệ thống (1-click)**:
   ```bash
   python start_local.py
   ```
