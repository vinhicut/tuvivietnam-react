
// src/components/FloatingContact.jsx

import React from 'react';
import './FloatingContact.css';

function FloatingContact() {
  return (
    <div className="floating-contact">

      {/* ==============================
          MESSENGER
      ============================== */}
      <a
        className="floating-contact-item messenger"
        href="https://m.me/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Messenger"
      >
        <div className="floating-contact-icon">
          <span className="messenger-icon">⚡</span>
        </div>

        <span className="floating-contact-time">
          (8h-21h)
        </span>
      </a>


      {/* ==============================
          ZALO
      ============================== */}
      <a
        className="floating-contact-item zalo"
        href="http://localhost:5173/lien-he/zalo"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo với Phúc Anh"
      >
        <div className="floating-contact-icon zalo-icon">
          Zalo
        </div>

        <span className="floating-contact-time">
          (8h-21h)
        </span>
      </a>


      {/* ==============================
          ĐIỆN THOẠI
      ============================== */}
      <a
        className="floating-contact-item phone"
        href="tel:0900000000"
        aria-label="Gọi điện"
      >
        <div className="floating-contact-icon phone-icon">
          ☎
        </div>

        <span className="floating-contact-time">
          (8h-21h)
        </span>
      </a>

    </div>
  );
}

export default FloatingContact;
