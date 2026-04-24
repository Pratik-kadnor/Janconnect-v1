import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import projectReducer from './projectSlice';
import agencyReducer from './agencySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    agencies: agencyReducer,
  },
});

export default store;
