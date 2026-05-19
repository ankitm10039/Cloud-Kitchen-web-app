import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem, CartItem } from '../types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ item: MenuItem; quantity?: number; customNotes?: string }>) => {
      const { item, quantity = 1, customNotes = '' } = action.payload;
      const existingItemIndex = state.items.findIndex(cartItem => cartItem.id === item.id);

      if (existingItemIndex > -1) {
        state.items[existingItemIndex].quantity += quantity;
        if (customNotes) {
          state.items[existingItemIndex].customNotes = customNotes;
        }
      } else {
        state.items.push({
          ...item,
          quantity,
          customNotes
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity = quantity;
        }
      }
    },
    updateNotes: (state, action: PayloadAction<{ id: string; notes: string }>) => {
      const { id, notes } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        existingItem.customNotes = notes;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, updateNotes, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
