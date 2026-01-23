import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  return (
    <>
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
            <div className="search-wrapper" onClick={() => setIsSearchOpen(true)}>
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Busca tu próxima bici..." readOnly />
            </div>
          </div>

          <div className="navbar-actions">
            <button className="icon-btn search-btn mobile-only" onClick={() => setIsSearchOpen(true)}>
              <Search size={24} />
            </button>
            <button className="icon-btn cart-toggle" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={24} />
              <span className="cart-badge">0</span>
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

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="overlay animate-fade-in" onClick={() => setIsCartOpen(false)}>
          <div className="drawer cart-drawer animate-slide-in" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Tu Carrito (0)</h2>
              <button className="icon-btn" onClick={() => setIsCartOpen(false)}><X size={24} /></button>
            </div>
            <div className="drawer-content">
              <div className="empty-cart">
                <ShoppingCart size={48} />
                <p>Tu carrito está vacío, mijito.</p>
                <Link to="/marketplace" className="btn-primary" onClick={() => setIsCartOpen(false)}>Ir a la tienda</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="overlay search-overlay animate-fade-in" onClick={() => setIsSearchOpen(false)}>
          <div className="search-modal container animate-slide-in" onClick={e => e.stopPropagation()}>
            <div className="search-modal-header">
              <div className="search-input-wrapper">
                <Search size={24} />
                <input type="text" placeholder="Busca marca, modelo o accesorio..." autoFocus />
              </div>
              <button className="icon-btn" onClick={() => setIsSearchOpen(false)}><X size={28} /></button>
            </div>
            <div className="search-suggestions">
              <p className="suggestion-label">Búsquedas populares</p>
              <div className="suggestion-tags">
                <Link to="/marketplace?q=tarmac">Specialized Tarmac</Link>
                <Link to="/marketplace?q=mtb">MTB Carbono</Link>
                <Link to="/marketplace?q=casco">Cascos POC</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
