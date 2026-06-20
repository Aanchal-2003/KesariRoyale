import { useState, useEffect } from 'react';

const testimonials = [
  { name: 'Arjun Singh', location: 'Jaipur, Rajasthan', quote: 'The aroma reminds me exactly of the ghee my grandmother made in her village kitchen. Its grainy texture and golden hue are signs of absolute purity.' },
  { name: 'Meera Deshmukh', location: 'Pune, Maharashtra', quote: 'Switching to Kesariroyale A2 Ghee has improved my family\'s digestion significantly. You can taste the difference the traditional Bilona method makes.' },
  { name: 'Rajesh Varma', location: 'New Delhi, Delhi', quote: 'Finally, a brand that respects the Vedic process. This is the only ghee I trust for my children\'s daily meals. It\'s liquid gold.' },
];

const heroSlides = [
  {
    image: '/assets/sahiwal_cows.jpg',
    badge: 'Rajasthan Heritage',
    icon: 'fa-feather-pointed',
    title: 'Pure A2 Milk from Native',
    highlight: 'Sahiwal & Gir Cows',
    description: 'Our indigenous Sahiwal and Gir cows graze freely on the lush pastures of Hanumangarh, producing the richest A2 milk — the sacred foundation of every drop of Kesariroyale ghee.',
    cta1Label: 'Shop Now',
    cta1Page: 'shop',
    cta2Label: 'Our Story',
    cta2Page: 'craft',
  },
  {
    image: '/assets/craft_bilona.jpg',
    badge: 'Ancient Bilona Method',
    icon: 'fa-arrows-spin',
    title: 'Hand-Churned with Love by',
    highlight: 'Village Artisan Women',
    description: 'Experienced village women churn A2 curd in traditional clay pots using the ancient bi-directional Bilona — extracting the purest butter just as generations have done for centuries.',
    cta1Label: 'Discover Our Craft',
    cta1Page: 'craft',
    cta2Label: 'Shop Ghee',
    cta2Page: 'shop',
  },
  {
    image: '/assets/ghee_lifestyle.jpg',
    badge: 'Kesariroyale Premium',
    icon: 'fa-jar',
    title: 'Purest A2 Bilona Ghee',
    highlight: 'Crafted in Rajasthan',
    description: 'Slow-cooked on controlled flame, hand-churned in clay pots. Unleash the sacred, golden essence of native A2 cows for your family\'s daily wellness.',
    cta1Label: 'Purchase Now',
    cta1Page: 'shop',
    cta2Label: 'Discover Our Craft',
    cta2Page: 'craft',
  },
];

export default function Home({ setPage }) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [reviewIdx, setReviewIdx] = useState(0);

  const prevSlide = () => setHeroIdx(i => (i - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setHeroIdx(i => (i + 1) % heroSlides.length);
  const prev = () => setReviewIdx(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setReviewIdx(i => (i + 1) % testimonials.length);

  useEffect(() => {
    if (window.innerWidth <= 768) return;
    const timer = setInterval(() => {
      setHeroIdx(i => (i + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="page-view active">

      {/* Hero Carousel */}
      <section className="hero-carousel">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-slide${heroIdx === idx ? ' active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-bg-overlay"></div>
            <div className="hero-content">
              <div className="badge-heritage">
                <i className={`fa-solid ${slide.icon}`}></i> {slide.badge}
              </div>
              <h1 className="hero-title">
                {slide.title} <span className="highlight">{slide.highlight}</span>
              </h1>
              <p className="hero-description">{slide.description}</p>
              <div className="hero-actions">
                <button onClick={() => setPage(slide.cta1Page)} className="btn btn-primary">
                  {slide.cta1Label} <i className="fa-solid fa-arrow-right"></i>
                </button>
                <button onClick={() => setPage(slide.cta2Page)} className="btn btn-outline">
                  {slide.cta2Label}
                </button>
              </div>
            </div>
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
            <button
              key={idx}
              className={`carousel-dot${heroIdx === idx ? ' active' : ''}`}
              onClick={() => setHeroIdx(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="section-header text-center">
          <span className="sub-title">The Three Pillars of Purity</span>
          <h2 className="section-title">The Vedic Standard</h2>
        </div>
        <div className="features-grid">
          {[
            { icon: 'fa-arrows-spin', title: 'Bilona Method', text: 'We use the bi-directional wooden churn to extract butter from curd, not milk cream, ensuring nutrient density and absolute purity.' },
            { icon: 'fa-droplet', title: 'Type of Milk', text: 'We source only pure A2 milk from indigenous Sahiwal and Gir cows — breeds proven to produce the original A2 beta-casein protein, free from A1 and easier on digestion.' },
            { icon: 'fa-box-open', title: 'Small Batch Production', text: 'Every batch of Kesariroyale ghee is crafted in small quantities to ensure hands-on quality control, consistent golden texture, and the rich aroma that large-scale production simply cannot match.' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon"><i className={`fa-solid ${f.icon}`}></i></div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-text">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Heritage Split */}
      <section className="heritage-split">
        <div className="heritage-visual">
          <div className="heritage-image-wrapper">
            <img src="/assets/craft_bilona.jpg" alt="Traditional Vedic Bilona" className="heritage-img" />
            <div className="heritage-badge">Hanumangarh, Rajasthan</div>
          </div>
        </div>
        <div className="heritage-content">
          <span className="sub-title">Revived Traditions from Rajasthan's Heart</span>
          <h2 className="section-title">Sacred, Golden Essence of Ancient Times</h2>
          <p className="heritage-text">Sourced from the fertile lands of Hanumangarh, Kesariroyale is dedicated to the ancient Bilona method. Unlike commercial ghee made from cream, our process starts with whole A2 milk from indigenous cows.</p>
          <p className="heritage-text">We set it into curd, churn it with wooden Bilonas, and slow-cook the butter on a controlled flame. This labor-intensive craft preserves the grainy texture and nutty aroma of our heritage.</p>
          <div className="heritage-tags">
            <span><i className="fa-solid fa-seedling"></i> 100% Organic</span>
            <span><i className="fa-solid fa-shield"></i> Lab Certified A2</span>
            <span><i className="fa-solid fa-temperature-arrow-down"></i> Slow Cooked</span>
          </div>
          <button onClick={() => setPage('craft')} className="btn btn-outline">Explore the Traditional Process</button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-header text-center">
          <span className="sub-title">Words of Appreciations</span>
          <h2 className="section-title">Pure Ghee Reviews</h2>
        </div>
        <div className="testimonials-marquee-wrapper">
          <div className="testimonials-marquee-track">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="stars">{[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}</div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <span className="author-name">{t.name}</span>
                    <span className="author-location">{t.location}</span>
                  </div>
                  <span className="verified-buyer"><i className="fa-solid fa-circle-check"></i> Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-overlay"></div>
        <div className="cta-content">
          <h2>Bring Vedic Wellness to Your Kitchen</h2>
          <p>Experience the luxurious aroma and certified nutrition of Hanumangarh's pride. Directly sourced. Safely shipped across India.</p>
          <button onClick={() => setPage('shop')} className="btn btn-primary btn-large">Shop Purity Now <i className="fa-solid fa-cart-shopping"></i></button>
        </div>
      </section>

    </section>
  );
}
