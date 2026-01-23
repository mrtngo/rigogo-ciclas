import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import './Navbar.css';

import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <div className="navbar-logo">
          <Link to="/">
            <span className="logo-go">GO</span>
            <span className="logo-rigo">RIGO</span>
            <span className="logo-go">GO!</span>
            <span className="logo-tag">BICIS</span>
          </Link>
        </div>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/vender">Vender</Link>
          <Link to="/taller">Taller</Link>
          <div className="navbar-mobile-actions">
            <Link to="/login" className="btn-login">Login</Link>
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
          <Link to="/login" className="btn-login desktop-only">
            <User size={20} />
            <span>Login</span>
          </Link>
          <Link to="/login" className="icon-btn mobile-only">
            <User size={24} />
          </Link>
          <button className="menu-btn mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
