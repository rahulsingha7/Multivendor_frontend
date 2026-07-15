import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from "react-icons/fi";
import useWishlist from "../../hooks/useWishList";
import { useCart } from "../../context/useCart";
import toast from "react-hot-toast";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { cartItems, addItem, updateItemQuantity } = useCart();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    if (product.stock === 0) {
      toast.error("Out of stock");
      return;
    }
    const existing = cartItems.find((i) => i.productId === product._id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error(`Only ${product.stock} available`);
        return;
      }
      updateItemQuantity(product._id, existing.quantity + 1);
    } else {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock,
        image: product.imageUrl || "",
        vendorId: product.vendorId,
      });
    }
    toast.success("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-base-200">
      {/* Header */}
      <div className="bg-base-100 border-b border-line dark:border-base-300 px-4 sm:px-10 lg:px-16 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-base-200 transition text-base-content/60"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-0.5">
              Saved Items
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content flex items-center gap-2">
              <FiHeart className="text-orange-500" /> My Wishlist
              {wishlist.length > 0 && (
                <span className="text-base font-semibold text-base-content/40">
                  ({wishlist.length})
                </span>
              )}
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-10 lg:px-16 py-10">
        {wishlist.length === 0 ? (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="text-7xl mb-4">🤍</div>
            <h3 className="font-serif text-2xl font-semibold text-base-content mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-base-content/40 text-base mb-8">
              Save products you love by clicking the heart icon
            </p>
            <Motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Link
                to="/products"
                className="inline-block px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg"
              >
                Browse Products
              </Link>
            </Motion.div>
          </Motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
            <AnimatePresence>
              {wishlist.map((product, i) => {
                const outOfStock = product.stock === 0;
                return (
                  <Motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="bg-base-100 rounded-2xl overflow-hidden shadow-sm border border-line dark:border-base-300 hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div
                      className="relative h-80 sm:h-96 overflow-hidden bg-base-200 cursor-pointer"
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      <Motion.img
                        src={product.imageUrl || "/placeholder.jpg"}
                        alt={product.name}
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full h-full object-cover"
                      />
                      {outOfStock && (
                        <span className="absolute top-3 left-3 bg-ink text-cream text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                          Sold out
                        </span>
                      )}
                      {/* Remove from wishlist */}
                      <Motion.button
                        whileTap={{ scale: 1.3 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(product._id);
                          toast.success("Removed from wishlist");
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 flex items-center justify-center text-red-500 hover:bg-red-50 transition shadow-sm"
                      >
                        <FiTrash2 size={13} />
                      </Motion.button>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-grow">
                      <p className="text-xs uppercase tracking-widest text-base-content/40 mb-1.5">
                        {product.category?.name || "General"}
                      </p>
                      <h3
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="font-medium text-base-content text-[15px] leading-snug mb-2 line-clamp-2 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition flex-grow"
                      >
                        {product.name}
                      </h3>
                      <p className="text-orange-600 dark:text-orange-400 font-bold text-base mb-3">
                        ${product.price.toFixed(2)}
                      </p>
                      <Motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAddToCart(product)}
                        disabled={outOfStock}
                        className={`w-full py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition
                          ${
                            outOfStock
                              ? "bg-base-200 text-base-content/40 cursor-not-allowed"
                              : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-lg"
                          }`}
                      >
                        <FiShoppingCart size={13} />
                        {outOfStock ? "Out of Stock" : "Add to Cart"}
                      </Motion.button>
                    </div>
                  </Motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
