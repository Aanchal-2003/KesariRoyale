import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.product.id);
      if (existing) return state.map(i => i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...state, { ...action.product, quantity: 1 }];
    }
    case 'INCREMENT': return state.map(i => i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i);
    case 'DECREMENT': {
      const item = state.find(i => i.id === action.id);
      if (item.quantity <= 1) return state.filter(i => i.id !== action.id);
      return state.map(i => i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i);
    }
    case 'REMOVE': return state.filter(i => i.id !== action.id);
    case 'CLEAR': return [];
    case 'LOAD': return action.cart;
    default: return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try { const s = localStorage.getItem('kesari_royale_cart'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem('kesari_royale_cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
