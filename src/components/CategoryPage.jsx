// src/components/CategoryPage.jsx
import React from 'react';
import './CategoryPage.css';

// Dữ liệu mẫu – sau này lấy từ API
const featured = {
  id: 1,
  title: 'KHÂM THIÊN GIÁM TỬ VI ĐẨU SỐ – Thiên Tướng',
  tag: 'TỬ VI',
  date: '22/10/2020',
  author: 'Tử Vi Việt Nam',
  image: 'https://picsum.photos/seed/tv1/800/500',
  large: true,
};

const posts = [
  {
    id: 2,
    title: 'KHÂM THIÊN GIÁM TỬ VI ĐẨU SỐ – Thiên Lương',
    tag: 'TỬ VI',
    date: '22/10/2020',
    image: 'https://picsum.photos/seed/tv2/400/280',
  },
  {
    id: 3,
    title: 'KHÂM THIÊN GIÁM TỬ VI ĐẨU SỐ – Thái Dương',
    tag: 'TỬ VI',
    date: '22/10/2020',
    image: 'https://picsum.photos/seed/tv3/400/280',
  },
  {
    id: 4,
    title: 'Tử vi đẩu số toàn thư hán việt – Phần cuối',
    tag: 'TỬ VI',
    date: '22/10/2020',
    image: 'https://picsum.photos/seed/tv4/400/280',
  },
  {
    id: 5,
    title: 'KHÂM THIÊN GIÁM TỬ VI ĐẨU SỐ – Cự Môn',
    tag: 'TỬ VI',
    date: '22/10/2020',
    image: 'https://picsum.photos/seed/tv5/400/280',
  },
  {
    id: 6,
    title: 'KHÂM THIÊN GIÁM TỬ VI ĐẨU SỐ – Thiên Tướng',
    tag: 'TỬ VI',
    date: '22/10/2020',
    image: 'https://picsum.photos/seed/tv6/400/300',
  },
  {
    id: 7,
    title: 'KHÂM THIÊN GIÁM TỬ VI ĐẨU SỐ – Thiên Lương',
    tag: 'TỬ VI',
    date: '22/10/2020',
    image: 'https://picsum.photos/seed/tv7/400/300',
  },
  {
    id: 8,
    title: 'KHÂM THIÊN GIÁM TỬ VI ĐẨU SỐ – Thất Sát',
    tag: 'TỬ VI',
    date: '22/10/2020',
    image: 'https://picsum.photos/seed/tv8/400/300',
  },
  {
    id: 9,
    title: 'KHÂM THIÊN GIÁM TỬ VI ĐẨU SỐ – Phá Quân',
    tag: 'TỬ VI',
    date: '22/10/2020',
    image: 'https://picsum.photos/seed/tv9/400/300',
  },
];

function CategoryPage({ onOpenArticle }) {
  const handleClick = (post) => {
    if (onOpenArticle) onOpenArticle(post);
  };

  return (
    <div className="category-page">
      <div className="cat-breadcrumb">Home › Tử Vi - Tính Chất</div>
      <h1 className="cat-title">TỬ VI - TÍNH CHẤT</h1>

      {/* Hàng trên: 1 bài lớn + 4 bài nhỏ */}
      <div className="cat-hero-grid">
        <article className="cat-card cat-card--large" onClick={() => handleClick(featured)}>
          <img src={featured.image} alt={featured.title} />
          <div className="cat-card-overlay">
            <span className="cat-tag">{featured.tag}</span>
            <h2>{featured.title}</h2>
            <div className="cat-meta">
              {featured.author} · {featured.date}
            </div>
          </div>
        </article>

        <div className="cat-hero-side">
          {posts.slice(0, 4).map((p) => (
            <article key={p.id} className="cat-card cat-card--sm" onClick={() => handleClick(p)}>
              <img src={p.image} alt={p.title} />
              <div className="cat-card-overlay">
                <span className="cat-tag">{p.tag}</span>
                <h3>{p.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Lưới bài viết bên dưới */}
      <div className="cat-body">
        <div className="cat-grid">
          {posts.slice(4).map((p) => (
            <article key={p.id} className="cat-card cat-card--grid" onClick={() => handleClick(p)}>
              <img src={p.image} alt={p.title} />
              <div className="cat-card-body">
                <span className="cat-tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <div className="cat-meta">Tử Vi Việt Nam · {p.date}</div>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar nhỏ bên phải (tùy chọn) */}
        <aside className="cat-sidebar">
          <h4>CÓ THỂ BẠN THÍCH</h4>
          {/* có thể tái sử dụng Sidebar hoặc list ngắn */}
        </aside>
      </div>
    </div>
  );
}

export default CategoryPage;