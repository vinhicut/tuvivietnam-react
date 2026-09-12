import React, { useState } from 'react';
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

function App() {
  const [currentView, setCurrentView] = useState('article'); // 'article' | 'laso'
  const openArticle = (post) => {
  // sau này truyền post vào ArticleContent
  setCurrentView('article');
};
  

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <TopBar />
      <Header onNavigate={handleNavigate} />
      <Navbar onNavigate={handleNavigate} currentView={currentView} />

      <main className="main-content">
        {currentView === 'category' ? (
  <CategoryPage onOpenArticle={openArticle} />) :
          currentView === 'laso' ? (
          <LaSoTuVi />
        ) : currentView === 'contact' ? (
          <Contact />
        ) : (
          <div className="content-wrapper">
            <LaSoTuVi />
            {/* <ArticleContent /> */}
            {/* <Sidebar /> */}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
