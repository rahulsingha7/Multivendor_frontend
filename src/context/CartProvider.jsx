// src/context/CartProvider.jsx
import React, { useReducer, useEffect, useState, useCallback } from "react";
import {
  cartReducer,
  ADD_ITEM,
  REMOVE_ITEM,
  UPDATE_QUANTITY,
  CLEAR_CART,
} from "./cartReducer";
import { CartContext } from "./cartContext";

const getUserFromStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.id || "guest";
};

export const CartProvider = ({ children }) => {
  const [userId, setUserId] = useState(getUserFromStorage());
  const [storageKey, setStorageKey] = useState(`cart_${userId}`);
  const [cart, dispatch] = useReducer(
    cartReducer,
    JSON.parse(localStorage.getItem(`cart_${userId}`)) || []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const currentId = getUserFromStorage();
      if (currentId !== userId) {
        setUserId(currentId);
        setStorageKey(`cart_${currentId}`);
        const newCart =
          JSON.parse(localStorage.getItem(`cart_${currentId}`)) || [];
        dispatch({ type: CLEAR_CART });
        for (const item of newCart) {
          dispatch({ type: ADD_ITEM, payload: item });
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, storageKey]);

  const addItem = (item) => {
    dispatch({ type: ADD_ITEM, payload: item });
  };

  const removeItem = (productId) => {
    dispatch({ type: REMOVE_ITEM, payload: { productId } });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: UPDATE_QUANTITY, payload: { productId, quantity } });
  };

  const clearCart = useCallback(() => {
    dispatch({ type: CLEAR_CART });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems: cart,
        addItem,
        removeItem,
        updateQuantity,
        updateItemQuantity: updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
