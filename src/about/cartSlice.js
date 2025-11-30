import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, { payload }) => {
      const item = state.items.find(i => i.id === payload.id);
      item ? item.quantity++ : state.items.push({ ...payload, quantity: 1 });
    },
    removeFromCart: (state, { payload }) => { state.items = state.items.filter(i => i.id !== payload); },
    sortCart: (state, { payload: { field, order } }) => {
      state.items.sort((a, b) => order === 'asc' ? a[field] - b[field] || a[field].localeCompare(b[field]) : b[field] - a[field] || b[field].localeCompare(a[field]));
    },
    
  },
});
export const { addToCart, removeFromCart, sortCart } = cartSlice.actions;
export default cartSlice.reducer;
