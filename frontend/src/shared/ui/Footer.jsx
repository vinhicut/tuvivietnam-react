import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <div className="footer-about">
          <div className="footer-logo">
            <strong>DIỄN ĐÀN TỬ VI HỒNG ÂN</strong>
          </div>
          <p>
            Nền tảng "MIỄN PHÍ" giúp bạn lập lá số Tử Vi và nhận luận giải chuẩn xác. Tại đây, bạn còn có thể gieo quẻ Tarot Kiều để thấu tỏ công việc, tình duyên, gia đạo, đồng thời nhận những lời khuyên hữu ích về phong thủy nhà cửa và hôn nhân.
          </p>
          <div className="contact-info">
            <div>
              Liên hệ qua Zalo:{' '}
              <a href="https://zalo.me/0924616199" target="_blank" rel="noopener noreferrer">
                0924.616.199
              </a>
              {' - '}
              <a href="https://zalo.me/0385497085" target="_blank" rel="noopener noreferrer">
                0385.497.085
              </a>
            </div>
            <div>
              <a href="https://www.tuvihongan.com" target="_blank" rel="noopener noreferrer">
                www.tuvihongan.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
