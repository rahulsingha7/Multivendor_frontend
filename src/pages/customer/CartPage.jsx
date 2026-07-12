import React, { useEffect, useState } from "react";
import { useCart } from "../../context/useCart";
import { useNavigate, Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowLeft,
} from "react-icons/fi";

const CartPage = () => {
  const { cartItems, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [items, setItems] = useState(cartItems);

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-cream dark:bg-base-200">
      {/* Page header */}
      <div className="bg-base-100 border-b border-line dark:border-base-300 px-4 sm:px-10 lg:px-16 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/products")}
            className="p-2 rounded-full hover:bg-base-200 transition text-base-content/60"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-0.5">
              Shopping
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
              Your Cart
              {items.length > 0 && (
                <span className="ml-2 text-base font-semibold text-base-content/40">
                  ({items.length} item{items.length !== 1 ? "s" : ""})
                </span>
              )}
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-10 lg:px-16 py-10">
        {items.length === 0 ? (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="text-7xl mb-4">🛒</div>
            <h3 className="font-serif text-2xl font-semibold text-base-content mb-2">
              Your cart is empty
            </h3>
            <p className="text-base-content/40 text-base mb-8">
              Browse our products and add something you love
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, i) => {
                  const atMax = item.quantity >= item.stock;
                  return (
                    <Motion.div
                      key={item.productId}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-base-100 rounded-2xl p-4 flex gap-4 items-center shadow-sm border border-line dark:border-base-300 hover:shadow-lg transition-shadow duration-300"
                    >
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `${import.meta.env.VITE_API_BASE_URL}/uploads/${item.image}`
                        }
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl shrink-0 bg-base-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base-content text-base leading-snug truncate">
                          {item.name}
                        </h3>
                        <p className="text-orange-600 dark:text-orange-400 font-bold text-lg mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-base-content/40">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                          className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center disabled:opacity-40 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-6 text-center font-semibold text-base text-base-content">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            !atMax &&
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          disabled={atMax}
                          className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center disabled:opacity-40 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition"
                        >
                          <FiPlus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition ml-1"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </Motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <Motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-base-100 rounded-2xl p-6 sm:p-7 shadow-sm border border-line dark:border-base-300 h-fit sticky top-24"
            >
              <h2 className="font-serif font-semibold text-ink dark:text-base-content text-xl mb-6">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-base"
                  >
                    <span className="text-base-content/60 truncate max-w-[150px]">
                      {item.name}{" "}
                      <span className="text-base-content/40">
                        ×{item.quantity}
                      </span>
                    </span>
                    <span className="font-semibold text-base-content">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-line dark:border-base-300 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-base-content text-lg">
                    Total
                  </span>
                  <span className="font-serif text-3xl font-semibold text-orange-600 dark:text-orange-400">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              <Motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/customer/checkout")}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FiShoppingBag size={16} />
                Proceed to Checkout
              </Motion.button>
              <Link
                to="/products"
                className="flex items-center justify-center gap-1.5 text-base text-base-content/40 hover:text-orange-600 dark:hover:text-orange-400 mt-4 transition font-semibold"
              >
                <FiArrowLeft size={14} />
                Continue Shopping
              </Link>
            </Motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
