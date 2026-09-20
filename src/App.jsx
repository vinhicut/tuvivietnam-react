import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LaSoTuVi from './components/LaSoTuVi';
import Contact from './components/Contact';
import CategoryPage from './components/CategoryPage';
import BoiKieu from './components/BoiKieu';
import LichVanSu from './components/LichVanSu';
import KhamThienTuViThienTuong from './components/KhamThienTuViThienTuong';
import QuickInsights from './components/QuickInsights';

function App() {
  return (
    <div className="app">
      <Header />
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <div className="home-content-flow">
                <LaSoTuVi />
                <QuickInsights />
              </div>
            }
          />
          <Route path="/la-so-tu-vi" element={
            <div className="home-content-flow">
              <LaSoTuVi />
              <QuickInsights />
            </div>
          } />
          <Route path="/lich-van-su" element={<LichVanSu />} />
          <Route path="/boi-kieu" element={<BoiKieu />} />
          <Route path="/lien-he" element={<Contact />} />
          <Route path="/chuyen-muc" element={<CategoryPage />} />
          <Route path="/chuyen-muc/thien-tuong" element={<KhamThienTuViThienTuong />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;