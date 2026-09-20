import React from 'react';

const insightPillars = [
  {
    icon: '🔮',
    title: 'An Sao Tinh Chuẩn',
    desc: 'Hệ thống an sao Tử Vi Nam Bắc Phái, kết hợp an Lưu Niên, Tiểu Hạn, Nguyệt Hạn chuẩn từng tiết khí âm dương.',
  },
  {
    icon: '✨',
    title: 'Lục Thập Tinh Hệ',
    desc: 'Phân tích thế đứng 60 hệ thống tinh tú, miếu hãm, đắc địa giúp nhìn thấu bản mệnh và đại vận 10 năm.',
  },
  {
    icon: '🧭',
    title: 'Cân Bằng Âm Dương',
    desc: 'Định hướng công danh, tài bạch, gia đạo và hóa giải hung hiểm dựa trên nguyên lý tương sinh tương khắc Ngũ Hành.',
  },
  {
    icon: '📜',
    title: 'Kho Tàng Thư Tịch',
    desc: 'Hàng ngàn bài khảo luận từ các cổ thư: Tử Vi Đẩu Số Toàn Thư, Khâm Thiên Giám, Tăng Bổ Bốc Phệ.',
  },
];

const featuredTopics = [
  {
    tag: 'Cách Cục Tử Vi',
    title: 'Tử Phủ Vũ Tướng: Mẫu người lãnh đạo túc trí đa mưu & cơ nghiệp',
    author: 'Hồng Ân Đạo Nhân',
    views: '4.2k lượt đọc',
  },
  {
    tag: 'Phi Tinh Lương Phái',
    title: 'Hóa Kỵ nhập Cung Phu Thê: Nút thắt nghiệp duyên và cách ứng xử',
    author: 'Ban Học Thuật',
    views: '3.8k lượt đọc',
  },
  {
    tag: 'Luận Vận Hạn',
    title: 'Nhận diện cơ hội bứt phá khi bước vào Đại Vận Sát Phá Tham',
    author: 'Thầy Minh Tuệ',
    views: '5.1k lượt đọc',
  },
];

function QuickInsights({ onNavigate }) {
  return (
    <>
      {/* KHỐI 1: HỆ THỐNG LUẬN GIẢI TỬ VI */}
      <section className="home-insights-section">
        <div className="section-header-wrap">
          <h2 className="section-title">Hệ Thống Luận Giải Tử Vi</h2>
        </div>

        <div className="pillars-grid">
          {insightPillars.map((item, idx) => (
            <div className="pillar-card" key={idx}>
              <div className="pillar-top">
                <span className="pillar-icon">{item.icon}</span>
              </div>
              <h3 className="pillar-title">{item.title}</h3>
              <p className="pillar-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KHỐI 2: BÀI LUẬN KHẢO SÁT & NGHIÊN CỨU MỚI NHẤT */}
      <section className="home-featured-section">
        <div className="featured-header">
          <div>
            <h3 className="featured-title">Bài Luận Khảo Sát & Nghiên Cứu Mới Nhất</h3>
          </div>
          <button
            type="button"
            className="btn-view-all"
            onClick={() => onNavigate && onNavigate('category')}
          >
            Xem tất cả chuyên mục ›
          </button>
        </div>

        <div className="featured-grid">
          {featuredTopics.map((topic, i) => (
            <div
              className="featured-card"
              key={i}
              onClick={() => onNavigate && onNavigate('category')}
            >
              <div className="topic-tag">{topic.tag}</div>
              <h4 className="topic-title">{topic.title}</h4>
              <div className="topic-meta">
                <span>✍ {topic.author}</span>
                <span>👁 {topic.views}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default QuickInsights;
