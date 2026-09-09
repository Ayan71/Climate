import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import datasetReducer from './datasetSlice';
import adminReducer from './adminSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    datasets: datasetReducer,
    admins: adminReducer,
    ui: uiReducer,
  },
});
