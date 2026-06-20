import { useState, useEffect, useRef } from 'react';
import { craftSteps } from '../data/craft';

const journeySteps = [
  {
    step: '01',
    icon: 'fa-cow',
    title: 'Gir & Sahiwal Milk',
    desc: 'We source only pure A2 milk from indigenous Gir and Sahiwal cows — native breeds proven to produce the original A2 beta-casein protein. Our cows graze freely on natural pastures in Hanumangarh, Rajasthan.',
  },
  {
    step: '02',
    icon: 'fa-fire',
    title: 'Upale Slow-Boiled',
    desc: 'Fresh A2 milk is slow-boiled over traditional Upale (dried cow dung cakes), a sacred Vedic practice. This gentle heating preserves enzymes and gives the milk a distinct earthy richness unique to heritage ghee.',
  },
  {
    step: '03',
    icon: 'fa-jar',
    title: 'Clay Pot Curd',
    desc: 'The boiled milk is cooled and set into curd overnight in natural clay pots. Clay pots maintain the ideal temperature, impart beneficial minerals, and nurture the probiotic cultures essential for premium Makkhan butter.',
  },
  {
    step: '04',
    icon: 'fa-arrows-spin',
    title: 'Wooden Churning (Bilona)',
    desc: 'The curd is churned bi-directionally using a wooden Bilona in the ancient Vedic method. This extracts pure Makkhan (golden butter) from curd — not cream — preserving all nutrients that commercial centrifugal methods destroy.',
  },
  {
    step: '05',
    icon: 'fa-fire-burner',
    title: 'Slow Cooking',
    desc: 'The Makkhan is slow-cooked on a controlled wood-fire flame, patiently stirred until it transforms into golden ghee. This preserves fat-soluble vitamins A, D, E, K and the powerful CLA fatty acids.',
  },
  {
    step: '06',
    icon: 'fa-box-open',
    title: 'Packing & Sealing',
    desc: 'The golden ghee is carefully filled into sterilised glass jars, sealed airtight, and labelled by hand. Each jar is inspected for purity and quality before being packed and dispatched — straight from our farm to your kitchen.',
  },
];

const SVG_W = 300;
const SVG_H = 1380;
const SVG_PATH = `M 150 0 C 150 60 260 70 260 115 C 260 215 40 285 40 345 C 40 435 260 515 260 575 C 260 665 40 735 40 805 C 40 895 260 965 260 1035 C 260 1135 40 1205 40 1265`;

const DOT_POSITIONS = [
  { cx: 260, cy: 115 },
  { cx: 40,  cy: 345 },
  { cx: 260, cy: 575 },
  { cx: 40,  cy: 805 },
  { cx: 260, cy: 1035 },
  { cx: 40,  cy: 1265 },
];

const CARD_TOPS = DOT_POSITIONS.map(d => `${(d.cy / SVG_H) * 100}%`);

export default function Craft() {
  const [activeStep, setActiveStep] = useState('1');
  const step = craftSteps[activeStep];

  const journeyRef = useRef(null);
  const pathRef    = useRef(null);
  const [dotProgress, setDotProgress] = useState(-1);

  // Initialise stroke-dasharray after mount
  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray  = `${len}`;
    pathRef.current.style.strokeDashoffset = `${len}`;
  }, []);

  // Scroll → draw path + activate dots
  useEffect(() => {
    const onScroll = () => {
      if (!journeyRef.current || !pathRef.current) return;
      const len  = pathRef.current.getTotalLength();
      const rect = journeyRef.current.getBoundingClientRect();
      const wh   = window.innerHeight;
      const scrolled = wh * 0.65 - rect.top;
      const total    = rect.height - wh * 0.35;
      const prog     = Math.min(1, Math.max(0, scrolled / total));

      pathRef.current.style.strokeDashoffset = `${len * (1 - prog)}`;
      setDotProgress(Math.ceil(prog * journeySteps.length) - 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  return (
    <section id="craft" className="page-view active">
      <div className="craft-hero">
        <span className="sub-title">The Sacred Vedic Process</span>
        <h1 className="page-title">How We Craft Liquid Gold</h1>
        <p className="page-subtitle">Discover the 6 ancient steps of the traditional A2 Bilona method preserved for generations in Hanumangarh.</p>
      </div>

      {/* ── Scroll Journey Timeline ── */}
      <section className="journey-section">
        <div className="section-header text-center">
          <span className="sub-title">From Farm to Jar</span>
          <h2 className="section-title">Our Sacred Process</h2>
        </div>

        <div className="journey-wrapper" ref={journeyRef}>
          {/* SVG winding path */}
          <svg
            className="journey-svg"
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Gray background track */}
            <path
              d={SVG_PATH}
              fill="none"
              stroke="#e3d9cf"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Animated gold progress line */}
            <path
              ref={pathRef}
              d={SVG_PATH}
              fill="none"
              stroke="#ba7517"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Dots */}
            {DOT_POSITIONS.map((dot, i) => {
              const active = dotProgress >= i;
              return (
                <g key={i}>
                  <circle
                    cx={dot.cx} cy={dot.cy} r="13"
                    fill={active ? '#ba7517' : '#ffffff'}
                    stroke={active ? '#9e600f' : '#e3d9cf'}
                    strokeWidth="3"
                    style={{ transition: 'fill 0.4s ease, stroke 0.4s ease' }}
                  />
                  {active && <circle cx={dot.cx} cy={dot.cy} r="5" fill="#ffffff" />}
                </g>
              );
            })}
          </svg>

          {/* Cards */}
          {journeySteps.map((s, i) => {
            const isRight = i % 2 === 0;
            return (
              <div
                key={i}
                className={`journey-card ${isRight ? 'jc-right' : 'jc-left'} ${dotProgress >= i ? 'visible' : ''}`}
                style={{ top: CARD_TOPS[i] }}
              >
                <div className="jc-step-badge">
                  <i className={`fa-solid ${s.icon}`}></i> {s.step}
                </div>
                <h3 className="jc-title">{s.title}</h3>
                <p className="jc-desc">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Existing tab-based deep-dive ── */}
      <div className="craft-timeline-container">
        <div className="timeline-nav">
          {[['1','Gir & Sahiwal Milk'],['2','Upale Slow-Boiled'],['3','Clay Pot Curd'],['4','Wooden Churning'],['5','Slow Cooking'],['6','Packing & Sealing']].map(([n, name]) => (
            <button
              key={n}
              className={`timeline-step-btn${activeStep === n ? ' active' : ''}`}
              onClick={() => setActiveStep(n)}
            >
              <span className="step-num">0{n}</span>
              <span className="step-name">{name}</span>
            </button>
          ))}
        </div>
        <div className="timeline-content-card" style={{ opacity: 1, transform: 'none', transition: 'all 0.3s ease' }}>
          <div className="timeline-card-info">
            <span className="timeline-card-step-badge">{step.badge}</span>
            <h3 className="timeline-card-title">{step.title}</h3>
            <p className="timeline-card-text">{step.text}</p>
            <div className="timeline-card-benefit">
              <h5>Traditional Advantage</h5>
              <p>{step.benefitText}</p>
            </div>
          </div>
          <div className="timeline-card-visual">
            <div className="timeline-card-visual-inner">
              <img src={step.image} alt={step.title} className="timeline-card-img" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Comparison table ── */}
      <section className="advantages">
        <h2 className="section-title text-center">Bilona Ghee vs Commercial Ghee</h2>
<div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="highlight-th">Kesari Royale A2 Bilona Ghee</th>
                <th>Commercial Ghee & Other A2 Ghee</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Source', '100% Indigenous A2 Desi Cows', 'Mixed Breed/A1 Milk & Skimmed Powders'],
                ['Base Ingredient', 'Cultured Curd (Makkhan butter)', 'Industrial Milk Cream (Malai)'],
                ['Churning Method', 'Wooden Bilona (Clockwise/Counter-clockwise)', 'High-speed Metal Centrifuges'],
                ['Cooking Process', 'Milk slow-heated using Upale — traditional cow dung cakes', 'Boiled with high heat steam and chemicals'],
                ['Aroma & Texture', 'Intense nutty aroma, highly grainy texture', 'Flat aroma, uniform oily/waxy texture'],
                ['Digestibility', 'Extremely light, builds Ojas (immunity)', 'Heavy to digest, high risk of acidity'],
              ].map(([f, k, c]) => (
                <tr key={f}>
                  <td data-label="Feature"><strong>{f}</strong></td>
                  <td className="highlight-td" data-label="✓ A2 Bilona Ghee">{k}</td>
                  <td data-label="✗ Commercial Ghee">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
