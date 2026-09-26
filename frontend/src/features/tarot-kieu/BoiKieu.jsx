import React, { useState, useEffect, useRef, useCallback } from 'react';
import './BoiKieu.css';

// 12 ô số cố định tương ứng 12 nan trên ảnh nón kỳ diệu
const WHEEL_NUMBERS = [1, 18, 36, 54, 72, 90, 108, 126, 144, 162, 180, 210];
const SEGMENTS = WHEEL_NUMBERS.length;
const SEG_ANGLE = 360 / SEGMENTS; // 30 độ

const getCardImgSrc = (num) => {
  const norm = ((num - 1) % 210) + 1;
  const padded = String(norm).padStart(3, '0');
  return `/tarot-kieu/cards/Que-${padded}.png`;
};

function BoiKieu() {
  // Trạng thái quay quẻ
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [resultText, setResultText] = useState('');
  const [mainQue, setMainQue] = useState(null);

  // Modal quẻ chi tiết
  const [modalQue, setModalQue] = useState(null);

  // Cuộn vô hạn danh sách quẻ theo thứ tự 1..210 (lặp vô tận nếu cuộn tiếp)
  const [displayedCount, setDisplayedCount] = useState(24);
  const sentinelRef = useRef(null);

  // Cuộn lên đầu trang khi vào
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Xử lý quay bánh xe xin quẻ
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResultText('Đang bốc quẻ thiêng...');

    // Chọn ngẫu nhiên 1 trong 12 ô số trên nón
    const stopIndex = Math.floor(Math.random() * SEGMENTS);
    const targetQue = WHEEL_NUMBERS[stopIndex];

    // Tính góc quay chính xác để ô stopIndex dừng ngay dưới mũi tên
    const baseAngle = (360 - ((currentRotation % 360) + stopIndex * SEG_ANGLE) % 360) % 360;
    const extraSpins = (6 + Math.floor(Math.random() * 4)) * 360; // 6 đến 9 vòng quay
    const nextRotation = currentRotation + extraSpins + baseAngle;

    setCurrentRotation(nextRotation);

    // Sau khi kết thúc animation quay (4.8s)
    setTimeout(() => {
      setResultText(`✦ Quẻ số ${targetQue} ✦`);
      setMainQue(targetQue);
      setIsSpinning(false);
      setModalQue(targetQue); // Tự động mở modal xem quẻ chi tiết
    }, 4900);
  };

  // Infinite scroll observer: tự động tải thêm quẻ khi cuộn đến cuối
  const loadMoreCards = useCallback(() => {
    setDisplayedCount((prev) => prev + 24);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreCards();
        }
      },
      { rootMargin: '300px' }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [loadMoreCards]);

  // Đóng modal bằng phím ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModalQue(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Danh sách các quẻ theo thứ tự
  const cardsList = Array.from({ length: displayedCount }, (_, i) => (i % 210) + 1);

  return (
    <div className="boikieu-page">
      {/* 1. KHU VỰC BÀN QUAY BÓI QUẺ */}
      <div className="boikieu-stage-container">
        {/* Vòng quay quẻ: căn chỉnh lớn hơn và nâng cao lên tạo cân đối thị giác */}
        <div className="wheel-wrapper">
          <div className="pointer" />
          <div
            className="wheel"
            style={{
              transform: `rotate(${currentRotation}deg)`,
              transition: isSpinning
                ? 'transform 4.8s cubic-bezier(0.12, 0.75, 0.08, 1)'
                : 'none',
            }}
          >
            <img
              src="/tarot-kieu/wheel.png?v=3"
              alt="Bánh xe Tarot Kiều"
              className="wheel-image"
              draggable="false"
            />
          </div>
        </div>

        {/* Nút xin quẻ: hiệu ứng thở & viền gradient chuyển động */}
        <div className="stage-controls">
          <button
            className="spin-btn"
            disabled={isSpinning}
            onClick={handleSpinWheel}
            aria-label="Xin quẻ"
          >
            <span className="spin-btn-inner">
              {isSpinning ? 'ĐANG QUAY...' : 'XIN QUẺ'}
            </span>
          </button>

          <div className="result-number">
            {resultText}
          </div>
        </div>
      </div>

      {/* 2. BẢNG LIỆT KÊ CÁC QUẺ KIỀU (Cuộn vô hạn, theo thứ tự từ Quẻ 1) */}
      <section className="boikieu-cards-section">
        <div className="cards-section-header">
          <h2 className="cards-main-title">BẢNG LIỆT KÊ CÁC QUẺ KIỀU</h2>
          <div className="cards-sub-title">
            Liệt kê theo thứ tự từ Quẻ 1 đến Quẻ 210
          </div>
          <div className="title-divider" />
        </div>

        <div className="cards-grid">
          {cardsList.map((num, index) => {
            const isMain = mainQue === num;
            return (
              <div
                key={`${num}-${index}`}
                className={`card ${isMain ? 'main-card' : ''}`}
                onClick={() => setModalQue(num)}
              >
                {/* Khung ảnh quẻ đúng tỉ lệ 9:16 FHD, bo góc chuẩn, không bị tràn */}
                <div className="card-img-wrap">
                  <img
                    src={getCardImgSrc(num)}
                    alt={`Quẻ số ${num}`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `/tarot-kieu/cards/que${num}.jpg`;
                    }}
                  />
                </div>

                {/* Khối thông tin nền đỏ chủ đạo (primary red) */}
                <div className="card-caption">
                  <div className="card-number-label">QUẺ SỐ {num}</div>
                  <div className="card-footer-action">
                    {isMain ? (
                      <span className="badge-main">★ Quẻ chính</span>
                    ) : (
                      <span className="badge-sub">Quẻ phụ</span>
                    )}
                    <span className="hint-click">Bấm để xem</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Điểm kích hoạt cuộn vô hạn */}
        <div ref={sentinelRef} className="infinite-scroll-sentinel">
          <div className="sentinel-spinner">Đang tải thêm quẻ...</div>
        </div>
      </section>

      {/* 3. MODAL XEM CHI TIẾT QUẺ FHD VỪA VẶN MÀN HÌNH */}
      {modalQue !== null && (
        <div
          className="modal-overlay show"
          onClick={() => setModalQue(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setModalQue(null)}
              aria-label="Đóng"
            >
              ✕
            </button>
            <div className="modal-img-wrap">
              <img
                src={getCardImgSrc(modalQue)}
                alt={`Quẻ số ${modalQue}`}
                className="modal-img"
              />
            </div>
            <div className="modal-info">
              <h3>
                Quẻ số {modalQue} {modalQue === mainQue ? '★ (Quẻ chính)' : ''}
              </h3>
              <p className="modal-subtitle">Tranh Kiều & Lời Giải Quẻ Chi Tiết</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoiKieu;
