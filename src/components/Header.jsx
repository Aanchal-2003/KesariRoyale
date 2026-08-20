import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop' },
  { path: '/craft', label: 'Our Craft' },
  { path: '/reports', label: 'Lab Reports' },
  { path: '/blogs', label: 'Blogs' },
  { path: '/contact', label: 'Contact' },
];

export default function Header() {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <header className={`main-header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-container">
          <Link to="/" className="logo">
            <img src="/assets/logo.webp" alt="Kesari Royale" className="logo-img" />
          </Link>
          <nav className="nav-menu">
            {NAV.map(n => (
              <NavLink
                key={n.path}
                to={n.path}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button className="cart-trigger" onClick={() => navigate('/cart')} aria-label="Open Cart">
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
          <button className="drawer-close" onClick={closeDrawer}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <nav className="mobile-nav-links">
          {NAV.map(n => (
            <NavLink
              key={n.path}
              to={n.path}
              onClick={closeDrawer}
              className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
      {drawerOpen && <div className="drawer-overlay open" onClick={closeDrawer}></div>}
    </>
  );
}
