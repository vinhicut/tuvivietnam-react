import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import haLogo from '../assets/ha-logo.png';
import AuthModal from '../../features/auth/AuthModal';
import { getSessionHotline, formatHotline } from '../utils/hotline';

const coreTools = [
  { label: 'LÁ SỐ TỬ VI', to: '/la-so-tu-vi' },
  { label: 'TAROT KIỀU', to: '/boi-kieu' },
  { label: 'KỲ MÔN', to: '/ky-mon-don-giap' },
  { label: 'PHONG THỦY', to: '/la-kinh-phong-thuy' },
  { label: 'LỊCH VẠN SỰ', to: '/lich-van-su' },
  { label: 'THẦN SỐ HỌC', to: '/than-so-hoc' },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [hotline, setHotline] = useState('0924616199');
  const location = useLocation();
  const headerRef = useRef(null);

  useEffect(() => {
    setHotline(getSessionHotline());
    try {
      const saved = localStorage.getItem('tuvi_user');
      if (saved) setUser(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('tuvi_token');
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch {
      /* ignore */
    }
    localStorage.removeItem('tuvi_token');
    localStorage.removeItem('tuvi_user');
    setUser(null);
  };

  const [isNavVisible, setIsNavVisible] = useState(true);
  const isNavVisibleRef = useRef(true);

  const setNavVisibility = (visible) => {
    if (isNavVisibleRef.current !== visible) {
      isNavVisibleRef.current = visible;
      setIsNavVisible(visible);
    }
  };

  // Close mobile menu when navigating to another route and restore visibility
  useEffect(() => {
    setMobileMenuOpen(false);
    setNavVisibility(true);
  }, [location.pathname]);

  // Smart Scroll Behavior: Chống giật lag 100%
  useEffect(() => {
    let lastScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
    let accumulatedScrollUp = 0;
    let accumulatedScrollDown = 0;
    let ticking = false;

    const SCROLL_UP_THRESHOLD = 50; // Ngưỡng tích lũy khi cuộn ngược lên để hiển thị lại
    const SCROLL_DOWN_THRESHOLD = 30; // Ngưỡng tích lũy khi cuộn xuống để ẩn
    const TOP_PIN_THRESHOLD = 20; // Sát đỉnh trang (<= 20px) luôn hiển thị

    const updateScrollState = () => {
      const currentScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);

      // Nếu menu mobile hoặc auth modal đang mở, giữ hiển thị đầy đủ
      if (mobileMenuOpen || authOpen) {
        setNavVisibility(true);
        accumulatedScrollUp = 0;
        accumulatedScrollDown = 0;
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      // Sát đỉnh trang: Luôn hiển thị bình thường
      if (currentScrollY <= TOP_PIN_THRESHOLD) {
        setNavVisibility(true);
        accumulatedScrollUp = 0;
        accumulatedScrollDown = 0;
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (delta > 0) {
        // Cuộn xuống (Scroll Down)
        accumulatedScrollUp = 0;
        accumulatedScrollDown += delta;

        if (isNavVisibleRef.current && accumulatedScrollDown >= SCROLL_DOWN_THRESHOLD) {
          setNavVisibility(false);
          accumulatedScrollDown = 0;
        }
      } else if (delta < 0) {
        // Cuộn ngược lên (Scroll Up)
        accumulatedScrollDown = 0;
        accumulatedScrollUp += Math.abs(delta);

        if (!isNavVisibleRef.current && accumulatedScrollUp >= SCROLL_UP_THRESHOLD) {
          setNavVisibility(true);
          accumulatedScrollUp = 0;
        }
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen, authOpen]);

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
    <>
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

          {/* User Auth Badge (Google Avatar & Name/Email) - Desktop */}
          <div
            className="header-user-badge desktop-only"
            onClick={() => setAuthOpen(true)}
            title={user ? 'Quản lý tài khoản' : 'Đăng nhập tài khoản Google'}
          >
            <div className="user-avatar-wrap">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || 'Người dùng'} className="user-avatar-img" />
              ) : (
                <div className="user-avatar-placeholder">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              )}
            </div>
            <div className="user-info-text">
              <span className="user-name-line">{user?.name || 'ĐĂNG NHẬP'}</span>
              <span className="user-email-line">{user?.email || 'TÀI KHOẢN GOOGLE'}</span>
            </div>
          </div>

          {/* 6 Quick Action Buttons (2 rows x 3 columns) - Desktop */}
          <div className="header-quick-buttons desktop-only">
            <div className="quick-buttons-grid">
              {coreTools.map((btn) => (
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
              <span className="info-title">TƯ VẤN HỌC THUẬT & LUẬN GIẢI</span>
              <a href={`tel:${hotline}`} className="info-hotline">{formatHotline(hotline)}</a>
            </div>
          </div>

          {/* Mobile Header Controls: User + Hotline Icon + Menu Button */}
          <div className="mobile-header-controls mobile-only">
            <a
              href={`tel:${hotline}`}
              className="mobile-hotline-icon-btn"
              title={`Gọi hotline ${formatHotline(hotline)}`}
              aria-label="Gọi hotline"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </a>

            <button
              type="button"
              className="mobile-auth-icon-btn"
              onClick={() => setAuthOpen(true)}
              aria-label="Đăng nhập"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="User" className="user-avatar-img-sm" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </button>

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
            <ul className="mobile-nav-menu">
              <li className={location.pathname === '/' ? 'active' : ''}>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  TRANG CHỦ
                </Link>
              </li>
              <li className={location.pathname === '/la-so-tu-vi' ? 'active' : ''}>
                <Link to="/la-so-tu-vi" onClick={() => setMobileMenuOpen(false)}>
                  LÁ SỐ
                </Link>
              </li>
              <li className={location.pathname.startsWith('/chuyen-muc') ? 'active' : ''}>
                <Link to="/chuyen-muc" onClick={() => setMobileMenuOpen(false)}>
                  BÀI VIẾT
                </Link>
              </li>
              <li className={location.pathname === '/dien-dan' ? 'active' : ''}>
                <Link to="/dien-dan" onClick={() => setMobileMenuOpen(false)}>
                  DIỄN ĐÀN
                </Link>
              </li>
              <li className={location.pathname === '/khoa-hoc' ? 'active' : ''}>
                <Link to="/khoa-hoc" onClick={() => setMobileMenuOpen(false)}>
                  KHÓA HỌC
                </Link>
              </li>
              <li className={location.pathname === '/chinh-sach' ? 'active' : ''}>
                <Link to="/chinh-sach" onClick={() => setMobileMenuOpen(false)}>
                  CHÍNH SÁCH
                </Link>
              </li>
              <li className={location.pathname === '/lien-he' ? 'active' : ''}>
                <Link to="/lien-he" onClick={() => setMobileMenuOpen(false)}>
                  LIÊN HỆ
                </Link>
              </li>
            </ul>

            <div className="mobile-menu-contact">
              <div className="mobile-contact-title">TƯ VẤN HỌC THUẬT & LUẬN GIẢI</div>
              <a href={`tel:${hotline}`} className="mobile-hotline-btn">
                📞 {formatHotline(hotline)}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Cụm 6 Nút Nhanh Ngay Dưới Thanh Logo & Brand trên Mobile */}
      <div
        className={`mobile-header-quick-bar mobile-only ${!isNavVisible ? 'mobile-quick-hidden' : ''}`}
        aria-label="Khối truy cập tính năng nhanh"
      >
        <div className="mobile-quick-grid">
          {coreTools.map((btn) => (
            <Link
              key={btn.label}
              to={btn.to}
              className={`mobile-quick-item ${location.pathname === btn.to ? 'active' : ''}`}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </div>

      {/* DESKTOP NAVBAR ROW (Hidden on mobile) */}
      <nav className={`navbar desktop-only ${!isNavVisible ? 'navbar-hidden' : ''}`}>
        <div className="navbar-container">
          <ul className="nav-menu">
            <li className={location.pathname === '/' ? 'nav-item active' : 'nav-item'}>
              <Link to="/">TRANG CHỦ</Link>
            </li>
            <li className={location.pathname === '/la-so-tu-vi' ? 'nav-item active' : 'nav-item'}>
              <Link to="/la-so-tu-vi">LÁ SỐ</Link>
            </li>
            <li className={location.pathname.startsWith('/chuyen-muc') ? 'nav-item active' : 'nav-item'}>
              <Link to="/chuyen-muc">BÀI VIẾT</Link>
            </li>
            <li className={location.pathname === '/dien-dan' ? 'nav-item active' : 'nav-item'}>
              <Link to="/dien-dan">DIỄN ĐÀN</Link>
            </li>
            <li className={location.pathname === '/khoa-hoc' ? 'nav-item active' : 'nav-item'}>
              <Link to="/khoa-hoc">KHÓA HỌC</Link>
            </li>
            <li className={location.pathname === '/chinh-sach' ? 'nav-item active' : 'nav-item'}>
              <Link to="/chinh-sach">CHÍNH SÁCH</Link>
            </li>
            <li className={location.pathname === '/lien-he' ? 'nav-item active' : 'nav-item'}>
              <Link to="/lien-he">LIÊN HỆ</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <AuthModal
      open={authOpen}
      onClose={() => setAuthOpen(false)}
      user={user}
      onAuthSuccess={(u) => setUser(u)}
      onLogout={handleLogout}
    />
  </>
  );
}

export default Navbar;
