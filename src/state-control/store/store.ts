import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from '../features/authSlice'
import { orderApi } from "../api/orderApi";
import { userApi } from "../api/userApi";


const reducers = combineReducers({
  // @todo
  auth: authReducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [userApi.reducerPath]: userApi.reducer
});

export const store = configureStore({
  //this is just a demo to remove the error
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      orderApi.middleware,
      userApi.middleware
    ]),
  // devTools: process.env.NODE_ENV !== "production",
});

// setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
