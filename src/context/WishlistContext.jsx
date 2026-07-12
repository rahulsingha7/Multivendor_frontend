import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;
const LOCAL_KEY = "mv_wishlist";

export const WishlistContext = createContext(null);

const getToken = () => localStorage.getItem("token");

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = !!getToken();

  const fetchWishlist = useCallback(async () => {
    if (!getToken()) {
      // Guest — use localStorage
      try {
        setWishlist(JSON.parse(localStorage.getItem(LOCAL_KEY)) || []);
      } catch {
        setWishlist([]);
      }
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/customer/wishlist`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const backendWishlist = res.data.products || [];

      // Migrate guest wishlist to backend on login
      const guestWishlist = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
      if (guestWishlist.length > 0) {
        for (const item of guestWishlist) {
          const alreadySaved = backendWishlist.some(
            (p) => p._id?.toString() === item._id?.toString(),
          );
          if (!alreadySaved) {
            await axios
              .post(
                `${API}/api/customer/wishlist/toggle`,
                { productId: item._id },
                { headers: { Authorization: `Bearer ${getToken()}` } },
              )
              .catch(() => {});
          }
        }
        localStorage.removeItem(LOCAL_KEY);
        const updated = await axios.get(`${API}/api/customer/wishlist`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setWishlist(updated.data.products || []);
      } else {
        setWishlist(backendWishlist);
      }
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = (productId) =>
    wishlist.some(
      (p) => (p._id?.toString() || p?.toString()) === productId?.toString(),
    );

  const toggleWishlist = async (product) => {
    if (!getToken()) {
      // Guest — localStorage only
      setWishlist((prev) => {
        const exists = prev.some((p) => p._id === product._id);
        const updated = exists
          ? prev.filter((p) => p._id !== product._id)
          : [
              ...prev,
              {
                _id: product._id,
                name: product.name,
                price: product.price,
                imageUrl: product.images?.[0]?.url || product.imageUrl || "",
                category: product.category,
                stock: product.stock,
              },
            ];
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    // Logged in — optimistic update
    const alreadyIn = isWishlisted(product._id);
    setWishlist((prev) =>
      alreadyIn
        ? prev.filter(
            (p) =>
              (p._id?.toString() || p?.toString()) !== product._id?.toString(),
          )
        : [
            ...prev,
            {
              _id: product._id,
              name: product.name,
              price: product.price,
              imageUrl: product.images?.[0]?.url || product.imageUrl || "",
              category: product.category,
              stock: product.stock,
            },
          ],
    );

    try {
      await axios.post(
        `${API}/api/customer/wishlist/toggle`,
        { productId: product._id },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
    } catch {
      fetchWishlist(); // Revert on failure
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!getToken()) {
      setWishlist((prev) => {
        const updated = prev.filter((p) => p._id !== productId);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    setWishlist((prev) =>
      prev.filter(
        (p) => (p._id?.toString() || p?.toString()) !== productId?.toString(),
      ),
    );

    try {
      await axios.post(
        `${API}/api/customer/wishlist/toggle`,
        { productId },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
    } catch {
      fetchWishlist();
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
