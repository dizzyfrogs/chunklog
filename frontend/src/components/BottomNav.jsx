import React from 'react';
import { FiHome, FiTrendingUp, FiBookOpen, FiUser } from 'react-icons/fi';
import { PiBowlFood } from "react-icons/pi";
import '../styles/Navigation.css';

function BottomNav({ activePage, setActivePage }) {
  const getButtonClass = (pageName) => {
    return `nav-button ${activePage === pageName ? 'active' : ''}`;
  };

  return (
    <nav className="bottom-nav">
      <button className={getButtonClass('dashboard')} onClick={() => setActivePage('dashboard')}>
        <FiHome className="icon" />
        <span>Home</span>
      </button>
      <button className={getButtonClass('weight')} onClick={() => setActivePage('weight')}>
        <FiTrendingUp className="icon" />
        <span>Weight</span>
      </button>
      <button className={getButtonClass('food')} onClick={() => setActivePage('food')}>
        <PiBowlFood className="icon" />
        <span>Food</span>
      </button>
      <button className={getButtonClass('profile')} onClick={() => setActivePage('profile')}>
        <FiUser className="icon" />
        <span>Profile</span>
      </button>
    </nav>
  );
}

export default BottomNav;