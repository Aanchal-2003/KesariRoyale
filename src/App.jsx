import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Craft from './pages/Craft';
import Reports from './pages/Reports';
import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import Cart from './pages/Cart';

function PageRouter({ page, setPage }) {
  switch (page) {
    case 'shop':    return <Shop />;
    case 'craft':   return <Craft />;
    case 'reports': return <Reports />;
    case 'blogs':   return <Blogs />;
    case 'contact': return <Contact />;
    case 'cart':    return <Cart setPage={setPage} />;
    default:        return <Home setPage={setPage} />;
  }
}

export default function App() {
  const [page, setPage] = useState('home');

  const navigate = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <CartProvider>
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <Header page={page} setPage={navigate} openCart={() => navigate('cart')} />
      <main className="page-container">
        <PageRouter page={page} setPage={navigate} />
      </main>
      <Footer setPage={navigate} />
      <a
        href="https://wa.me/919079914464"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>
    </CartProvider>
  );
}
