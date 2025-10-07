import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import casesReducer from './slices/casesSlice';
import inventoryReducer from './slices/inventorySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cases: casesReducer,
    inventory: inventoryReducer,
  }
});

export default store;
