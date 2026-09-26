# TỬ VI HỒNG ÂN

> **Phiên bản:** Release 2609 (26/09/2026)
> **Công nghệ:** React 19 + Vite 8 (Frontend) · Python Flask (Backend)
> **Kho mã nguồn chính:** [github.com/vinhicut/tuvivietnam-react](https://github.com/vinhicut/tuvivietnam-react)
> **Kho mã nguồn phụ:** [github.com/Oops52VN/Hong-An-Horoscope-Website-Backups](https://github.com/Oops52VN/Hong-An-Horoscope-Website-Backups)

---

## Mục lục

1. [Cấu trúc thư mục](#1-cấu-trúc-thư-mục)
2. [Cập nhật phiên bản Release 2609](#2-cập-nhật-phiên-bản-release-2609)
3. [Hướng dẫn chạy trên máy cá nhân](#3-hướng-dẫn-chạy-trên-máy-cá-nhân)
4. [Hướng dẫn thiết lập bảo mật](#4-hướng-dẫn-thiết-lập-bảo-mật)
5. [Hướng dẫn đưa lên máy chủ](#5-hướng-dẫn-đưa-lên-máy-chủ)
6. [Lưu ý quan trọng](#6-lưu-ý-quan-trọng)

---

## 1. Cấu trúc thư mục

Dự án được tổ chức theo kiến trúc **Feature-Based (Modular)** kết hợp **Monorepo**, tách biệt Frontend và Backend. Toàn bộ tên thư mục theo tiếng Anh.

```text
Tử Vi Hồng Ân Website/
│
├── backend/                             # Mã nguồn máy chủ (Python / Flask)
│   ├── requirements.txt                 # Thư viện Python cần cài đặt
│   ├── .env                             # Biến môi trường (KHÔNG đẩy lên Git)
│   └── src/
│       ├── server.py                    # Điểm khởi chạy API (cổng 8080)
│       ├── core/                        # Logic lõi nền tảng
│       │   ├── config.py                #    Nạp cấu hình từ biến môi trường
│       │   ├── db.py                    #    Truy vấn SQLite (Unified Data Router)
│       │   ├── firebase_db.py           #    Kết nối Google Cloud Firestore
│       │   └── migrate_to_firebase.py   #    Di chuyển dữ liệu SQLite → Firebase
│       ├── data/                        # Thư mục lưu cơ sở dữ liệu cục bộ (tuvi.db)
│       └── modules/                     # Các module tính năng
│           ├── admin/                   #    Quản trị hệ thống
│           │   └── routes_admin.py
│           ├── astrology/               #    Lá Số Tử Vi
│           │   ├── routes_charts.py
│           │   └── tuvi_engine/         #    Bộ tính toán tử vi
│           │       ├── constants.py
│           │       ├── core.py
│           │       ├── han_van.py
│           │       ├── lunar_calendar.py
│           │       ├── models.py
│           │       ├── sao_chinh.py
│           │       ├── sao_phu.py
│           │       ├── thien_ban.py
│           │       └── __init__.py
│           ├── auth/                    #    Xác thực Google, quản lý người dùng
│           │   ├── auth.py
│           │   └── routes_auth.py
│           ├── tarot_kieu/              #    Bói bài Kiều
│           ├── lunar_calendar/          #    Lịch Vạn Sự
│           ├── articles/                #    Bài viết
│           ├── contact/                 #    Liên hệ
│           ├── courses/                 #    Khóa học
│           ├── forum/                   #    Diễn đàn
│           ├── shop/                    #    Cửa hàng
│           ├── qimen_dunjia/            #    Kỳ Môn Độn Giáp (dự phòng)
│           ├── feng_shui/               #    Phong Thủy (dự phòng)
│           └── numerology/              #    Thần Số Học (dự phòng)
│
├── frontend/                            # Mã nguồn giao diện (React 19 / Vite 8)
│   ├── package.json                     # Cấu hình npm và thư viện JavaScript
│   ├── vite.config.js                   # Cấu hình Vite (proxy, build output)
│   ├── index.html                       # Trang HTML gốc
│   ├── public/                          # Tài nguyên tĩnh
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   ├── logo.png
│   │   ├── astrology-engine/            # Bộ engine vẽ lá số (HTML/CSS/JS/WASM)
│   │   │   ├── laso-tuvi.html           #    Bảng lá số (phiên bản tách file)
│   │   │   ├── laso-tuvi.bundle.html    #    Bảng lá số (phiên bản bundle)
│   │   │   ├── css/
│   │   │   │   ├── board.css(.enc)
│   │   │   │   ├── controls.css(.enc)
│   │   │   │   ├── print.css(.enc)
│   │   │   │   └── theme.css(.enc)
│   │   │   ├── js/
│   │   │   │   ├── app.js(.enc)
│   │   │   │   ├── board-renderer.js(.enc)
│   │   │   │   ├── constants.js(.enc)
│   │   │   │   ├── dpop.js
│   │   │   │   ├── export-engine.js(.enc)
│   │   │   │   ├── geometry.js(.enc)
│   │   │   │   └── ui-controller.js(.enc)
│   │   │   └── wasm/
│   │   │       └── e2ee_wasm.wasm
│   │   └── tarot-kieu/                  # Bói quẻ Kiều
│   │       ├── boi-que-kieu.html        #    Giao diện bói Kiều
│   │       ├── que-giai.json            #    Dữ liệu giải quẻ
│   │       ├── nen-tarot-kieu.png       #    Hình nền
│   │       ├── wheel.png                #    Hình bánh xe quay
│   │       └── cards/                   #    210 ảnh quẻ (Que-001.png → Que-210.png)
│   └── src/
│       ├── main.jsx                     # Điểm khởi chạy React
│       ├── app/                         # Thiết lập App, CSS toàn cục, Router
│       │   ├── App.jsx
│       │   ├── App.css
│       │   └── index.css
│       ├── features/                    # Logic tính năng
│       │   ├── admin-dashboard/
│       │   │   ├── AdminModal.jsx
│       │   │   └── AdminModal.css
│       │   ├── astrology/               # Lá Số Tử Vi
│       │   │   ├── LaSoTuVi.jsx
│       │   │   ├── LaSoTuVi.css
│       │   │   ├── KhamThienTuViThienTuong.jsx
│       │   │   └── KhamThienTuViThienTuong.css
│       │   ├── auth/                    # Xác thực người dùng
│       │   │   ├── AuthModal.jsx
│       │   │   └── AuthModal.css
│       │   ├── lunar-calendar/          # Lịch Vạn Sự — tái cấu trúc toàn diện
│       │   │   ├── LichVanSu.jsx
│       │   │   ├── LichVanSu.css
│       │   │   ├── components/
│       │   │   │   ├── common/
│       │   │   │   │   └── CalendarTabNav.jsx
│       │   │   │   ├── converter/
│       │   │   │   │   └── DualDateSyncBar.jsx
│       │   │   │   ├── daily/
│       │   │   │   │   ├── DailyTearCalendar.jsx
│       │   │   │   │   ├── DayDeitiesAndStars.jsx
│       │   │   │   │   ├── DepartureAndConflicts.jsx
│       │   │   │   │   ├── HourlyFortuneMatrix.jsx
│       │   │   │   │   └── MiniMonthCalendar.jsx
│       │   │   │   ├── goodDays/
│       │   │   │   │   └── GoodDayFilterView.jsx
│       │   │   │   └── monthly/
│       │   │   │       ├── MonthlyCalendarGrid.jsx
│       │   │   │       └── MonthlyDayInspector.jsx
│       │   │   ├── core/                #    Thuật toán cốt lõi
│       │   │   │   ├── astronomy/       #       julianDay, lunarSolarConverter, solarTerms
│       │   │   │   ├── deities/         #       catHungStars, hoangDaoHacDao, lucDieu, nhiThapBatTu, thapNhiKienTru
│       │   │   │   ├── divination/      #       conflictResolver, departureDirection, lyThuanPhongHours
│       │   │   │   ├── evaluation/      #       dayScoringEngine, taskAdvisor
│       │   │   │   ├── holidays/        #       vietnameseHolidays
│       │   │   │   └── sexagenary/      #       canChiCalculator, canChiTables
│       │   │   ├── engine/              #    Bộ tính toán tổng hợp
│       │   │   │   ├── index.js
│       │   │   │   ├── astronomical.js
│       │   │   │   ├── canChi.js
│       │   │   │   ├── hoangDaoHacDao.js
│       │   │   │   ├── nhiThapBatTu.js
│       │   │   │   ├── recommendationEngine.js
│       │   │   │   ├── saoCatHung.js
│       │   │   │   ├── thapNhiKienTru.js
│       │   │   │   ├── vietnameseHolidays.js
│       │   │   │   └── xuatHanhXungKhac.js
│       │   │   ├── hooks/
│       │   │   │   ├── useDateConverterSync.js
│       │   │   │   ├── useGoodDayFinder.js
│       │   │   │   └── useLichVanSu.js
│       │   │   └── __tests__/
│       │   │       └── algorithmVerify.test.js
│       │   ├── tarot-kieu/
│       │   │   ├── BoiKieu.jsx
│       │   │   └── BoiKieu.css
│       │   ├── feng-shui/
│       │   ├── numerology/
│       │   └── qimen-dunjia/
│       ├── pages/                       # Các trang chính
│       │   ├── articles/
│       │   │   ├── ArticleContent.jsx
│       │   │   ├── CategoryPage.jsx
│       │   │   └── CategoryPage.css
│       │   ├── contact/
│       │   │   ├── Contact.jsx
│       │   │   └── Contact.css
│       │   ├── courses/
│       │   ├── forum/
│       │   ├── home/
│       │   │   └── HomePage.jsx
│       │   ├── policy/
│       │   │   └── Policy.jsx
│       │   └── tools/                   #    (đang phát triển)
│       └── shared/                      # Thành phần dùng chung
│           ├── api/
│           ├── assets/                  #    Hình ảnh, font chữ
│           │   ├── ha-logo.png
│           │   ├── ICIEL-Lordish-Regular.otf
│           │   ├── MTD-Avelina.otf
│           │   └── UVN-HOA-KY.ttf
│           ├── ui/                      #    Các component giao diện dùng chung
│           │   ├── Footer.jsx
│           │   ├── Header.jsx
│           │   ├── Navbar.jsx
│           │   ├── TopBar.jsx
│           │   ├── TopBar.css
│           │   ├── QuickInsights.jsx
│           │   ├── RelatedArticles.jsx
│           │   ├── Sidebar.jsx
│           │   ├── UnderDevelopment.jsx
│           │   └── UnderDevelopment.css
│           └── utils/                   #    Tiện ích dùng chung
│               ├── hotline.js           #       Quản lý số điện thoại theo phiên
│               └── tuviEngine.js
│
├── deployment/                          # Hạ tầng triển khai
│   ├── docker/                          #    Dockerfile, docker-compose.yml
│   ├── nginx/                           #    Cấu hình Nginx
│   ├── scripts/
│   │   ├── start.bat                    #    Khởi chạy trên Windows
│   │   ├── start.sh                     #    Khởi chạy trên Linux/macOS
│   │   ├── start_local.py               #    Script khởi động đồng thời Frontend & Backend
│   │   └── start_android.py             #    Khởi chạy trên Android
│   └── terraform/                       #    Hạ tầng dạng mã (dự phòng Cloud)
│
├── security/                            # Bảo mật
│   ├── keys-and-secrets/                #    File nhạy cảm (KHÔNG đẩy lên Git)
│   │   ├── firebase-service-account.json
│   │   ├── client_secret_*.json
│   │   └── tuvi_ui_protected.enc
│   ├── devsecops/                       #    Công cụ tự động hóa bảo mật
│   │   ├── generate_csp.py
│   │   ├── package_wasm.py
│   │   ├── vault_secrets.py
│   │   └── wasm_manifest.json
│   └── policies/
│       └── Deployment_Security_Guide.md
│
├── testing/                             # Kiểm thử
│   ├── unit-tests/                      #    test_engine.py, test_backend_api.py
│   ├── e2e/
│   └── load-tests/
│
├── releases/                            # Quản lý phát hành
│   ├── dist/                            #    Mã nguồn Frontend đã build
│   ├── archives/                        #    Lưu trữ các bản cũ
│   ├── notes/                           #    Ghi chú phiên bản
│   └── start_local_sever_for_release_version.py
│
├── packages/                            # Thư viện dùng chung (Monorepo)
├── clients/                             # Dự phòng nền tảng khác
├── .github/                             # CI/CD Workflows
│   └── workflows/ci.yml
│
├── .gitignore
├── .env                                 # Biến môi trường cấp dự án
├── start.bat                            # Lối tắt khởi chạy nhanh
├── start_local.py                       # Lối tắt khởi chạy nhanh
├── tree.txt                             # Sơ đồ cây thư mục
└── TÁI CẤU TRÚC THƯ MỤC PHÁT TRIỂN.md # Tài liệu ghi nhận quá trình tái cấu trúc
```

### Quy ước đặt tên

| Tên tiếng Việt | Tên thư mục tiếng Anh |
| ------------------- | ------------------------- |
| Tử Vi | `astrology` |
| Tarot Kiều | `tarot_kieu` / `tarot-kieu` |
| Kỳ Môn Độn Giáp | `qimen_dunjia` / `qimen-dunjia` |
| Phong Thủy | `feng_shui` / `feng-shui` |
| Lịch Vạn Sự | `lunar_calendar` / `lunar-calendar` |
| Thần Số Học | `numerology` |

> Quy ước: thư mục Backend dùng dấu gạch dưới (`_`), thư mục Frontend (React) dùng dấu gạch ngang (`-`).

---

## 2. Cập nhật phiên bản Release 2609

### 2.1. Danh mục thay đổi

| STT | Hạng mục | Mô tả |
| :---: | -------- | ------ |
| 1 | Hoãn tích hợp trang chủ | Không triển khai được giao diện trang chủ từ kho `vinhicut/tuvihongan` trong phiên bản này. Hạng mục chuyển sang giai đoạn tiếp theo. |
| 2 | Cập nhật thanh điều hướng | Cập nhật thanh điều hướng (Navbar) theo phương án thiết kế của Leader2 Tuyết. |
| 3 | Giao diện Tarot Kiều | Cập nhật giao diện bói bài Kiều, bao gồm bộ ảnh quẻ (`Que-001.png` → `Que-210.png`), bánh xe quay (`wheel.png`), hình nền (`nen-tarot-kieu.png`) và dữ liệu giải quẻ (`que-giai.json`). |
| 4 | Luồng lập lá số | Tinh chỉnh luồng thao tác lập lá số tử vi. |
| 5 | Backend xác thực Google | Tích hợp backend đăng nhập Google ngầm (`auth.py`, `routes_auth.py`) phục vụ phát triển tính năng ở các giai đoạn tiếp theo. |
| 6 | Ẩn hiện tự động | Thêm tính năng tự động ẩn/hiện thanh điều hướng và thanh truy cập nhanh theo hành động cuộn trang của người dùng. |
| 7 | Lịch Vạn Sự — viết lại | Viết lại toàn bộ thuật toán (`core/`, `engine/`) và giao diện (`components/`) của tính năng Lịch Vạn Sự. |
| 8 | Trang đang phát triển | Các trang chưa hoàn thiện hiển thị component `UnderDevelopment` với nội dung "UI&UX đang phát triển". |
| 9 | Footer | Rút gọn Footer, cập nhật nội dung mô tả. |
| 10 | Số điện thoại liên hệ | Cập nhật 2 số điện thoại liên hệ tại Footer: `0924.616.199` và `0385.497.085`. Header hiển thị ngẫu nhiên 1 trong 2 số theo từng phiên truy cập (xem `hotline.js`). |
| 11 | Lỗi Safari | Xử lý các lỗi hiển thị lá số và xuất lá số trên trình duyệt Safari. |
| 12 | Tái cấu trúc dự án | Tái cấu trúc toàn diện thư mục và tệp tin dự án theo kiến trúc Feature-Based (xem mục 1). |

---

## 3. Hướng dẫn chạy trên máy cá nhân

### 3.1. Yêu cầu phần mềm

| Phần mềm | Phiên bản tối thiểu | Kiểm tra |
| --------- | ------------------- | --------- |
| Node.js | 18 trở lên | `node --version` |
| npm | 9 trở lên | `npm --version` |
| Python | 3.9 trở lên | `python --version` |
| Git | Bất kỳ | `git --version` |

### 3.2. Cách 1 — Khởi chạy bằng 1 thao tác (khuyến nghị)

1. Mở thư mục gốc dự án.
2. Nhấp đúp vào file `start.bat`.
3. Hệ thống tự động:
   - Giải phóng cổng 8080 và 5173 nếu đang bị chiếm.
   - Cài đặt thư viện JavaScript (`npm install`) nếu chưa có `node_modules`.
   - Khởi động Backend (cổng 8080).
   - Khởi động Frontend (cổng 5173).
   - Mở trình duyệt tại `http://localhost:5173`.
4. Để dừng: nhấn `Ctrl + C` trong cửa sổ lệnh.

### 3.3. Cách 2 — Khởi chạy thủ công

#### Bước 1: Cài đặt thư viện

```powershell
# Thư viện Frontend
cd frontend
npm install

# Thư viện Backend (nếu dùng Firebase)
cd ../backend
pip install -r requirements.txt
```

#### Bước 2: Khởi chạy Backend

```powershell
cd backend/src
python server.py
```

Kiểm tra: truy cập `http://127.0.0.1:8080/api/health` trên trình duyệt.

#### Bước 3: Khởi chạy Frontend (mở cửa sổ lệnh mới)

```powershell
cd frontend
npm run dev
```

Truy cập `http://localhost:5173` để xem website.

### 3.4. Danh sách địa chỉ truy cập

| Dịch vụ | Địa chỉ |
| -------- | -------- |
| Giao diện chính | `http://localhost:5173` |
| API tính toán tử vi | `http://127.0.0.1:8080/api/calculate` |
| Kiểm tra sức khỏe API | `http://127.0.0.1:8080/api/health` |

---

## 4. Hướng dẫn thiết lập bảo mật

### 4.1. File nhạy cảm

File `.gitignore` đã cấu hình loại trừ tự động:

```text
# Biến môi trường
.env, .env.*

# Chứng chỉ và khóa
client_secret*.json
firebase-service-account*.json
*-service-account*.json
*.enc

# Cơ sở dữ liệu cục bộ
*.db, *.sqlite, *.sqlite3
```

> **Lưu ý:** Tuyệt đối không đẩy các file trên lên Git/GitHub. Nếu commit nhầm, cần thu hồi ngay lập tức.

### 4.2. Thiết lập Google Firebase (tùy chọn)

Để lưu trữ dữ liệu trên đám mây thay vì SQLite cục bộ:

1. Truy cập [Firebase Console](https://console.firebase.google.com/project/tu-vi-hong/firestore) và kích hoạt Firestore Database.
2. Vào mục Cài đặt dự án → Tài khoản dịch vụ → Tạo khóa riêng tư mới.
3. Tải file JSON về, đổi tên thành `firebase-service-account.json`.
4. Đặt file vào thư mục `security/keys-and-secrets/` hoặc `backend/`.
5. Hệ thống tự động phát hiện và chuyển sang dùng Firebase (cơ chế Dual-Engine).

Chuyển dữ liệu từ SQLite sang Firebase:

```powershell
cd backend/src/core
python migrate_to_firebase.py
```

### 4.3. Thiết lập xác thực Google OAuth

File `client_secret_*.json` nằm trong `security/keys-and-secrets/`. Biến môi trường tương ứng trong `backend/.env`:

```env
GOOGLE_CLIENT_ID=714306691526-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.4. Các lớp bảo mật tích hợp sẵn

| Lớp bảo vệ | Mô tả |
| ----------- | ------ |
| Chống Path Traversal | Backend chặn các ký tự `..`, đường dẫn nhạy cảm, phần mở rộng `.py`, `.env`, `.git`, `.key`, `.log` |
| CORS Whitelisting | Chỉ cho phép domain được chỉ định trong biến `CORS_ORIGIN` |
| HTTP Security Headers | `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Cache-Control` |
| DPoP (RFC 9449) | Module `dpop.js` sinh chữ ký số ECDSA xác thực thiết bị qua WebCrypto API |
| E2EE (AES-256-GCM) | Module WebAssembly mã hóa dữ liệu đầu cuối trước khi truyền |
| CSP động | Script `generate_csp.py` sinh Content Security Policy chống tấn công XSS |

---

## 5. Hướng dẫn đưa lên máy chủ

### 5.1. Bước 1 — Build bản phát hành

```powershell
cd frontend
npm run build
```

Kết quả xuất ra thư mục `releases/dist/`.

> Cấu hình trong `vite.config.js` đã tắt source map (`sourcemap: false`) để tránh lộ mã nguồn gốc.

### 5.2. Bước 2 — Sinh cấu hình bảo mật CSP (tùy chọn)

```bash
pip install -r security/devsecops/requirements.txt
python security/devsecops/generate_csp.py --manifest security/devsecops/wasm_manifest.json --output releases/dist/nginx_csp.conf
```

### 5.3. Bước 3 — Đẩy lên GitHub

```powershell
git status
git add .
git commit -m "Release 26/09/2026 — Tái cấu trúc & cập nhật 2609"
git push origin main
```

> Trước khi push, chạy `git status` để xác nhận không có file nhạy cảm trong danh sách: `.env`, `firebase-service-account.json`, `client_secret_*.json`, `*.db`, `*.enc`.

### 5.4. Bước 4 — Triển khai trên máy chủ Linux

#### Cách A: Nginx thủ công

**1. Kéo mã nguồn:**

```bash
cd /var/www
git clone https://github.com/vinhicut/tuvivietnam-react.git tuvi
cd tuvi
```

**2. Khởi chạy Backend:**

```bash
cd backend
pip3 install -r requirements.txt
cd src
python3 server.py &
```

**3. Sao chép Frontend đã build:**

```bash
cp -r releases/dist/* /var/www/tuvi/dist/
# hoặc build trực tiếp trên máy chủ:
cd frontend && npm install && npm run build
cp -r ../releases/dist/* /var/www/tuvi/dist/
```

**4. Cấu hình Nginx:**

Tạo file `/etc/nginx/sites-available/tuvi.conf`:

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    listen 80;
    server_name ten-mien-cua-ban.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ten-mien-cua-ban.com;

    ssl_certificate     /etc/letsencrypt/live/ten-mien-cua-ban.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ten-mien-cua-ban.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        root /var/www/tuvi/dist;
        index index.html;
        try_files $uri $uri/ /index.html;

        location ~* \.(otf|ttf|woff2|svg|png|jpg|webp|css|js|wasm)$ {
            expires 30d;
            add_header Cache-Control "public, no-transform";
        }
    }

    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;
    }

    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

**5. Kích hoạt Nginx:**

```bash
sudo ln -s /etc/nginx/sites-available/tuvi.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**6. Cài đặt SSL miễn phí:**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ten-mien-cua-ban.com
```

#### Cách B: Docker

```bash
cd /var/www/tuvi
docker-compose up -d --build
```

File `docker-compose.yml` và `Dockerfile` nằm trong `deployment/docker/`.

### 5.5. Bước 5 — Quản trị secrets trên môi trường thật

Không lưu mật khẩu hay khóa trong file `.env` trên máy chủ thật. Dùng HashiCorp Vault:

```bash
export VAULT_ADDR="https://vault.ten-mien-cua-ban.com:8200"
export VAULT_TOKEN="s.tokenDuocCapBoi_Vault"
python security/devsecops/vault_secrets.py --path secret/data/tuvi/production
```

---

## 6. Lưu ý quan trọng

### 6.1. Bảng lá số (astrology-engine)

> **`box-sizing: content-box` trên `.tuvi-board-wrapper` là bắt buộc.**
> Viền 2px phải nằm ngoài vùng nội dung 737px. Nếu đổi sang `border-box`, bảng co lại 733px và lưới cung bị lệch.

> **Phải tái tạo bundle sau mỗi lần sửa CSS/JS.**
> File `laso-tuvi.bundle.html` là phiên bản gộp toàn bộ. Sau khi sửa bất kỳ file nào trong `astrology-engine/`, chạy:
>
> ```powershell
> python make_bundle.py
> ```

### 6.2. Font chữ trên iOS

Phiên bản hiện tại đã xóa override `font-size: 16px` trên thiết bị di động để đồng bộ hiển thị giữa label và input (đều 12px). Hệ quả: Safari trên iOS có thể tự động phóng to khi người dùng chạm vào ô nhập liệu do font nhỏ hơn 16px. Đây là sự đánh đổi đã được ghi nhận.

### 6.3. Cơ chế Dual-Engine (Firebase / SQLite)

- Hệ thống hoạt động bình thường khi chưa kích hoạt Firebase. Khi không tìm thấy `firebase-service-account.json`, dữ liệu tự động lưu vào SQLite cục bộ.
- Khi đã kích hoạt Firebase, chạy `migrate_to_firebase.py` để chuyển toàn bộ dữ liệu cũ lên đám mây.

### 6.4. Biến môi trường CORS

Trong `backend/.env`, biến `CORS_ORIGIN` hiện đặt là `*`. Trước khi đưa lên máy chủ thật, đổi thành tên miền cụ thể:

```env
CORS_ORIGIN=https://ten-mien-cua-ban.com
```

### 6.5. Số điện thoại liên hệ

Hai số điện thoại liên hệ chính thức:

- `0924.616.199`
- `0385.497.085`

Cơ chế hiển thị: Footer hiển thị cả 2 số. Header chọn ngẫu nhiên 1 trong 2 số và giữ nguyên trong suốt phiên truy cập (xem `frontend/src/shared/utils/hotline.js`).

### 6.6. Danh sách kiểm tra trước khi phát hành

| STT | Hạng mục | Trạng thái |
| :---: | -------- | :--------: |
| 1 | Chạy `npm run build` không có lỗi | |
| 2 | Chạy `python test_engine.py` — tất cả kiểm thử đạt | |
| 3 | File `.env`, `*.json` bí mật, `*.db` không nằm trong `git status` | |
| 4 | Cài đặt SSL (HTTPS) trên máy chủ | |
| 5 | Đổi `CORS_ORIGIN` sang tên miền chính thức | |
| 6 | Bật rate limiting trên Nginx | |
| 7 | Thư mục `.git` không truy cập được từ trình duyệt | |
| 8 | Chạy `make_bundle.py` tái tạo bundle sau khi sửa CSS/JS | |

---

> **Tài liệu bàn giao phiên bản 26/09/2026.**
