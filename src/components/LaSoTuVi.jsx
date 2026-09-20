import React, { useEffect, useRef, useState } from 'react';
import './LaSoTuVi.css';

/**
 * Phân hệ Lập Lá Số Tử Vi Đẩu Số - Tích hợp thống nhất với Website
 * Tự động đồng bộ chiều cao qua postMessage, loại bỏ hoàn toàn thanh cuộn lồng nhau.
 */
function LaSoTuVi() {
  const iframeRef = useRef(null);
  const [frameHeight, setFrameHeight] = useState(1040);

  useEffect(() => {
    window.scrollTo(0, 0);

    function handleResizeMessage(e) {
      if (e.data && e.data.type === 'TUVI_IFRAME_RESIZE' && e.data.height) {
        setFrameHeight(Math.ceil(e.data.height));
      }
    }

    window.addEventListener('message', handleResizeMessage);
    return () => window.removeEventListener('message', handleResizeMessage);
  }, []);

  return (
    <div className="laso-unified-page">
      <div className="laso-unified-wrap">
        <iframe
          ref={iframeRef}
          src="/laso-tuvi.html"
          title="Lá Số Tử Vi Đẩu Số"
          className="laso-unified-iframe"
          style={{ height: `${frameHeight}px` }}
          scrolling="no"
          frameBorder="0"
        />
      </div>
    </div>
  );
}

export default LaSoTuVi;
