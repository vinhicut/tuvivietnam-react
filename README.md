# WEBSITE TỬ VI HỒNG ÂN (OFFICIAL PRODUCTION RELEASE)

> **Hệ Thống Lập Lá Số Tử Vi Đẩu Số Toàn Diện & Website Tra Cứu Phong Thủy**  
> Phiên bản phát hành chính thức: **v1.0.0 (Release 1909)**  
> Kho lưu trữ GitHub: [https://github.com/vinhicut/tuvivietnam-react.git](https://github.com/vinhicut/tuvivietnam-react.git)

---

## 1. GIỚI THIỆU TỔNG QUAN

Website **Tử Vi Hồng Ân** là nền tảng số hóa văn hóa truyền thống phương Đông hiện đại, cung cấp công cụ lập lá số Tử Vi Đẩu Số có độ chính xác cao, bói Kiều, lịch vạn sự và các chuyên đề luận giải mệnh lý chuyên sâu.

Hệ thống được phát triển theo mô hình ứng dụng web hiện đại (Single Page Application kết hợp REST API Engine), tuân thủ chặt chẽ các nguyên lý an sao cổ điển từ tác phẩm quy chuẩn **"Tử Vi Đẩu Số Tân Biên"** của tác giả **Vân Đằng Thái Thứ Lang**.

---

## 2. ĐẶC ĐIỂM NỔI BẬT

- 🎯 **Lõi thuật toán an sao chuẩn xác 100%:** An trọn vẹn 14 chính tinh và hơn 110 phụ tinh (vòng Thái Tuế, Lộc Tồn, Tràng Sinh, lục sát tinh, lục cát tinh, tứ hóa, thần sát,...).
- 📅 **Lịch pháp thiên văn Việt Nam:** Chuyển đổi chính xác giữa Lịch Dương (Gregorian) và Lịch Âm theo múi giờ GMT+7, tính toán chính xác tháng nhuận và tiết khí.
- 📐 **Giao diện Micro-Grid 4-Zone chuyên nghiệp:** Bố cục 12 cung chuẩn mực nghệ thuật in ấn, tự động kẻ tam giác Mệnh - Tài - Quan, hiển thị huy hiệu Tuần/Triệt tinh tế.
- 🖨️ **Xuất bản đa định dạng:** Xuất file PDF màu CMYK, PDF đen trắng in ấn và ảnh độ phân giải siêu nét 4K.
- ⚡ **Khởi chạy 1-click thông minh:** Kịch bản điều phối tự động nạp dependencies, khởi động backend, khởi động frontend và mở trình duyệt.
- 🐳 **Sẵn sàng cho Production:** Hỗ trợ Docker đa tầng (Multi-stage build) và mẫu cấu hình Nginx Reverse Proxy tối ưu.

---

## 3. CẤU TRÚC MÃ NGUỒN

```text
release website 1909/
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI pipeline (Node & Python)
├── backend/                           # Phân hệ Máy chủ & Lõi thuật toán (Python 3.9+)
│   ├── tuvi_engine/                   # Lõi tính toán thiên văn & an sao
│   │   ├── __init__.py
│   │   ├── constants.py               # Dữ liệu thiên can, địa chi, chòm sao
│   │   ├── core.py                    # calculate_tuvi_chart() trung tâm
│   │   ├── han_van.py                 # Tính đại hạn, tiểu hạn, lưu niên
│   │   ├── lunar_calendar.py          # Thuật toán chuyển đổi âm dương lịch
│   │   ├── models.py                  # Khai báo models dữ liệu
│   │   ├── sao_chinh.py               # Thuật toán an 14 chính tinh
│   │   ├── sao_phu.py                 # Thuật toán an 110+ phụ tinh
│   │   └── thien_ban.py               # Thiết lập thông tin bản mệnh, cục số
│   ├── server.py                      # REST API Server đa luồng an toàn (Port 8080)
│   ├── requirements.txt               # Thư viện Python phụ thuộc
│   └── test_engine.py                 # Bộ kiểm thử giải thuật tự động
├── devsecops/                         # Công cụ kiểm soát bảo mật & tự động hóa
│   ├── generate_csp.py                # Tạo header CSP chống XSS
│   ├── package_wasm.py                # Đóng gói Rust sang WebAssembly
│   ├── vault_secrets.py               # Quản lý secrets Zero-Trust
│   └── README.md
├── public/                            # Tài nguyên tĩnh phục vụ Client
│   ├── assets/                        # Hình ảnh, logo thương hiệu
│   ├── boi-kieu/                      # Phân hệ Bói Kiều (210 quẻ và bánh xe quay)
│   ├── cards/                         # Thẻ bài hình ảnh
│   ├── css/                           # Stylesheets lá số (theme, board, controls, print)
│   ├── js/                            # JavaScript điều khiển lá số và đồ họa
│   ├── wasm/                          # WebAssembly module
│   ├── favicon.svg                    # Icon website
│   ├── icons.svg                      # Sprite biểu tượng SVG
│   └── laso-tuvi.html                 # Giao diện bảng lá số Tử Vi Micro-Grid
├── src/                               # Toàn bộ mã nguồn React 19 Frontend
│   ├── assets/                        # Fonts chữ nghệ thuật & biểu trưng
│   ├── components/                    # Các module giao diện React
│   │   ├── Navbar.jsx                 # Thanh điều hướng tích hợp Header
│   │   ├── Footer.jsx                 # Chân trang thông tin
│   │   ├── LaSoTuVi.jsx               # Phân hệ nhúng Lá số Tử Vi
│   │   ├── LichVanSu.jsx              # Tra cứu Lịch Vạn Sự
│   │   ├── BoiKieu.jsx                # Giao diện Bói Kiều
│   │   ├── QuickInsights.jsx          # Cẩm nang tra cứu nhanh
│   │   ├── Contact.jsx                # Thông tin liên hệ
│   │   └── ...
│   ├── App.jsx                        # Điều hướng định tuyến (React Router DOM)
│   ├── App.css                        # Phong cách giao diện tổng thể
│   ├── main.jsx                       # Điểm khởi nhập React
│   └── index.css                      # CSS thiết lập nền tảng
├── docker-compose.yml                 # Khởi chạy Docker 1 lệnh
├── Dockerfile                         # Cấu hình đóng gói container đa tầng
├── index.html                         # Điểm vào HTML chính của website
├── nginx.conf                         # Cấu hình máy chủ reverse proxy mẫu
├── package.json                       # Cấu hình thư viện và script npm
├── package-lock.json                  # Khóa phiên bản gói npm
├── start_local.py                     # Kịch bản 1-click khởi chạy song song
├── start.bat                          # Kịch bản khởi chạy trên Windows
├── start.sh                           # Kịch bản khởi chạy trên Linux/macOS
├── .gitignore                         # Danh sách loại trừ khi đẩy lên Git
├── .oxlintrc.json                     # Cấu hình trình phân tích cú pháp Oxlint
├── vite.config.js                     # Cấu hình Vite & Proxy API
├── RELEASE_NOTES_1909.md              # Ghi chú phiên bản phát hành chính thức
├── Deployment_Security_Guide.md       # Cẩm nang triển khai bảo mật toàn diện trên máy chủ
└── README.md                          # Tài liệu hướng dẫn sử dụng
```

---

## 4. HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG

### Yêu cầu tiên quyết:
- **Node.js:** Phiên bản 18+ hoặc 20+ LTS
- **Python:** Phiên bản 3.9 trở lên

### Cách 1: Khởi chạy 1-Click (Khuyên dùng)
Hệ thống tích hợp sẵn kịch bản thông minh tự động kiểm tra thư viện, khởi động máy chủ API Python và máy chủ giao diện Vite:
- **Trên Windows:** Nhấp đúp vào tệp `start.bat` (hoặc chạy `python start_local.py`).
- **Trên Linux/macOS:** Chạy lệnh `./start.sh` (hoặc `python3 start_local.py`).

Trình duyệt sẽ tự động mở tại địa chỉ: `http://localhost:5173`.

---

### Cách 2: Khởi chạy thủ công từng phân hệ

#### Bước 1: Khởi động Backend Python Core Engine
```bash
cd backend
pip install -r requirements.txt
python server.py
```
> Máy chủ API sẽ lắng nghe tại: `http://127.0.0.1:8080` (Endpoints: `/api/calculate`, `/api/health`).

#### Bước 2: Khởi động Frontend React Website
Mở một cửa sổ dòng lệnh mới tại thư mục gốc:
```bash
npm install
npm run dev
```
> Truy cập website tại: `http://localhost:5173`

---

## 5. TRIỂN KHAI PRODUCTION

### Sử dụng Docker & Docker Compose:
Chỉ cần thực hiện 1 lệnh duy nhất:
```bash
docker compose up -d --build
```
Hệ thống sẽ tự động build ứng dụng React và chạy máy chủ Python phục vụ toàn bộ website tại cổng `8080`.

### Biên dịch thủ công tệp tĩnh:
```bash
npm run build
```
Các tệp tĩnh được xuất bản vào thư mục `dist/`. Bạn có thể dùng Nginx theo mẫu `nginx.conf` có sẵn trong dự án để phục vụ trang web.

---

## 6. KIỂM THỬ HỆ THỐNG (TESTING)

Kiểm tra tính đúng đắn của giải thuật an sao:
```bash
npm run test:backend
# hoặc:
python backend/test_engine.py
```

Kiểm tra cú pháp và chất lượng mã nguồn:
```bash
npm run lint
```

---

## 7. ĐÓNG GÓP & BẢN QUYỀN

- **Mã nguồn dự án:** Bản quyền thuộc về tác giả / **Tử Vi Hồng Ân**.
- **Cơ sở học thuật:** Tuân thủ chuẩn mực giải thuật từ sách *Tử Vi Đẩu Số Tân Biên* – Tác giả Vân Đằng Thái Thứ Lang.
