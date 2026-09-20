import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-page">
      <h1 className="contact-title">Liên hệ với Diễn đàn</h1>
      <p className="contact-desc">
        Mọi vấn đề liên quan đến học tập, nghiên cứu về Tử Vi, Phong thủy cũng như
        Văn hóa Phương Đông, luôn được đón nhận trên tinh thần xây dựng và cùng phát triển.
      </p>

      <div className="contact-social">
        <a href="#" className="social-btn-square" title="Facebook">f</a>
        <a href="#" className="social-btn-square" title="Email">✉</a>
        <a href="#" className="social-btn-square" title="X">𝕏</a>
        <a href="#" className="social-btn-square" title="YouTube">▶</a>
      </div>

      <div className="contact-info-box">
        <div className="info-item">
          <div className="info-icon">📍</div>
          <h3>Địa chỉ</h3>
          <p>Khu đô thị Tây Mỗ<br />Nam Từ liêm, Hà Nội</p>
        </div>
        <div className="info-item">
          <div className="info-icon">🕐</div>
          <h3>Thời gian</h3>
          <p>Thứ 2 - Thứ 7<br />8:00 AM - 5:00 PM</p>
        </div>
        <div className="info-item">
          <div className="info-icon">📞</div>
          <h3>Điện thoại</h3>
          <p>(+84) 0920461699<br />(+84) 0920461699</p>
        </div>
        <div className="info-item">
          <div className="info-icon">✈️</div>
          <h3>Email</h3>
          <p>info@tuvihongan.com<br />admin@tuvihongan.com</p>
        </div>
      </div>

      <div className="contact-map">
        <a
          className="map-link"
          href="https://www.google.com/maps?q=21.0037309,105.7406274"
          target="_blank"
          rel="noreferrer"
        >
          Mở trong Maps ↗
        </a>
        <iframe
          title="Bản đồ"
          src="https://www.google.com/maps?q=21.0037309,105.7406274&z=17&output=embed"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

export default Contact;