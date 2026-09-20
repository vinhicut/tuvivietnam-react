# GHI CHÚ PHÁT HÀNH: PHIÊN BẢN 1909 (OFFICIAL RELEASE)

## 📌 Tổng Quan Bản Phát Hành
Phiên bản **Release 1909** là bản phát hành chính thức đầu tiên được chuẩn hóa toàn diện từ kiến trúc mã nguồn, độ chính xác giải thuật phong thủy, giao diện đồ họa đến quy trình đóng gói triển khai (DevSecOps & CI/CD).

---

## 🌟 Các Cải Tiến & Tính Năng Nổi Bật

### 1. Phân Hệ Frontend (React 19 + Vite 8)
- Cấu trúc thanh điều hướng `Navbar` và `Header` đồng bộ thương hiệu Tử Vi Hồng Ân, hỗ trợ xem trên máy tính và thiết bị di động hoàn hảo.
- Tích hợp liền mạch phân hệ Lập Lá Số Tử Vi (Micro-Grid 4-Zone) nhúng thông minh qua `LaSoTuVi.jsx` tự động co giãn chiều cao (postMessage), loại bỏ hiện tượng giật màn hình hoặc thanh cuộn lồng nhau.
- Tích hợp phân hệ Bói Quẻ Kiều (với 210 quẻ thơ minh họa và bánh xe quay may mắn).
- Bổ sung chuyên mục tra cứu Lịch Vạn Sự và các bài viết kiến thức chuyên sâu.

### 2. Phân Hệ Backend (Python Core Engine)
- Tái cấu trúc phân hệ tính toán sang module độc lập `backend/tuvi_engine/`.
- Giải thuật an 14 chính tinh và 110+ phụ tinh tuân thủ nghiêm ngặt theo sách *Tử Vi Đẩu Số Tân Biên* (Vân Đằng Thái Thứ Lang).
- Máy chủ `backend/server.py` tối ưu xử lý đa luồng với `SafeThreadingHTTPServer`, triệt tiêu hoàn toàn lỗi chiếm dụng cổng trên Windows.
- Cung cấp API chuẩn RESTful (`/api/calculate`, `/api/health`).

### 3. Quy Trình Vận Hành & Khởi Chạy
- Kịch bản `start_local.py`, `start.bat`, `start.sh` cung cấp trải nghiệm khởi chạy 1-click: tự động cài đặt `npm install` nếu thiếu, khởi động song song cả 2 máy chủ và tự bật trình duyệt.
- Hỗ trợ triển khai container hóa thông qua `Dockerfile` và `docker-compose.yml`.
- Tích hợp GitHub Actions CI tự động kiểm thử mỗi khi đẩy mã nguồn lên nhánh chính.

---

## 🚀 Hướng Dẫn Nâng Cấp & Triển Khai
1. Clone mã nguồn từ GitHub:
   ```bash
   git clone https://github.com/vinhicut/tuvivietnam-react.git
   ```
2. Khởi động nhanh:
   ```bash
   python start_local.py
   ```
