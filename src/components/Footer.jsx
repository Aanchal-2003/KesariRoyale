import { useState } from 'react';

export default function Footer({ setPage }) {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <a onClick={() => setPage('home')} className="logo" style={{ cursor: 'pointer' }}>
            <img src="/assets/logo.webp" alt="Kesari Royale" className="logo-img footer-logo-img" />
          </a>
          <p className="footer-about-text">Dedicated to reviving Rajasthan's ancient Vedic culinary heritage. Hand-crafting chemical-free, nutrient-dense superfoods through high-integrity Bilona practices.</p>
          <div className="footer-badges">
            <span><i className="fa-solid fa-shield"></i> Premium Quality</span>
            <span><i className="fa-solid fa-wheat-awn"></i> Farm Sourced</span>
          </div>
          <div className="social-links" style={{ marginTop: '16px' }}>
            {[
              ['fa-brands fa-facebook', 'Facebook', '#'],
              ['fa-brands fa-instagram', 'Instagram', 'https://www.instagram.com/kesariroyale'],
              ['fa-brands fa-youtube', 'YouTube', '#'],
              ['fa-brands fa-whatsapp', 'WhatsApp', 'https://wa.me/919079914464'],
            ].map(([cls, label, href]) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                <i className={cls}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Shop</h4>
          <ul>
            {[['ghee','Vedic A2 Ghee'],['oils','Cold-Pressed Oils'],['infusions','Saffron Infusions'],['all','All Selections']].map(([f,l]) => (
              <li key={f}><a onClick={() => setPage('shop')} style={{ cursor: 'pointer' }}>{l}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-links">
          <h4>Heritage & Trust</h4>
          <ul>
            {[['craft','The Bilona Method'],['reports','Purity Lab Reports'],['blogs','Health & Nutrition Blog'],['contact','Contact Farm Care']].map(([p,l]) => (
              <li key={p}><a onClick={() => setPage(p)} style={{ cursor: 'pointer' }}>{l}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Join the Royal Circle</h4>
          <p>Receive monthly articles on Vedic lifestyle and private batch releases.</p>
          {!subscribed ? (
            <form className="newsletter-form" onSubmit={e => { e.preventDefault(); setSubscribed(true); }}>
              <input type="email" required placeholder="Your email address" aria-label="Newsletter Email" />
              <button type="submit" aria-label="Subscribe"><i className="fa-solid fa-paper-plane"></i></button>
            </form>
          ) : (
            <span className="newsletter-success">Subscribed successfully!</span>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; 2026 KESARIROYALE (Hanumangarh, Rajasthan). All rights reserved.</p>
          <div className="footer-legal">
            <a onClick={() => setPage('contact')} style={{ cursor: 'pointer' }}>Privacy Policy</a>
            <a onClick={() => setPage('contact')} style={{ cursor: 'pointer' }}>Terms of Sourcing</a>
            <a onClick={() => setPage('contact')} style={{ cursor: 'pointer' }}>Shipping & Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
