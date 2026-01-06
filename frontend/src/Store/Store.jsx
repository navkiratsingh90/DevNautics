import { configureStore } from '@reduxjs/toolkit'
// import AuthReducer from '../Features/Auth/AuthSlice'
import ThemeReducer from '../Features/ThemeSlice';
import AuthReducer from '../Features/AuthSlice'

export const store = configureStore({
  reducer: {
		Theme : ThemeReducer,
    Auth : AuthReducer
  },
});