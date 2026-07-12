import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiArrowUpRight, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../../context/useCart";
import useWishlist from "../../hooks/useWishlist";
import toast from "react-hot-toast";

const isNewProduct = (product) => {
  if (!product?.createdAt) return false;
  const days = (Date.now() - new Date(product.createdAt).getTime()) / 86400000;
  return days <= 7;
};

const ProductList = () => {
  const { cartItems, addItem, updateItemQuantity } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/products/public?limit=8`)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => toast.error("Failed to fetch products"))
      .finally(() => setLoading(false));
  }, []);

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
      toast.success(`Quantity updated`);
    } else {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock,
        image: product.images?.[0]?.url || product.imageUrl || "",
        vendorId: product.vendorId || product.vendor?._id,
      });
      toast.success(`Added to cart`);
    }
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-10 lg:px-16 bg-cream dark:bg-base-200">
      <div className="w-full">
        {/* Section header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-orange-600 dark:text-orange-400 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
              Fresh in store
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink dark:text-base-content leading-tight">
              Trending this week
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink dark:border-base-content text-sm font-semibold text-ink dark:text-base-content hover:bg-ink hover:text-cream dark:hover:bg-base-content dark:hover:text-base-100 transition"
          >
            View all products
            <FiArrowUpRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse h-[480px]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
            {products.map((product, i) => {
              const cartItem = cartItems.find(
                (it) => it.productId === product._id,
              );
              const atMax = cartItem?.quantity >= product.stock;
              const outOfStock = product.stock === 0;
              const image =
                product.images?.[0]?.url ||
                product.imageUrl ||
                "/placeholder.jpg";

              return (
                <Motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="group bg-base-100 border border-line dark:border-base-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                >
                  <div
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="relative h-80 sm:h-96 bg-base-200 cursor-pointer overflow-hidden"
                  >
                    <Motion.img
                      src={image}
                      alt={product.name}
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="w-full h-full object-cover"
                    />

                    {/* Tags */}
                    {outOfStock ? (
                      <span className="absolute top-3 left-3 bg-ink text-cream text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        Sold out
                      </span>
                    ) : isNewProduct(product) ? (
                      <Motion.span
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
                      >
                        New
                      </Motion.span>
                    ) : product.stock <= 5 ? (
                      <span className="absolute top-3 left-3 bg-gold-400 text-ink text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        Only {product.stock} left
                      </span>
                    ) : null}

                    {/* Wishlist */}
                    <Motion.button
                      whileTap={{ scale: 1.3 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                        toast.success(
                          isWishlisted(product._id)
                            ? "Removed from wishlist"
                            : "Added to wishlist",
                        );
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 flex items-center justify-center text-ink hover:text-orange-500 transition"
                    >
                      {isWishlisted(product._id) ? (
                        <FaHeart size={13} className="text-orange-500" />
                      ) : (
                        <FaRegHeart size={13} />
                      )}
                    </Motion.button>

                    {/* Quick add overlay (desktop hover) */}
                    {!outOfStock && !atMax && (
                      <div className="hidden sm:block absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-ink/90 text-cream text-xs font-semibold uppercase tracking-wider backdrop-blur hover:bg-orange-500 transition"
                        >
                          <FiShoppingBag size={13} />
                          Quick add
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="font-medium text-base-content text-[15px] leading-snug mb-1.5 line-clamp-2 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition"
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-orange-600 dark:text-orange-400 font-bold text-base">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <Motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAddToCart(product)}
                      disabled={outOfStock || atMax}
                      className={`w-full py-2.5 rounded-full text-sm font-semibold border transition
                        ${
                          outOfStock || atMax
                            ? "border-line dark:border-base-300 text-base-content/40 cursor-not-allowed"
                            : "border-ink dark:border-base-content text-ink dark:text-base-content hover:bg-ink hover:text-cream dark:hover:bg-base-content dark:hover:text-base-100"
                        }`}
                    >
                      {outOfStock
                        ? "Unavailable"
                        : atMax
                          ? "Max in cart"
                          : "Add to cart"}
                    </Motion.button>
                  </div>
                </Motion.div>
              );
            })}
          </div>
        )}

        {/* View more (mobile) */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm border border-ink dark:border-base-content text-ink dark:text-base-content hover:bg-ink hover:text-cream dark:hover:bg-base-content dark:hover:text-base-100 transition"
          >
            View all products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
