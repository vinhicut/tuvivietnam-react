# Release Notes — Release 2609 (26/09/2026)

**Tag:** `release-2609` / `v1.3.0`  
**Ngày phát hành:** 26/09/2026  
**Nhánh:** `main`  

---

## Tóm tắt

Phiên bản Release 2609 là bản phát hành chính thức thứ ba của **Tử Vi Hồng Ân**, tập trung vào tái thiết kế giao diện điều hướng, viết lại toàn bộ engine Lịch Vạn Sự, cập nhật bộ Tarot Kiều đầy đủ (210 quẻ), và bổ sung các trang mới.

---

## Danh mục thay đổi

| STT | Hạng mục | Mô tả |
| :---: | -------- | ------ |
| 1 | Hoãn tích hợp trang chủ | Không triển khai được giao diện trang chủ từ kho `vinhicut/tuvihongan` trong phiên bản này. Hạng mục chuyển sang giai đoạn tiếp theo. |
| 2 | Cập nhật thanh điều hướng | Cập nhật thanh điều hướng (Navbar) theo phương án thiết kế của Leader2 Tuyết. |
| 3 | Giao diện Tarot Kiều | Cập nhật giao diện bói bài Kiều, bao gồm bộ ảnh quẻ (`Que-001.png` → `Que-210.png`), bánh xe quay (`wheel.png`), hình nền và dữ liệu giải quẻ. |
| 4 | Luồng lập lá số | Tinh chỉnh luồng thao tác lập lá số tử vi. |
| 5 | Backend xác thực Google | Tích hợp backend đăng nhập Google ngầm (`auth.py`, `routes_auth.py`) phục vụ phát triển tính năng ở các giai đoạn tiếp theo. |
| 6 | Ẩn hiện tự động | Thêm tính năng tự động ẩn/hiện thanh điều hướng và thanh truy cập nhanh theo hành động cuộn trang của người dùng. |
| 7 | Lịch Vạn Sự — viết lại | Viết lại toàn bộ thuật toán (`core/`, `engine/`) và giao diện (`components/`) của tính năng Lịch Vạn Sự. |
| 8 | Trang đang phát triển | Các trang chưa hoàn thiện hiển thị component `UnderDevelopment`. |
| 9 | Footer | Rút gọn Footer, cập nhật nội dung mô tả. |
| 10 | Số điện thoại liên hệ | Cập nhật 2 số điện thoại liên hệ. Header hiển thị ngẫu nhiên 1 trong 2 số theo từng phiên truy cập (`hotline.js`). |
| 11 | Lỗi Safari | Xử lý các lỗi hiển thị lá số và xuất lá số trên trình duyệt Safari. |
| 12 | Tái cấu trúc dự án | Tái cấu trúc toàn diện thư mục và tệp tin dự án theo kiến trúc Feature-Based. |

---

## Thông tin kỹ thuật

| Thuộc tính | Giá trị |
| --------- | ------- |
| Frontend  | React 19 + Vite 8 + TailwindCSS 4 |
| Backend   | Python Flask (cổng 8080) |
| Build tool | Vite 8.2.2 |
| JS bundle  | `index-CZE0yYkQ.js` — 332.06 kB (gzip: 101.74 kB) |
| CSS bundle | `index-bcFkLvc2.css` — 83.64 kB (gzip: 16.58 kB) |
| Source maps | Tắt (production security) |

---

## Hướng dẫn chạy bản thử nghiệm

```bash
# Tại thư mục: C:\Users\trann\Documents\Tử Vi Hồng Ân Public Website\release website 2609\
python "start_local_sever_for_release_ version.py"
```

Script tự động:
1. Giải phóng cổng 8080 nếu bị chiếm
2. Khởi động backend API tại `http://localhost:8080`
3. Kết nối Cloudflare Quick Tunnel và in ra URL công khai HTTPS

---

## Files trong release

```
release website 2609/
├── frontend/           ← Toàn bộ web app đã build (React → static HTML/CSS/JS)
│   ├── index.html
│   ├── assets/         ← JS bundle, CSS bundle, fonts, logo
│   ├── astrology-engine/   ← Engine vẽ lá số (HTML/WASM)
│   └── tarot-kieu/     ← 210 quẻ Kiều + bánh xe + dữ liệu
├── backend/            ← Máy chủ API Python Flask
│   ├── src/server.py   ← Điểm khởi chạy (cổng 8080)
│   ├── requirements.txt
│   └── .env.example
└── start_local_sever_for_release_ version.py   ← Script 1-click
```
