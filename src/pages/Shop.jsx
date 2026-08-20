import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const FILTERS = [
  { key: 'all', label: 'All Products' },
  { key: 'ghee', label: 'Vedic A2 Ghee' },
  { key: 'oils', label: 'Cold-Pressed Oils' },
  { key: 'infusions', label: 'Saffron & Infusions' },
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

export default function Shop() {
  const [filter, setFilter] = useState('all');
  const [addedId, setAddedId] = useState(null);
  const { addToCart, dispatch } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (prod) => {
    if (addToCart) {
      addToCart(prod);
    } else {
      dispatch({ type: 'ADD', product: prod });
    }
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 2200);
  };

  const handleBuyNow = (prod) => {
    if (addToCart) {
      addToCart(prod);
    } else {
      dispatch({ type: 'ADD', product: prod });
    }
    navigate('/cart', { state: { directCheckout: true } });
  };

  const visible = filter === 'all' ? products : products.filter(p => p.category === filter);

  return (
    <section id="shop" className="page-view active">
      <div className="shop-hero">
        <span className="sub-title">Organic Marketplace</span>
        <h1 className="page-title">Sustainably Harvested Products</h1>
        <p className="page-subtitle">Straight from Rajasthan's heart to your home. Organic, pure, chemical-free.</p>
      </div>

      <div className="shop-filters">
        {FILTERS.map(f => (
          <button key={f.key} className={`filter-btn${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {visible.map(prod => (
          <div key={prod.id} className="product-card">
            <div className="product-img-box">
              <img src={prod.image} alt={prod.title} className="product-img" />
              {prod.badge && <span className="prod-badge">{prod.badge}</span>}
              {prod.discount && <span className="discount-badge">{prod.discount}</span>}
            </div>
            <div className="product-info">
              <span className="sub-title">{prod.category.toUpperCase()}</span>
              <h3 className="product-title">{prod.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Stars rating={prod.rating} />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-600)' }}>({prod.reviewsCount} reviews)</span>
              </div>
              <p className="product-desc">{prod.description}</p>
              
              <div className="product-footer">
                <div className="product-price">
                  <span className="price-regular">₹{prod.price.toLocaleString()}</span>
                  <span className="price-old">₹{prod.oldPrice.toLocaleString()}</span>
                </div>
                <div className="shop-prod-actions">
                  <button 
                    className={`shop-btn-cart${addedId === prod.id ? ' added' : ''}`} 
                    onClick={() => handleAddToCart(prod)} 
                    title="Add to Cart"
                    aria-label={`Add ${prod.title} to cart`}
                  >
                    <i className={addedId === prod.id ? "fa-solid fa-check" : "fa-solid fa-cart-plus"}></i>
                    <span>{addedId === prod.id ? 'Added!' : 'Add to Cart'}</span>
                  </button>
                  <button 
                    className="shop-btn-buy" 
                    onClick={() => handleBuyNow(prod)} 
                    title="Buy Now"
                    aria-label={`Buy ${prod.title} now`}
                  >
                    <i className="fa-solid fa-bolt"></i>
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
