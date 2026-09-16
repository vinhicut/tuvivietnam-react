
import React from 'react';
import { Link } from 'react-router-dom';

const softwareItems = [
  {
    icon: '🤖',
    label: 'Luận Giải Tử Vi AI',
    to: '/luan-giai-tu-vi-ai',
  },
  {
    icon: '🌐',
    label: 'Lá Số Tử Vi',
    to: '/la-so-tu-vi',
  },
  {
    icon: '🏠',
    label: 'La Kinh Phong Thủy',
    to: '/la-kinh-phong-thuy',
  },
  {
    icon: '☯️',
    label: 'Bói Dịch Tử Vi Việt Nam',
    to: '/boi-dich-tu-vi-viet-nam',
  },
  {
    icon: '🔄',
    label: 'Bói Dịch PT Thăng Long',
    to: '/boi-dich-pt-thang-long',
  },
  {
    icon: '📅',
    label: 'Lịch Vạn Sự',
    to: '/lich-van-su',
  },
  {
    icon: '🧭',
    label: 'Lục Nhâm Đại Độn',
    to: '/luc-nham-dai-don',
  },
  {
    icon: '🚩',
    label: 'Kỳ Môn Độn Giáp',
    to: '/ky-mon-don-giap',
  },
];

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-menu">

        {/* TRANG CHỦ */}
        <li>
          <Link to="/">
            <span className="home-icon">🏠</span> TRANG CHỦ ▾
          </Link>
        </li>

        {/* CHUYÊN MỤC */}
        <li>
          <Link to="/chuyen-muc">
            CHUYÊN MỤC ▾
          </Link>
        </li>

        {/* PHẦN MỀM */}
        <li className="has-dropdown">
          <Link to="/phan-mem">
            PHẦN MỀM ▾
          </Link>

          <ul className="dropdown-menu">
            {softwareItems.map((item) => (
              <li key={item.label}>
                <Link to={item.to}>
                  <span className="dd-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </li>

        {/* SẢN PHẨM */}
        <li>
          <Link to="/san-pham">
            SẢN PHẨM
          </Link>
        </li>

        {/* KHOÁ HỌC */}
        <li>
          <Link to="/khoa-hoc">
            KHOÁ HỌC
          </Link>
        </li>

        {/* DIỄN ĐÀN */}
        <li>
          <Link to="/dien-dan">
            DIỄN ĐÀN ▾
          </Link>
        </li>

        {/* LIÊN HỆ */}
        <li>
          <Link to="/lien-he">
            LIÊN HỆ
          </Link>
        </li>

      </ul>

      {/* SEARCH */}
      <div className="search-icon">
        🔍
      </div>
    </nav>
  );
}

export default Navbar;

