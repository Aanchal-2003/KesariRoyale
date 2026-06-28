import { useState, useEffect } from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const heroSlides = [
  { image: '/assets/banner_1.png', alt: 'Shuddhata Ka Waada — Pure A2 Bilona Ghee' },
  { image: '/assets/banner_2.png', alt: 'From Our Tradition To Your Table' },
  { image: '/assets/banner_3.png', alt: 'Ghar Ki Rasoi, Maa Ka Pyaar' },
];

const whyItems = [
  { icon: 'fa-cow',         title: 'A2 Gir Cow Milk',        text: 'Sourced from indigenous Gir cows, known for rich nutrition and purity.' },
  { icon: 'fa-arrows-spin', title: 'Authentic Bilona Method',  text: 'Handcrafted using the ancient Bilona method to retain natural goodness.' },
  { icon: 'fa-leaf',        title: '100% Natural',            text: 'No additives, no preservatives — just pure, wholesome ghee.' },
  { icon: 'fa-heart-pulse', title: 'Health & Wellness',       text: 'Rich in essential nutrients, supports immunity and overall well-being.' },
  { icon: 'fa-droplet',     title: 'Rich Aroma & Taste',      text: 'Slow-cooked to perfection for a divine aroma and traditional taste.' },
];

const processSteps = [
  { num: 1, image: '/assets/gir_sahiwal_farm.png', title: 'Gir Cow Milk',          text: 'We start with fresh, pure A2 Gir cow milk.' },
  { num: 2, image: '/assets/clay_pot_curd.png',    title: 'Curd',                  text: 'Milk is cultured naturally to prepare curd.' },
  { num: 3, image: '/assets/craft_bilona.jpg',     title: 'Butter',                text: 'Curd is bilona-churned to obtain rich butter.' },
  { num: 4, image: '/assets/slow_cooking_ghee.png',title: 'Slow-Cooked Bilona Ghee', text: 'Butter is slow-cooked to create aromatic, golden ghee.' },
];

const categoryCards = [
  { id: 'summer',      icon: 'fa-sun',      label: 'Summer Essentials', bg: '#5C2D0A', labelColor: '#3D1F00' },
  { id: 'membership',  icon: 'fa-gift',     label: 'Membership Deals',  bg: '#75B529', labelColor: '#4D8A1A' },
  { id: 'newlaunch',   icon: 'fa-box-open', label: 'New Launches',      bg: '#1F5B2B', labelColor: '#BA7517' },
  { id: 'under499',    icon: 'fa-tag',      label: 'Under ₹499',        bg: '#5C2D0A', labelColor: '#3D1F00', priceTag: '₹499' },
  { id: 'allproducts', icon: 'fa-jar',      label: 'All Products',      bg: '#75B529', labelColor: '#4D8A1A' },
  { id: 'under999',    icon: 'fa-tag',      label: 'Under ₹999',        bg: '#1F5B2B', labelColor: '#BA7517', priceTag: '₹999' },
];

const testimonials = [
  { name: 'Neha Sharma',   location: 'Bengaluru',  quote: 'The aroma, the taste, the purity — Kesari Royale Ghee takes me back to my grandmother\'s days. Truly authentic!' },
  { name: 'Rohit Mehta',   location: 'Ahmedabad',  quote: 'You can feel the difference in quality. Perfect for daily use and my family loves the rich, traditional taste.' },
  { name: 'Priya Desai',   location: 'Mumbai',     quote: 'Finally found ghee that is 100% pure and made the right way. Highly recommended for a healthy lifestyle.' },
];

function Stars({ rating }) {
  return (
    <div className="product-rating">
      {[1,2,3,4,5].map(i => (
        <i key={i} className={`fa-${i <= Math.round(rating) ? 'solid' : 'regular'} fa-star`}></i>
      ))}
    </div>
  );
}

export default function Home({ setPage }) {
  const [heroIdx, setHeroIdx] = useState(0);
  const { dispatch } = useCart();

  const prevSlide = () => setHeroIdx(i => (i - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setHeroIdx(i => (i + 1) % heroSlides.length);

  useEffect(() => {
    const timer = setInterval(() => setHeroIdx(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="page-view active">

      {/* ── HERO CAROUSEL ── */}
      <section className="hero-carousel">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-slide${heroIdx === idx ? ' active' : ''}`}
          >
            <img src={slide.image} alt={slide.alt} className="hero-banner-img" />
          </div>
        ))}
        <button className="carousel-arrow carousel-prev" onClick={prevSlide}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button className="carousel-arrow carousel-next" onClick={nextSlide}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
        <div className="carousel-dots">
          {heroSlides.map((_, idx) => (
            <button key={idx} className={`carousel-dot${heroIdx === idx ? ' active' : ''}`} onClick={() => setHeroIdx(idx)} aria-label={`Slide ${idx + 1}`} />
          ))}
        </div>
      </section>

      {/* ── CATEGORY CARDS ── */}
      <section className="cat-section">

        {/* Desktop: static full-width 6-column grid */}
        <div className="cat-grid">
          {categoryCards.map(card => (
            <button key={card.id} className="cat-card" onClick={() => setPage('shop')} aria-label={card.label}>
              <div className="cat-icon-box" style={{ background: card.bg }}>
                {card.priceTag
                  ? <><i className="fa-solid fa-tag"></i><span className="cat-price-text">Under<br />{card.priceTag}</span></>
                  : <i className={`fa-solid ${card.icon}`}></i>}
              </div>
              <span className="cat-label" style={{ color: card.labelColor }}>{card.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile: auto-scrolling marquee — cards duplicated for seamless infinite loop */}
        <div className="cat-marquee-wrapper">
          <div className="cat-marquee-track">
            {[...categoryCards, ...categoryCards].map((card, i) => (
              <button key={`mq-${i}`} className="cat-card" onClick={() => setPage('shop')} aria-label={card.label}>
                <div className="cat-icon-box" style={{ background: card.bg }}>
                  {card.priceTag
                    ? <><i className="fa-solid fa-tag"></i><span className="cat-price-text">Under<br />{card.priceTag}</span></>
                    : <i className={`fa-solid ${card.icon}`}></i>}
                </div>
                <span className="cat-label" style={{ color: card.labelColor }}>{card.label}</span>
              </button>
            ))}
          </div>
        </div>

      </section>

      {/* ── MOST LOVED PRODUCT BANNER ── */}
      <section className="loved-banner">
        {/* left watermark silhouettes */}
        <div className="loved-deco loved-deco-left" aria-hidden="true">
          <i className="fa-solid fa-cow"></i>
          <i className="fa-solid fa-person"></i>
        </div>
        {/* centre watermark silhouettes */}
        <div className="loved-deco loved-deco-mid" aria-hidden="true">
          <i className="fa-solid fa-jar"></i>
          <i className="fa-solid fa-arrows-spin"></i>
        </div>
        {/* main content (desktop) */}
        <div className="loved-content">
          <span className="loved-eyebrow">
            <i className="fa-solid fa-star"></i> Premium Quality
          </span>
          <h2 className="loved-title">Most Loved Product</h2>
        </div>
        {/* scrolling marquee (mobile) — full banner content in motion */}
        <div className="loved-marquee" aria-hidden="true">
          <div className="loved-marquee-track">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="loved-marquee-item">
                <i className="fa-solid fa-cow loved-mq-deco"></i>
                <i className="fa-solid fa-person loved-mq-deco"></i>
                <span className="loved-mq-eyebrow"><i className="fa-solid fa-star"></i> Premium Quality</span>
                <span className="loved-mq-title">Most Loved Product</span>
                <span className="loved-mq-btn" onClick={() => setPage('shop')}>Shop More <i className="fa-solid fa-arrow-right"></i></span>
                <i className="fa-solid fa-jar loved-mq-deco"></i>
                <i className="fa-solid fa-arrows-spin loved-mq-deco"></i>
              </span>
            ))}
          </div>
        </div>
        <button className="loved-btn" onClick={() => setPage('shop')}>
          Shop More <i className="fa-solid fa-arrow-right"></i>
        </button>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="home-products">
        <div className="section-header text-center">
          <span className="sub-title">Straight from Hanumangarh, Rajasthan</span>
          <h2 className="section-title">Our Products</h2>
          <div className="section-divider"><span></span></div>
        </div>
        <div className="home-products-grid">
          {products.map(prod => (
            <div key={prod.id} className="home-prod-card">
              <div className="home-prod-img-wrap">
                <img src={prod.image} alt={prod.title} className="home-prod-img" />
                {prod.badge && <span className="home-prod-badge">{prod.badge}</span>}
                {prod.discount && <span className="home-prod-discount">{prod.discount}</span>}
              </div>
              <div className="home-prod-body">
                <h3 className="home-prod-name">{prod.title}</h3>
                <div className="home-prod-meta">
                  <Stars rating={prod.rating} />
                  <span className="home-prod-reviews">({prod.reviewsCount})</span>
                </div>
                <p className="home-prod-size"><i className="fa-solid fa-jar"></i> {prod.size}</p>
                <div className="home-prod-price">
                  <span className="home-price-current">₹{prod.price.toLocaleString()}</span>
                  <span className="home-price-old">₹{prod.oldPrice.toLocaleString()}</span>
                </div>
              </div>
              <button className="home-add-cart" onClick={() => dispatch({ type: 'ADD', product: prod })}>
                <i className="fa-solid fa-cart-plus"></i> Add to Cart
              </button>
            </div>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: '32px' }}>
          <button onClick={() => setPage('shop')} className="btn btn-outline">
            View All Products <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </section>

      {/* ── WHY KESARI ROYALE ── */}
      <section className="why-section">
        <div className="section-header text-center">
          <h2 className="section-title">Why Kesari Royale?</h2>
          <div className="section-divider"><span></span></div>
        </div>
        <div className="why-grid">
          {whyItems.map(w => (
            <div key={w.title} className="why-card">
              <div className="why-icon"><i className={`fa-solid ${w.icon}`}></i></div>
              <h4 className="why-title">{w.title}</h4>
              <p className="why-text">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BILONA PROCESS ── */}
      <section className="process-section">
        <div className="section-header text-center">
          <h2 className="section-title">Our Traditional Bilona Process</h2>
          <div className="section-divider"><span></span></div>
        </div>
        <div className="process-steps">
          {processSteps.flatMap((step, i) => {
            const el = (
              <div key={step.num} className="process-step">
                <div className="process-img-wrap">
                  <img src={step.image} alt={step.title} className="process-img" />
                  <div className="process-num">{step.num}</div>
                </div>
                <h4 className="process-title">{step.title}</h4>
                <p className="process-text">{step.text}</p>
              </div>
            );
            return i < processSteps.length - 1
              ? [el, <div key={`arr-${i}`} className="process-arrow"><i className="fa-solid fa-arrow-right"></i></div>]
              : [el];
          })}
        </div>
        <div className="text-center" style={{ marginTop: '36px' }}>
          <button onClick={() => setPage('craft')} className="btn btn-outline">
            Explore Full Process <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="section-header text-center">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="section-divider"><span></span></div>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div key={t.name} className="testi-card">
              <div className="testi-quote-icon">"</div>
              <div className="testi-stars">
                {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
              </div>
              <p className="testi-quote">"{t.quote}"</p>
              <div className="testi-author">
                <div className="testi-avatar"><i className="fa-solid fa-user"></i></div>
                <div>
                  <span className="testi-name">{t.name}</span>
                  <span className="testi-location">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </section>
  );
}
