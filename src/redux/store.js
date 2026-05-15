import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

// ✅ Create Redux Store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// ✅ Keep cart in sync with localStorage on every change
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("cart", JSON.stringify(state.cart.items));
});

export const RootState = store.getState;
