import React from 'react';
import logoTuvihongan from '../assets/logotuvihongan.jpg';

function Header({ onNavigate }) {
  const handleLaSo = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate('laso');
  };
  const handleBoiKieu = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate('boikieu');
  };
  const handleLichVanSu = (e) => {
  e.preventDefault();
  if (onNavigate) onNavigate('lichvansu');
};

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo" onClick={() => onNavigate && onNavigate('article')} style={{ cursor: 'pointer' }}>
          <div className="bagua">
            <div className="bagua-inner">
              <img src={logoTuvihongan} alt="Bát quái" />
            </div>
          </div>
          <div className="logo-text">
            <div className="logo-title">Diễn đàn</div>
            <div className="logo-main">TỬ VI HỒNG ÂN</div>
            <div className="logo-url">http://www.tuvihongan.com</div>
          </div>
        </div>
      </div>
      <div className="header-right">
{/*         <div className="seal">
          <div className="seal-text">
            紫微
            <br />
            越南
          </div>
        </div> */}
        <div className="header-buttons">
          <button type="button" onClick={handleLaSo}>
            Lá Số Tử Vi
          </button>
          <button type="button">Phong Thủy</button>
          <button type="button">Kỳ Môn</button>
          <button type="button" onClick={handleLichVanSu}>
    Lịch Vạn Sự
  </button>
          <button type="button" onClick={handleBoiKieu}>
            Bói Kiều
          </button>
          <button type="button">Tứ Trụ</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
