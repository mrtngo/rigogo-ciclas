import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, ChevronDown, Search, CheckCircle } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/products';
import './Home.css';

const CATEGORIES = [
  { name: 'Montaña', count: 50, emoji: '🚵' },
  { name: 'Ruta', count: 140, emoji: '🚴' },
  { name: 'Eléctrica', count: 50, emoji: '⚡' },
  { name: 'Niños', count: 5, emoji: '🧒' },
];

const BRANDS = ['Specialized', 'Giant', 'GTW', 'Scott', 'Cliff', 'Trek'];

const FAQS = [
  { q: 'Espera que un comprador te contacte', a: 'Tu publicación estará activa en minutos y tendrá exposición a miles de usuarios.', open: true },
  { q: '¡Quiero vender! ¿Cómo es el proceso?', a: 'Crea tu cuenta, publica tu bici, y espera a que los compradores te contacten directamente.' },
  { q: '¿Puedo publicar una scooter, patineta o accesorios de ciclismo?', a: 'Por ahora solo aceptamos bicicletas, pero pronto expandiremos las categorías.' },
  { q: '¿Hacen envíos?', a: 'Los envíos se coordinan directamente entre comprador y vendedor.' },
];

const FAQS_RIGHT = [
  { q: '¿Cuáles opciones de pago tienen?' },
  { q: '¿Ofrecen garantías y devoluciones?' },
  { q: '¿Dónde están ubicados?' },
];

const PLANS = [
  {
    name: 'Plan Escarabajo',
    price: '$0',
    tagline: '¡Tu bici en las primeras posiciones!',
    features: ['1 Publicación', 'Activo por 30 días', 'Hasta 4 fotos', 'Exposicion Baja'],
  },
  {
    name: 'Plan Sprinter',
    price: '$29.900',
    tagline: '¡Tu bici en las primeras posiciones!',
    features: ['1 Publicación', 'Activo por 60 días', '¡Recibe 2 veces más visitas!', 'Primeras posiciones en los resultados de búsqueda', 'Hasta 8 fotos', 'Exposición Media'],
  },
  {
    name: 'Plan Contrarreloj',
    price: '$69.900',
    tagline: '¡Vendes más rápido al tener mayor exposición!',
    features: ['1 Publicación', 'Activo por 60 días', '¡Recibe 2 veces más visitas!', 'Primeras posiciones en los resultados de búsqueda', 'Tu bici en nuestras historias destacadas de Instagram x 1 Mes', 'Una historia semanal de tu bici en nuestro Instagram x 2 semanas (+1500) impresiones', 'Hasta 8 fotos', 'Exposición Alta'],
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);
  const featured = MOCK_PRODUCTS.slice(0, 6);

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <section className="hero-split">
        <div className="hero-mint-bg" />
        <div className="hero-dark-bg" />
        <div className="container hero-inner">
          <div className="hero-text-area">
            <h1>¡Encuentra aquí tu<br /><strong>próxima bici!</strong></h1>
          </div>
          <div className="hero-image-area">
            <img
              src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=1200&auto=format&fit=crop"
              alt="Bicicleta"
            />
            <div className="hero-badge-circle">🤝</div>
          </div>
        </div>
      </section>

      {/* ── Search bar ── */}
      <section className="hero-search">
        <div className="container">
          <div className="search-filters">
            <div className="filter-select">
              <ChevronDown size={14} />
              <select><option>Tipo de bici</option><option>MTB</option><option>Ruta</option><option>Eléctrica</option></select>
            </div>
            <div className="filter-select">
              <ChevronDown size={14} />
              <select><option>Marca</option><option>Specialized</option><option>Trek</option><option>Giant</option><option>Scott</option></select>
            </div>
            <div className="filter-select">
              <ChevronDown size={14} />
              <select><option>Ubicación</option><option>Bogotá</option><option>Medellín</option><option>Cali</option></select>
            </div>
            <div className="filter-select">
              <ChevronDown size={14} />
              <select><option>Talla</option><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option></select>
            </div>
            <button className="search-submit" onClick={() => navigate('/marketplace')}>
              <span>Buscar</span>
              <div className="search-submit-icon"><Search size={18} /></div>
            </button>
          </div>
        </div>
      </section>

      {/* ── Sponsor banner ── */}
      <section className="sponsor-banner container">
        <div className="sponsor-img-wrapper">
          <img
            src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1200&auto=format&fit=crop"
            alt="Patrocinador"
          />
          <div className="sponsor-overlay">
            <div className="sponsor-text">
              <p className="sponsor-title">¡PARA SEGUIR PEDALEANDO CON TODA!</p>
              <p className="sponsor-sub">Usa Tampones Nosotras® y siéntete segura durante tus rodadas</p>
            </div>
            <button className="sponsor-cta">CÓMPRALOS AQUÍ</button>
          </div>
        </div>
      </section>

      {/* ── Featured bikes ── */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Bicicletas destacadas</h2>
        </div>
        <div className="cards-scroll-wrapper">
          <div className="cards-scroll">
            {featured.map((product, i) => {
              const price = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price);
              return (
                <div
                  key={product.id}
                  className={`featured-card ${i === 2 ? 'featured-card--elevated' : ''}`}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="featured-card-img">
                    <img src={product.images[0]} alt={product.model} />
                    <button className="card-heart"><Heart size={16} /></button>
                  </div>
                  <div className="featured-card-info">
                    <p className="featured-card-name">{product.brand} {product.model}</p>
                    <span className="featured-card-city">
                      <MapPin size={10} /> {product.seller.location.split(',')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="section-cta">
          <Link to="/marketplace" className="btn-dark-pill">Ver todas las bicis</Link>
        </div>
      </section>

      {/* ── How to sell ── */}
      <section className="how-to-sell">
        <div className="container how-to-sell-inner">
          <div className="how-to-sell-steps">
            <h2>Cómo vender tu<br />bici en Rigomarket®.</h2>
            <div className="steps-list">
              {[
                { n: 1, title: 'Crea tu cuenta', desc: 'Regístrate dentro de nuestro sitio web.' },
                { n: 2, title: 'Haz clic en Publicar', desc: 'Selecciona el plan que más se acomode a ti.' },
                { n: 3, title: 'Cuéntanos sobre tu bici', desc: 'Te pediremos información de tu bici, como fotos, tipo de bici y precio… entre otros.' },
                { n: 4, title: 'Espera que un comprador te contacte', desc: 'Tu publicación estará activa en minutos y tendrá exposición a miles de usuarios.' },
              ].map(step => (
                <div className="step-row" key={step.n}>
                  <div className="step-number">{step.n}</div>
                  <div>
                    <p className="step-title">{step.title}</p>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="how-to-sell-visual">
            <img
              src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=600&auto=format&fit=crop"
              alt="App preview"
            />
          </div>
        </div>
      </section>

      {/* ── Pricing plans ── */}
      <section className="pricing-section">
        <div className="container">
          <h2 className="section-title section-title--white">Vende tu bici fácil y rápido</h2>
          <div className="plans-grid">
            {PLANS.map(plan => (
              <div className="plan-card" key={plan.name}>
                <div className="plan-card-top">
                  <p className="plan-name">{plan.name}</p>
                  <p className="plan-price">{plan.price}</p>
                  <p className="plan-tagline">{plan.tagline}</p>
                </div>
                <div className="plan-card-bottom">
                  {plan.features.map(f => (
                    <div className="plan-feature" key={f}>
                      <CheckCircle size={16} className="plan-check" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/vender" className="btn-mint-pill">Ver todas las bicis</Link>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Categorías principales</h2>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link to={`/marketplace?category=${cat.name}`} className="category-card" key={cat.name}>
                <span className="category-count">{cat.count}</span>
                <div className="category-illustration">{cat.emoji}</div>
                <div className="category-label">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bike shops ── */}
      <section className="shops-section">
        <div className="container">
          <h2 className="section-title">Tiendas de bicis</h2>
        </div>
        <div className="cards-scroll-wrapper">
          <div className="cards-scroll">
            {[1,2,3,4].map(i => (
              <div className="shop-card" key={i}>
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop"
                  alt="Tienda"
                />
                <div className="shop-card-info">
                  <p className="shop-name">Rojo Bike</p>
                  <span className="shop-city">ANTIOQUIA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="section-cta">
          <Link to="/taller" className="btn-dark-pill">Ver todas las tiendas de bicis</Link>
        </div>
      </section>

      {/* ── Explore by brand ── */}
      <section className="brands-section">
        <div className="container">
          <h2 className="section-title">Explora por marca</h2>
          <div className="brands-grid">
            {BRANDS.map(brand => (
              <Link to={`/marketplace?brand=${brand}`} className="brand-item" key={brand}>
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Preguntas frecuentes</h2>
          <div className="faq-columns">
            <div className="faq-col">
              {FAQS.map((faq, i) => (
                <div className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`} key={i}>
                  <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                    <span className="faq-arrow">▶</span>
                    {faq.q}
                  </button>
                  {openFaq === i && faq.a && <p className="faq-answer">{faq.a}</p>}
                  <div className="faq-divider" />
                </div>
              ))}
            </div>
            <div className="faq-col">
              {FAQS_RIGHT.map((faq, i) => (
                <div className="faq-item" key={i}>
                  <button className="faq-question">
                    <span className="faq-arrow">▶</span>
                    {faq.q}
                  </button>
                  <div className="faq-divider" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-watermark">rigomarket.</div>
        <div className="container footer-inner">
          <div className="footer-col">
            <p>© Rigomarket.<br />Todos los derechos<br />Reservados.</p>
          </div>
          <div className="footer-col">
            <p className="footer-heading">Legal</p>
            <a href="#">Política de privacidad</a>
          </div>
          <div className="footer-col">
            <p className="footer-heading">Síguenos</p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📸</a>
              <a href="#" aria-label="TikTok">🎵</a>
            </div>
          </div>
          <div className="footer-col">
            <p className="footer-heading">Métodos de pago</p>
            <div className="footer-payments">
              <span>Visa</span>
              <span>MC</span>
              <span>Amex</span>
              <span>Nequi</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
