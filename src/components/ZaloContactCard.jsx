import React from "react";
import "./ZaloContactCard.css";
import logoTuvihongan from "../assets/logotuvihongan.jpg";
import Zalo from "../assets/zalo.jpg";

const ZaloContactCard = () => {
  return (
    <div className="zalo-card">
      {/* =========================================
          HEADER
          Logo trái - Thông tin giữa - QR phải
          ========================================= */}
      <div className="header">
        {/* Logo bên trái */}
        <img
          src={logoTuvihongan}
          alt="Tử Vi Hồng Ân"
          className="zalo-logo"
        />

        {/* Thông tin ở giữa */}
        <div className="info">
          <div className="name">
            Tử Vi Hồng Ân
            <span className="verified"></span>
          </div>
          <div className="category">
            Tử vi & Phong thủy
          </div>
          <a
            href="https://tuvihongan.com/lien-he/zalo"
            className="message-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              width="18"
              height="18"
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2 .9 2 2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
            Nhắn tin
          </a>
        </div>

        {/* QR bên phải */}
        <div className="header-qr">
          <img
            src={Zalo}
            alt="Mã QR Zalo Tử Vi Hồng Ân"
            className="qr-image"
          />
        </div>
      </div>

      {/* =========================================
          QR / HƯỚNG DẪN
          ========================================= */}
      <div className="qr-section">
        <div className="qr-text">
          <strong>Kết nối với Tử Vi Hồng Ân</strong>
          <p>
            Mở Zalo, bấm quét QR để kết bạn
            và nhắn tin với chúng tôi.
          </p>
        </div>
      </div>

      {/* =========================================
          THÔNG TIN CHI TIẾT
          ========================================= */}
      <div className="details">
        <div className="details-title">
          Thông tin chi tiết
        </div>

        {/* Địa chỉ */}
        <div className="detail-item">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span>
            Khu đô thị Tây Mỗ, Nam Từ Liêm, Hà Nội
          </span>
        </div>

        {/* Điện thoại */}
        <div className="detail-item">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C9.39 21 2 13.61 2 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          <a href="tel:0924616199">
            0924 616 199
          </a>
        </div>

        {/* Thời gian */}
        <div className="detail-item">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
          <span>
            Thứ 2 - Thứ 7 • 8:00 - 17:00
          </span>
        </div>

        {/* Website */}
        <div className="detail-item">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8H10z" />
          </svg>
          <a
            href="https://tuvihongan.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            tuvihongan.com
          </a>
        </div>
      </div>

      {/* =========================================
          MÔ TẢ
          ========================================= */}
      <div className="description">
        <strong>Tử Vi Hồng Ân</strong>
        <p>
          Diễn đàn Tử Vi Hồng Ân - Nơi chia sẻ kiến thức
          về Tử Vi Đẩu Số, Phong thủy và Văn hóa Phương Đông.
        </p>
        <p>
          Thành lập từ năm 2006 bởi thầy Trần Ngọc Điệp
          (tuetvnb), cùng cộng đồng yêu thích môn huyền học.
        </p>
        <p>
          Cam kết cung cấp nội dung chính xác, chuyên sâu
          và hỗ trợ tận tình.
        </p>
      </div>
    </div>
  );
};

export default ZaloContactCard;