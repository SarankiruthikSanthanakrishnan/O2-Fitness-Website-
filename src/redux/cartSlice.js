import { createSlice } from "@reduxjs/toolkit";

// ✅ Load cart data safely from localStorage
const loadCart = () => {
  try {
    const saved = localStorage.getItem("cart");
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load cart:", err);
    return [];
  }
};

// ✅ Save cart data to localStorage
const saveCart = (items) => {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save cart:", err);
  }
};

const initialState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Add to Cart
    addToCart(state, action) {
      if (!Array.isArray(state.items)) state.items = [];
      const item = action.payload;
      const existing = state.items.find((p) => p.id === item.id);

      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
      saveCart(state.items);
    },

    // ✅ Increment Quantity
    incrementQty(state, action) {
      const item = state.items.find((p) => p.id === action.payload);
      if (item) item.quantity += 1;
      saveCart(state.items);
    },

    // ✅ Decrement Quantity
    decrementQty(state, action) {
      const item = state.items.find((p) => p.id === action.payload);
      if (item) {
        if (item.quantity > 1) item.quantity -= 1;
        else state.items = state.items.filter((p) => p.id !== action.payload);
      }
      saveCart(state.items);
    },

    // ✅ Remove Single Product
    removeFromCart(state, action) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      saveCart(state.items);
    },

    // ✅ Clear Entire Cart
    clearCart(state) {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  incrementQty,
  decrementQty,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
