import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ open, onClose, setPage }) {
  const { cart, dispatch, totalItems, totalPrice } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const checkout = () => {
    const id = `KR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderId(id);
    setOrderPlaced(true);
    dispatch({ type: 'CLEAR' });
    onClose();
  };

  const closeSuccess = () => {
    setOrderPlaced(false);
    setPage('shop');
  };

  return (
    <>
      <div className={`cart-drawer${open ? ' open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Your Cart (<span>{totalItems}</span>)</h3>
          <button className="cart-drawer-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>

        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <i className="fa-solid fa-bag-shopping empty-icon"></i>
              <p>Your luxury basket is currently empty.</p>
              <button className="btn btn-primary" onClick={() => { onClose(); setPage('shop'); }}>Browse Products</button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img-box">
                    <img src={item.image} alt={item.title} className="cart-item-img" />
                  </div>
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.title}</h4>
                    <span className="cart-item-size">{item.size}</span>
                    <span className="cart-item-price">₹{item.price.toLocaleString()}</span>
                  </div>
                  <div className="cart-item-actions">
                    <button className="remove-item-btn" onClick={() => dispatch({ type: 'REMOVE', id: item.id })}>
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                    <div className="qty-selector">
                      <button className="qty-btn" onClick={() => dispatch({ type: 'DECREMENT', id: item.id })}><i className="fa-solid fa-minus"></i></button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => dispatch({ type: 'INCREMENT', id: item.id })}><i className="fa-solid fa-plus"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="price-row"><span>Subtotal:</span><span className="price-val">₹{totalPrice.toLocaleString()}</span></div>
            <div className="price-row"><span>Shipping:</span><span className="shipping-free text-green">FREE SHIPPING</span></div>
            <hr />
            <div className="price-row total-row"><span>Estimated Total:</span><span className="price-total-val">₹{totalPrice.toLocaleString()}</span></div>
            <button className="btn btn-primary btn-full checkout-btn" onClick={checkout}>
              Proceed to Checkout <i className="fa-solid fa-cash-register"></i>
            </button>
          </div>
        )}
      </div>
      {open && <div className="cart-overlay open" onClick={onClose}></div>}

      {orderPlaced && (
        <>
          <div className="checkout-modal open">
            <div className="checkout-modal-content glass-panel text-center">
              <div className="success-seal"><i className="fa-solid fa-crown"></i></div>
              <i className="fa-solid fa-circle-check success-check-icon"></i>
              <h2>Order Placed Successfully!</h2>
              <p>Your payment is simulated. We are processing your Vedic selection from Hanumangarh.</p>
              <div className="order-id-box">Order ID: <span>{orderId}</span></div>
              <button className="btn btn-primary" onClick={closeSuccess}>Continue Shopping</button>
            </div>
          </div>
          <div className="checkout-modal-overlay open" onClick={closeSuccess}></div>
        </>
      )}
    </>
  );
}
