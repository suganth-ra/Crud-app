import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    coupon: null,
    discount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity < 1) return;
      const item = state.items.find((i) => i.id === id);
      if (item) item.quantity = quantity;
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload.code;
      state.discount = action.payload.discount;
    },
    clearCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.discount = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  clearCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
