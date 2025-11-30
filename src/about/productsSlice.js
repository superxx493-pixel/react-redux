import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'https://fakestoreapi.com/products';

export const fetchProducts = createAsyncThunk('products/fetch', async () => (await axios.get(API)).data);
export const createProduct = createAsyncThunk('products/create', async (p) => (await axios.post(API, p)).data);
export const updateProduct = createAsyncThunk('products/update', async ({ id, p }) => (await axios.put(`${API}/${id}`, p)).data);
export const deleteProduct = createAsyncThunk('products/delete', async (id) => { await axios.delete(`${API}/${id}`); return id; });

const productsSlice = createSlice({
  name: 'products',
  initialState: { list: [], status: 'idle' },
 reducers: {
  sort: (state, { payload: { field, order } }) => {
    state.list.sort((a, b) => {
      const A = a[field];
      const B = b[field];
      if (typeof A === 'number' && typeof B === 'number') {
        return order === 'asc' ? A - B : B - A;
      }
      return order === 'asc' 
        ? String(A).localeCompare(String(B)) 
        : String(B).localeCompare(String(A));
    });
  }
},

  extraReducers: (b) => {
    b.addCase(fetchProducts.fulfilled, (s, a) => { s.list = a.payload; s.status = 'done'; })
     .addCase(createProduct.fulfilled, (s, a) => s.list.push(a.payload))
     .addCase(updateProduct.fulfilled, (s, a) => { const i = s.list.findIndex(p => p.id === a.payload.id); if (i > -1) s.list[i] = a.payload; })
     .addCase(deleteProduct.fulfilled, (s, a) => { s.list = s.list.filter(p => p.id !== a.payload); });
  },
});
export const { sort } = productsSlice.actions;
export default productsSlice.reducer;