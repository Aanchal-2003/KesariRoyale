import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop' },
  { id: 'craft', label: 'Our Craft' },
  { id: 'reports', label: 'Lab Reports' },
  { id: 'blogs', label: 'Blogs' },
  { id: 'contact', label: 'Contact' },
];

export default function Header({ page, setPage, openCart }) {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigate = (id) => { setPage(id); setDrawerOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      <header className={`main-header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-container">
          <a onClick={() => navigate('home')} className="logo" style={{ cursor: 'pointer' }}>
            <img src="/assets/logo.webp" alt="Kesari Royale" className="logo-img" />
          </a>
          <nav className="nav-menu">
            {NAV.map(n => (
              <a key={n.id} onClick={() => navigate(n.id)} className={`nav-link${page === n.id ? ' active' : ''}`} style={{ cursor: 'pointer' }}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button className="cart-trigger" onClick={openCart} aria-label="Open Cart">
              <i className="fa-solid fa-bag-shopping"></i>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
            <button className="mobile-menu-toggle" onClick={() => setDrawerOpen(true)} aria-label="Menu">
              <i className="fa-solid fa-bars-staggered"></i>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">Navigation</span>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <nav className="mobile-nav-links">
          {NAV.map(n => (
            <a key={n.id} onClick={() => navigate(n.id)} className={`mobile-nav-link${page === n.id ? ' active' : ''}`} style={{ cursor: 'pointer' }}>
              {n.label}
            </a>
          ))}
        </nav>
      </div>
      {drawerOpen && <div className="drawer-overlay open" onClick={() => setDrawerOpen(false)}></div>}
    </>
  );
}
