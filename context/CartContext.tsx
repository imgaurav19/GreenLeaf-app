import React, { createContext, useContext, useState } from 'react';

type CartItem = {
  id: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  getItemQuantity: (id: string) => number;
  addItem: (id?: string) => void;
  removeItem: (id?: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const getItemQuantity = (id: string) => {
    return items.find(i => i.id === id)?.quantity || 0;
  };

  const addItem = (id: string = 'GENERIC_ITEM') => {
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const removeItem = (id: string = 'GENERIC_ITEM') => {
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, itemCount, getItemQuantity, addItem, removeItem, clearCart }}>
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
