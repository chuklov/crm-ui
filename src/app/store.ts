import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { apiSlice } from "../api/apiSlice";
import authReducer, { loginListenerMiddleware } from '../api/authSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: getDefaultMiddleware =>
      getDefaultMiddleware()
          .concat(apiSlice.middleware)
//           .prepend(dwListenerMiddleware.middleware)
          .prepend(loginListenerMiddleware.middleware),
  devTools: true
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;
