import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <div className="navbar-logo">
          <a href="/">
            <span className="logo-go">GO</span>
            <span className="logo-rigo">RIGO</span>
            <span className="logo-go">GO!</span>
            <span className="logo-tag">BICIS</span>
          </a>
        </div>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="/marketplace">Marketplace</a>
          <a href="/vender">Vender</a>
          <a href="/taller">Taller</a>
          <div className="navbar-mobile-actions">
            <a href="/login" className="btn-login">Login</a>
          </div>
        </div>

        <div className="navbar-search desktop-only">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Busca tu próxima bici..." />
          </div>
        </div>

        <div className="navbar-actions">
          <button className="icon-btn search-btn mobile-only">
            <Search size={24} />
          </button>
          <button className="icon-btn">
            <ShoppingCart size={24} />
          </button>
          <button className="btn-login desktop-only">
            <User size={20} />
            <span>Login</span>
          </button>
          <button className="menu-btn mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
