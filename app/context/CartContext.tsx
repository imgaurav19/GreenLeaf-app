import React, { createContext, useContext, useState } from 'react';

type CartContextType = {
  itemCount: number;
  addItem: () => void;
  removeItem: () => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itemCount, setItemCount] = useState(0);

  const addItem = () => setItemCount(prev => prev + 1);
  const removeItem = () => setItemCount(prev => (prev > 0 ? prev - 1 : 0));
  const clearCart = () => setItemCount(0);

  return (
    <CartContext.Provider value={{ itemCount, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
