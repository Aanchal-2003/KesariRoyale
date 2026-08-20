import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartToast() {
  const { toast, hideToast, totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast || !toast.product) return null;

  const { product } = toast;

  return (
    <div className="cart-toast-wrapper" role="status" aria-live="polite">
      <div className="cart-toast-card glass-panel">
        <div className="cart-toast-header">
          <span className="cart-toast-badge">
            <i className="fa-solid fa-circle-check"></i> Added to Basket
          </span>
          <button className="cart-toast-close" onClick={hideToast} aria-label="Close notification">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div className="cart-toast-body">
          <div className="cart-toast-img-box">
            <img src={product.image} alt={product.title} className="cart-toast-img" />
          </div>
          <div className="cart-toast-details">
            <h4 className="cart-toast-title">{product.title}</h4>
            <span className="cart-toast-size">{product.size}</span>
            <div className="cart-toast-price">₹{product.price?.toLocaleString()}</div>
          </div>
        </div>

        <div className="cart-toast-actions">
          <button 
            className="btn btn-outline cart-toast-btn-secondary" 
            onClick={hideToast}
          >
            Keep Shopping
          </button>
          <button 
            className="btn btn-primary cart-toast-btn-primary" 
            onClick={() => {
              hideToast();
              navigate('/cart');
            }}
          >
            View Basket ({totalItems}) <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
