import { useState, useEffect } from "react";

const RECENTLY_VIEWED_KEY = "mv_recently_viewed";
const MAX_ITEMS = 5;

const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p._id !== product._id);
      const updated = [
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.images?.[0]?.url || product.imageUrl || "",
          category: product.category,
          stock: product.stock,
        },
        ...filtered,
      ].slice(0, MAX_ITEMS);
      return updated;
    });
  };

  return { recentlyViewed, addToRecentlyViewed };
};

export default useRecentlyViewed;
