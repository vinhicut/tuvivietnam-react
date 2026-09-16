import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

import TopBar from './components/TopBar';
import Header from './components/Header';
import Navbar from './components/Navbar';
import ArticleContent from './components/ArticleContent';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LaSoTuVi from './components/LaSoTuVi';
import Contact from './components/Contact';
import CategoryPage from './components/CategoryPage';
import BoiKieu from './components/BoiKieu';
import LichVanSu from './components/LichVanSu';

function App() {
  const navigate = useNavigate();

  const handleNavigate = (view) => {
    // Chuyển path tương ứng
    switch (view) {
      case 'laso':
        navigate('/la-so-tu-vi');
        break;
      case 'lichvansu':
        navigate('/lich-van-su');
        break;
      case 'boikieu':
        navigate('/boi-kieu');
        break;
      case 'contact':
        navigate('/lien-he');
        break;
      case 'category':
        navigate('/chuyen-muc');
        break;
      case 'article':
      default:
        navigate('/');
        break;
    }
  };

  return (
    <div className="app">
      <TopBar />
      <Header onNavigate={handleNavigate} />
      <Navbar onNavigate={handleNavigate} />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <div className="content-wrapper">
                <LaSoTuVi />
  {/*               <Sidebar /> */}
              </div>
            }
          />
          <Route path="/la-so-tu-vi" element={<LaSoTuVi />} />
          <Route path="/lich-van-su" element={<LichVanSu />} />
          <Route path="/boi-kieu" element={<BoiKieu />} />
          <Route path="/lien-he" element={<Contact />} />
          <Route path="/chuyen-muc" element={<CategoryPage />} />
          
          {/* Có thể thêm route chi tiết bài viết sau này */}
          {/* <Route path="/bai-viet/:id" element={<ArticleDetail />} /> */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;