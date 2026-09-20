import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import haLogo from '../assets/ha-logo.png';

const softwareItems = [
  { label: 'Bói Kiều & Chiêm Quẻ', to: '/boi-kieu' },
  { label: 'Kỳ Môn Độn Giáp', to: '/ky-mon-don-giap' },
  { label: 'La Kinh Phong Thủy', to: '/la-kinh-phong-thuy' },
  { label: 'Lá Số Tử Vi Đẩu Số', to: '/la-so-tu-vi' },
  { label: 'Lịch Vạn Sự & Tiết Khí', to: '/lich-van-su' },
  { label: 'Luận Giải Tử Vi AI', to: '/luan-giai-tu-vi-ai' },
  { label: 'Lục Nhâm Đại Độn', to: '/luc-nham-dai-don' },
  { label: 'Tứ Trụ Bát Tự', to: '/tu-tru' },
];

const headerQuickButtons = [
  { label: 'Phong Thủy', to: '/la-kinh-phong-thuy' },
  { label: 'Kỳ Môn', to: '/ky-mon-don-giap' },
  { label: 'Lịch Vạn Sự', to: '/lich-van-su' },
  { label: 'Lá Số Tử Vi', to: '/la-so-tu-vi' },
  { label: 'Bói Dịch', to: '/boi-kieu' },
  { label: 'Tứ Trụ', to: '/tu-tru' },
];

function Navbar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);

  // Close mobile menu when navigating to another route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="top-navigation-wrapper" ref={headerRef}>
      {/* HEADER ROW */}
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <div className="brand-logo-wrap">
              <img src={haLogo} alt="Tử Vi Hồng Ân Logo" className="brand-logo-img" />
            </div>
            <div className="logo-text">
              <h1 className="logo-main">TỬ VI HỒNG ÂN</h1>
            </div>
          </Link>

          {/* 6 Quick Action Buttons (2 rows x 3 columns) */}
          <div className="header-quick-buttons desktop-only">
            <div className="quick-buttons-grid">
              {headerQuickButtons.map((btn) => (
                <Link
                  key={btn.label}
                  to={btn.to}
                  className={`header-quick-btn ${location.pathname === btn.to ? 'active' : ''}`}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Hotline Badge */}
          <div className="header-actions desktop-only">
            <div className="header-info-badge">
              <span className="info-title">Tư vấn học thuật & Luận giải:</span>
              <a href="tel:0920461699" className="info-hotline">0920.461.699</a>
            </div>
          </div>

          {/* Mobile Search & Menu Button: placed in the same line with the logo */}
          <div className="mobile-header-controls mobile-only">
            <div className="mobile-search">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm"
              />
              <button type="button" className="btn-search" aria-label="Tìm kiếm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>

            <button
              type="button"
              className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            >
              {mobileMenuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="mobile-menu-dropdown mobile-only">
            <div className="mobile-quick-buttons">
              <div className="quick-buttons-grid">
                {headerQuickButtons.map((btn) => (
                  <Link
                    key={btn.label}
                    to={btn.to}
                    className={`header-quick-btn ${location.pathname === btn.to ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {btn.label}
                  </Link>
                ))}
              </div>
            </div>
            <ul className="mobile-nav-menu">
              <li className={location.pathname === '/' ? 'active' : ''}>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  Trang chủ
                </Link>
              </li>
              <li className={`has-mobile-dropdown ${mobileSubOpen ? 'open' : ''}`}>
                <div
                  className="mobile-dropdown-header"
                  onClick={() => setMobileSubOpen(!mobileSubOpen)}
                >
                  <span>Công cụ</span>
                  <span className="caret-mobile">{mobileSubOpen ? '▴' : '▾'}</span>
                </div>
                {mobileSubOpen && (
                  <ul className="mobile-submenu">
                    {softwareItems.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className={location.pathname === item.to ? 'active' : ''}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li className={location.pathname.startsWith('/chuyen-muc') ? 'active' : ''}>
                <Link to="/chuyen-muc" onClick={() => setMobileMenuOpen(false)}>
                  Bài viết
                </Link>
              </li>
              <li>
                <a href="#diendan" onClick={() => setMobileMenuOpen(false)}>
                  Diễn đàn
                </a>
              </li>
              <li>
                <a href="#khoahoc" onClick={() => setMobileMenuOpen(false)}>
                  Khóa học
                </a>
              </li>
              <li className={location.pathname === '/lien-he' ? 'active' : ''}>
                <Link to="/lien-he" onClick={() => setMobileMenuOpen(false)}>
                  Liên hệ
                </Link>
              </li>
            </ul>

            <div className="mobile-menu-contact">
              <div className="mobile-contact-title">Tư vấn học thuật & Luận giải:</div>
              <a href="tel:0920461699" className="mobile-hotline-btn">
                📞 0920.461.699
              </a>
            </div>
          </div>
        )}
      </header>

      {/* DESKTOP NAVBAR ROW (Hidden on mobile) */}
      <nav className="navbar desktop-only">
        <div className="navbar-container">
          <ul className="nav-menu">
            <li className={location.pathname === '/' ? 'nav-item active' : 'nav-item'}>
              <Link to="/">Trang chủ</Link>
            </li>
            <li className="nav-item has-dropdown">
              <Link to="/la-so-tu-vi">
                Công cụ <span className="caret">▾</span>
              </Link>
              <ul className="dropdown-menu">
                {softwareItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className={location.pathname === item.to ? 'active' : ''}
                    >
                      <span className="dd-label">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className={location.pathname.startsWith('/chuyen-muc') ? 'nav-item active' : 'nav-item'}>
              <Link to="/chuyen-muc">Bài viết</Link>
            </li>
            <li className="nav-item">
              <a href="#diendan">Diễn đàn</a>
            </li>
            <li className="nav-item">
              <a href="#khoahoc">Khóa học</a>
            </li>
            <li className={location.pathname === '/lien-he' ? 'nav-item active' : 'nav-item'}>
              <Link to="/lien-he">Liên hệ</Link>
            </li>
          </ul>

          <div className={`navbar-search ${searchFocused ? 'focused' : ''}`}>
            <input
              type="text"
              placeholder="Tra cứu sao, cách cục, bài viết..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <button type="button" className="btn-search" aria-label="Tìm kiếm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
