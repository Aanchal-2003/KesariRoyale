import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'general', message: '' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!/^\+?[0-9]{10,12}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Valid 10-digit number required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSent(true);
  };

  const reset = () => { setSent(false); setForm({ name: '', email: '', phone: '', subject: 'general', message: '' }); setErrors({}); };

  return (
    <section id="contact" className="page-view active">
      <div className="contact-hero">
        <span className="sub-title">Connect with Us</span>
        <h1 className="page-title">Reach Out to Hanumangarh</h1>
        <p className="page-subtitle">Questions about our Vedic process, bulk orders, or batch testing? Our heritage farmers are happy to assist.</p>
      </div>

      <div className="contact-split">
        <div className="contact-info-panel glass-panel">
          <h3>Contact Information</h3>
          <p className="panel-tagline">We ship directly from our family farm cooperatives in Rajasthan.</p>
          <div className="info-list">
            {[
              { icon: 'fa-location-dot', title: 'Farms & Registered Address', lines: ['Village Sangaria, Hanumangarh, Rajasthan, India - 335065'] },
              { icon: 'fa-envelope', title: 'Email Support', lines: ['info@kesariroyale.com'] },
              { icon: 'fa-phone-volume', title: 'Direct Farm Phone', lines: ['+91 9079914464'] },
            ].map(item => (
              <div key={item.title} className="info-item">
                <i className={`fa-solid ${item.icon}`}></i>
                <div><h5>{item.title}</h5>{item.lines.map(l => <p key={l}>{l}</p>)}</div>
              </div>
            ))}
          </div>
          <div className="social-links-title">Follow Our Farmer Cooperative</div>
          <div className="social-links">
            {[
              ['fa-brands fa-facebook', 'Facebook', '#'],
              ['fa-brands fa-instagram', 'Instagram', 'https://www.instagram.com/kesariroyale'],
              ['fa-brands fa-youtube', 'YouTube', '#'],
              ['fa-brands fa-whatsapp', 'WhatsApp', 'https://wa.me/919079914464'],
            ].map(([cls, label, href]) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"><i className={cls}></i></a>
            ))}
          </div>
        </div>

        <div className="contact-form-panel glass-panel">
          <h3>Send a Direct Message</h3>
          <p>Fill out the details below and our care manager will contact you within 24 hours.</p>

          {!sent ? (
            <form onSubmit={submit} noValidate>
              <div className="form-row">
                <div className={`form-group${errors.name ? ' invalid' : ''}`}>
                  <label>Your Full Name <span className="required">*</span></label>
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Aditi Sharma" />
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>
                <div className={`form-group${errors.email ? ' invalid' : ''}`}>
                  <label>Email Address <span className="required">*</span></label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="e.g. aditi@gmail.com" />
                  {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>
              </div>
              <div className={`form-group${errors.phone ? ' invalid' : ''}`}>
                <label>Phone Number <span className="required">*</span></label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="e.g. +91 9876543210" />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Subject of Inquiry</label>
                <select value={form.subject} onChange={e => set('subject', e.target.value)}>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Tracking / Support</option>
                  <option value="bulk">Bulk Commercial Sourcing</option>
                  <option value="report">Lab Verification Inquiries</option>
                </select>
              </div>
              <div className={`form-group${errors.message ? ' invalid' : ''}`}>
                <label>Your Message <span className="required">*</span></label>
                <textarea rows="5" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Write your message here..."></textarea>
                {errors.message && <span className="error-msg">{errors.message}</span>}
              </div>
              <button type="submit" className="btn btn-primary btn-full">Submit Message <i className="fa-solid fa-paper-plane"></i></button>
            </form>
          ) : (
            <div className="contact-success-card" style={{ display: 'flex' }}>
              <i className="fa-solid fa-circle-check success-icon"></i>
              <h4>Message Sent Successfully!</h4>
              <p>Thank you for reaching out. A farm care executive will contact you shortly.</p>
              <button className="btn btn-outline btn-small" onClick={reset}>Send Another Message</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
