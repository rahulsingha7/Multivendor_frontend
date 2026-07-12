// src/context/useCart.js
import { useContext } from "react";
import { CartContext } from "./cartContext";

export const useCart = () => useContext(CartContext);
