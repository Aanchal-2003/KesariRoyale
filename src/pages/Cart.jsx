import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Cart({ setPage }) {
  const { cart, dispatch, totalItems, totalPrice } = useCart();
  const [step, setStep] = useState('cart'); // 'cart' or 'checkout'
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Rajasthan',
    pincode: '',
    paymentMethod: 'cod'
  });
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [submittedForm, setSubmittedForm] = useState(null);

  const sendOrderEmail = async (orderId, customerForm, cartItems, cartTotalPrice) => {
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || "3151ece5-7572-4ebf-b12f-e8cd52216139";
    if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
      console.warn("Web3Forms Access Key is not configured. Email was not sent. Configure VITE_WEB3FORMS_KEY in your .env file.");
      return;
    }

    try {
      const itemsListText = cartItems
        .map(i => `- ${i.title} (${i.size}) x ${i.quantity} = ₹${(i.price * i.quantity).toLocaleString()}`)
        .join('\n');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `👑 New Order Created - ${orderId} | Kesari Royale`,
          from_name: "Kesari Royale Store",
          to_email: "kesariroyale@gmail.com",
          order_id: orderId,
          customer_name: customerForm.name,
          customer_email: customerForm.email,
          customer_phone: customerForm.phone,
          delivery_address: `${customerForm.address}, ${customerForm.city}, ${customerForm.state} - ${customerForm.pincode}`,
          payment_method: customerForm.paymentMethod === 'cod' ? 'Cash On Delivery (COD)' : 'Prepaid (Simulated)',
          order_items: itemsListText,
          total_amount: `₹${cartTotalPrice.toLocaleString()}`,
          message: `A new order has been placed on Kesari Royale.\n\nOrder ID: ${orderId}\nCustomer: ${customerForm.name}\nPhone: ${customerForm.phone}\nEmail: ${customerForm.email}\nAddress: ${customerForm.address}, ${customerForm.city}, ${customerForm.state} - ${customerForm.pincode}\nPayment Method: ${customerForm.paymentMethod}\n\nItems:\n${itemsListText}\n\nTotal Amount: ₹${cartTotalPrice.toLocaleString()}`
        })
      });

      const result = await response.json();
      if (result.success) {
        console.log("Order email notification sent successfully to kesariroyale@gmail.com!");
      } else {
        console.error("Failed to send order email:", result.message);
      }
    } catch (err) {
      console.error("Error sending order email:", err);
    }
  };

  const handlePlaceOrder = (e) => {
    e?.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!/^\d{10}$/.test(form.phone.replace(/[\s\-]/g, ''))) errs.phone = 'Valid 10-digit mobile number required';
    if (!form.address.trim()) errs.address = 'Delivery address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!/^\d{6}$/.test(form.pincode.replace(/\s/g, ''))) errs.pincode = 'Valid 6-digit PIN code required';
    
    setErrors(errs);
    
    if (Object.keys(errs).length === 0) {
      const id = `KR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderId(id);
      setSubmittedForm({ ...form });
      setOrderPlaced(true);
      setStep('cart');
      
      // Dispatch email notification to Web3Forms
      sendOrderEmail(id, form, cart, totalPrice);
      
      dispatch({ type: 'CLEAR' });
      // Reset form
      setForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: 'Rajasthan',
        pincode: '',
        paymentMethod: 'cod'
      });
    }
  };

  const closeSuccess = () => {
    setOrderPlaced(false);
    setSubmittedForm(null);
    setPage('shop');
  };

  return (
    <section id="cart-page-view" className="page-view active">
      <div className="cart-hero">
        <span className="sub-title">Your Selection</span>
        <h1 className="page-title">{step === 'cart' ? 'Your Premium Basket' : 'Delivery Details'}</h1>
        <p className="page-subtitle">
          {step === 'cart' 
            ? 'Review your Vedic products. Handcrafted and slow-cooked in Hanumangarh, Rajasthan.'
            : 'Enter delivery details below to ship your organic Vedic superfoods directly from our farm.'}
        </p>
      </div>

      <div className="cart-page-container">
        {cart.length === 0 ? (
          <div className="cart-empty-state glass-panel text-center">
            <i className="fa-solid fa-bag-shopping empty-icon-large"></i>
            <h2>Your basket is empty</h2>
            <p>Add some authentic A2 Bilona Ghee or cold-pressed oils to experience pure health and taste.</p>
            <button className="btn btn-primary" onClick={() => setPage('shop')}>Browse Products</button>
          </div>
        ) : (
          <div className="cart-page-layout">
            {/* Left Column: Cart Items OR Shipping Form */}
            {step === 'cart' ? (
              <div className="cart-items-panel glass-panel">
                <h3 className="panel-title">Selected Items ({totalItems})</h3>
                <div className="cart-page-items-list">
                  {cart.map(item => (
                    <div key={item.id} className="cart-page-item">
                      <div className="cart-page-item-img-box">
                        <img src={item.image} alt={item.title} className="cart-page-item-img" />
                      </div>
                      
                      <div className="cart-page-item-details">
                        <span className="cart-page-item-category">{item.category.toUpperCase()}</span>
                        <h4 className="cart-page-item-title">{item.title}</h4>
                        <span className="cart-page-item-size"><i className="fa-solid fa-jar"></i> {item.size}</span>
                      </div>

                      <div className="cart-page-item-qty-price">
                        <div className="qty-selector-large">
                          <button className="qty-btn-large" onClick={() => dispatch({ type: 'DECREMENT', id: item.id })}><i className="fa-solid fa-minus"></i></button>
                          <span className="qty-val-large">{item.quantity}</span>
                          <button className="qty-btn-large" onClick={() => dispatch({ type: 'INCREMENT', id: item.id })}><i className="fa-solid fa-plus"></i></button>
                        </div>
                        
                        <div className="cart-page-item-price-info">
                          <span className="unit-price">₹{item.price.toLocaleString()} each</span>
                          <span className="total-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>

                      <button className="remove-item-btn-large" onClick={() => dispatch({ type: 'REMOVE', id: item.id })} title="Remove item">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="cart-page-actions">
                  <button className="btn btn-outline" onClick={() => setPage('shop')}>
                    <i className="fa-solid fa-arrow-left"></i> Continue Shopping
                  </button>
                  <button className="btn btn-outline text-red" onClick={() => dispatch({ type: 'CLEAR' })}>
                    <i className="fa-solid fa-trash-can"></i> Clear Entire Basket
                  </button>
                </div>
              </div>
            ) : (
              <div className="cart-items-panel glass-panel">
                <h3 className="panel-title">Enter Delivery Details</h3>
                
                <form onSubmit={handlePlaceOrder} noValidate>
                  <div className="form-row">
                    <div className={`form-group${errors.name ? ' invalid' : ''}`}>
                      <label>Your Full Name <span className="required">*</span></label>
                      <input 
                        type="text" 
                        value={form.name} 
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                        placeholder="e.g. Aditi Sharma" 
                      />
                      {errors.name && <span className="error-msg">{errors.name}</span>}
                    </div>
                    
                    <div className={`form-group${errors.email ? ' invalid' : ''}`}>
                      <label>Email Address <span className="required">*</span></label>
                      <input 
                        type="email" 
                        value={form.email} 
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                        placeholder="e.g. aditi@gmail.com" 
                      />
                      {errors.email && <span className="error-msg">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className={`form-group${errors.phone ? ' invalid' : ''}`}>
                      <label>Mobile Number <span className="required">*</span></label>
                      <input 
                        type="tel" 
                        value={form.phone} 
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
                        placeholder="10-digit mobile number" 
                      />
                      {errors.phone && <span className="error-msg">{errors.phone}</span>}
                    </div>
                    
                    <div className={`form-group${errors.pincode ? ' invalid' : ''}`}>
                      <label>PIN Code <span className="required">*</span></label>
                      <input 
                        type="text" 
                        value={form.pincode} 
                        onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} 
                        placeholder="e.g. 335065" 
                      />
                      {errors.pincode && <span className="error-msg">{errors.pincode}</span>}
                    </div>
                  </div>

                  <div className={`form-group${errors.address ? ' invalid' : ''}`}>
                    <label>Delivery Address (House No, Street, Area) <span className="required">*</span></label>
                    <textarea 
                      rows="3" 
                      value={form.address} 
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))} 
                      placeholder="Complete address details..."
                    ></textarea>
                    {errors.address && <span className="error-msg">{errors.address}</span>}
                  </div>

                  <div className="form-row">
                    <div className={`form-group${errors.city ? ' invalid' : ''}`}>
                      <label>City <span className="required">*</span></label>
                      <input 
                        type="text" 
                        value={form.city} 
                        onChange={e => setForm(f => ({ ...f, city: e.target.value }))} 
                        placeholder="e.g. Hanumangarh" 
                      />
                      {errors.city && <span className="error-msg">{errors.city}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>State</label>
                      <select 
                        value={form.state} 
                        onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                      >
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Other">Other State</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Payment Method</label>
                    <div className="payment-options-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '6px' }}>
                      <label className={`payment-option-card${form.paymentMethod === 'cod' ? ' active' : ''}`} style={{
                        padding: '12px',
                        border: '1px solid var(--color-gray-250)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: form.paymentMethod === 'cod' ? 'rgba(186, 117, 23, 0.04)' : 'none',
                        borderColor: form.paymentMethod === 'cod' ? 'var(--color-primary)' : 'var(--color-gray-250)'
                      }}>
                        <input 
                          type="radio" 
                          name="payment" 
                          value="cod" 
                          checked={form.paymentMethod === 'cod'} 
                          onChange={() => setForm(f => ({ ...f, paymentMethod: 'cod' }))}
                          style={{ cursor: 'pointer' }}
                        />
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.85rem' }}>Cash on Delivery</strong>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)' }}>Pay when delivered</span>
                        </div>
                      </label>
                      
                      <label className={`payment-option-card${form.paymentMethod === 'online' ? ' active' : ''}`} style={{
                        padding: '12px',
                        border: '1px solid var(--color-gray-250)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: form.paymentMethod === 'online' ? 'rgba(186, 117, 23, 0.04)' : 'none',
                        borderColor: form.paymentMethod === 'online' ? 'var(--color-primary)' : 'var(--color-gray-255)'
                      }}>
                        <input 
                          type="radio" 
                          name="payment" 
                          value="online" 
                          checked={form.paymentMethod === 'online'} 
                          onChange={() => setForm(f => ({ ...f, paymentMethod: 'online' }))}
                          style={{ cursor: 'pointer' }}
                        />
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.85rem' }}>UPI / Card (Simulated)</strong>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)' }}>100% Secure Checkout</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setStep('cart')}>
                      <i className="fa-solid fa-arrow-left"></i> Back to Basket
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Right Column: Summary Card */}
            <div className="cart-summary-panel glass-panel">
              <h3 className="panel-title">Order Summary</h3>
              
              <div className="summary-price-breakdown">
                <div className="summary-row">
                  <span>Cart Subtotal</span>
                  <span className="price-val">₹{totalPrice.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping & Handling</span>
                  <span className="shipping-free text-green" style={{ color: '#75B529', fontWeight: '700' }}>FREE SHIPPING</span>
                </div>
                
                <hr className="summary-divider" />
                
                <div className="summary-row total-row-large">
                  <span>Estimated Total</span>
                  <span className="price-total-val-large">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Security Trust Badges */}
              <div className="checkout-trust-badges">
                <div className="trust-badge">
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>100% Secure Payments</span>
                </div>
                <div className="trust-badge">
                  <i className="fa-solid fa-truck-fast"></i>
                  <span>Fast Farm Dispatch</span>
                </div>
              </div>

              {step === 'cart' ? (
                <button className="btn btn-primary btn-full checkout-btn-large" onClick={() => setStep('checkout')}>
                  Proceed to Checkout <i className="fa-solid fa-arrow-right"></i>
                </button>
              ) : (
                <button className="btn btn-primary btn-full checkout-btn-large" onClick={handlePlaceOrder}>
                  Place Order <i className="fa-solid fa-circle-check"></i>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {orderPlaced && (
        <>
          <div className="checkout-modal open">
            <div className="checkout-modal-content glass-panel text-center">
              <div className="success-seal"><i className="fa-solid fa-crown"></i></div>
              <i className="fa-solid fa-circle-check success-check-icon"></i>
              <h2>Order Placed Successfully!</h2>
              <p>We are processing your Vedic selection from Hanumangarh, Rajasthan.</p>
              
              {submittedForm && (
                <div className="submitted-details-box" style={{
                  textAlign: 'left',
                  margin: '20px auto',
                  padding: '16px',
                  background: 'rgba(186, 117, 23, 0.03)',
                  border: '1px solid var(--color-gray-200)',
                  borderRadius: 'var(--radius-md)',
                  maxWidth: '460px',
                  fontSize: '0.85rem',
                  lineHeight: '1.6'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '6px', color: 'var(--color-primary-dark)', fontSize: '0.95rem' }}>
                    <i className="fa-solid fa-truck-ramp-box"></i> Delivery Information
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '6px' }}>
                    <span style={{ color: 'var(--color-gray-500)' }}>Recipient:</span>
                    <strong>{submittedForm.name}</strong>
                    
                    <span style={{ color: 'var(--color-gray-500)' }}>Contact:</span>
                    <strong>{submittedForm.phone} ({submittedForm.email})</strong>
                    
                    <span style={{ color: 'var(--color-gray-500)' }}>Address:</span>
                    <strong>{submittedForm.address}, {submittedForm.city}, {submittedForm.state} - {submittedForm.pincode}</strong>
                    
                    <span style={{ color: 'var(--color-gray-500)' }}>Method:</span>
                    <strong style={{ textTransform: 'uppercase' }}>{submittedForm.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Prepaid (Simulated)'}</strong>
                  </div>
                </div>
              )}

              <div className="order-id-box" style={{ margin: '15px 0 25px 0' }}>Order ID: <span>{orderId}</span></div>
              <button className="btn btn-primary" onClick={closeSuccess}>Continue Shopping</button>
            </div>
          </div>
          <div className="checkout-modal-overlay open" onClick={closeSuccess}></div>
        </>
      )}
    </section>
  );
}
