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
      {/* Announcement bar */}
      <div className="announcement-bar">
        REGÍSTRATE HOY, PUBLICA Y VENDE TU BICI. <strong>¡FÁCIL Y RÁPIDO!</strong>
      </div>

      <nav className="navbar">
        <div className="navbar-container container">
          <div className="navbar-logo">
            <Link to="/">
              <span className="logo-icon">⇄</span>
              <span className="logo-text">rigomarket.</span>
            </Link>
          </div>

          <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/marketplace">Compra</Link>
            <Link to="/vender">Vende</Link>
            <Link to="/taller">Encuentra una tienda</Link>
            <Link to="/contacto">Contacto</Link>

            <div className="navbar-mobile-actions">
              <Link to="/vender" className="btn-primary">Vender mi bici</Link>
              <Link to="/login" className="btn-secondary">Iniciar Sesión</Link>
            </div>
          </div>

          <div className="navbar-actions">
            <button className="icon-btn search-btn mobile-only" onClick={() => setIsSearchOpen(true)}>
              <Search size={22} />
            </button>
            <div className="navbar-user-actions desktop-only">
              <button className="icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu size={20} />
              </button>
              <Link to="/login" className="icon-btn">
                <User size={20} />
              </Link>
            </div>
            <button className="icon-btn cart-toggle" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={22} />
              <span className="cart-badge">0</span>
            </button>
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
                <p>No tienes productos en el carrito.</p>
                <Link to="/marketplace" className="btn-primary" onClick={() => setIsCartOpen(false)}>Explorar bicicletas</Link>
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
                <input type="text" placeholder="Ej. Specialized Tarmac, Trek Madone..." autoFocus />
              </div>
              <button className="icon-btn" onClick={() => setIsSearchOpen(false)}><X size={28} /></button>
            </div>
            <div className="search-suggestions">
              <p className="suggestion-label">Búsquedas populares</p>
              <div className="suggestion-tags">
                <Link to="/marketplace?q=ruta">Bicicletas de Ruta</Link>
                <Link to="/marketplace?q=mtb">MTB</Link>
                <Link to="/marketplace?q=carbono">Cuadros de Carbono</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
