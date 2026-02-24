import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setIsUserMenuOpen(false);
  };

  const avatarLetter = user?.displayName?.[0]?.toUpperCase()
    ?? user?.email?.[0]?.toUpperCase()
    ?? '?';

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
              {user ? (
                <button className="btn-secondary" onClick={handleSignOut}>Cerrar Sesión</button>
              ) : (
                <Link to="/login" className="btn-secondary">Iniciar Sesión</Link>
              )}
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

              {user ? (
                <div className="user-menu-wrapper" ref={userMenuRef}>
                  <button
                    className="user-avatar"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="Menú de usuario"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName ?? 'Avatar'} />
                    ) : (
                      <span>{avatarLetter}</span>
                    )}
                  </button>
                  {isUserMenuOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <p className="user-dropdown-name">{user.displayName ?? 'Mijito'}</p>
                        <p className="user-dropdown-email">{user.email}</p>
                      </div>
                      <button className="user-dropdown-item" onClick={handleSignOut}>
                        <LogOut size={16} />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="icon-btn">
                  <User size={20} />
                </Link>
              )}
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
