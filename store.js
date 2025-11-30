import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import productsReducer from './src/slices/productsSlice';
import cartReducer from './src/slices/cartSlice';

const persistConfig = { key: 'root', storage };
const rootReducer = combineReducers({ products: productsReducer, cart: cartReducer });
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});
export const persistor = persistStore(store);