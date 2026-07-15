import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion as Motion } from "framer-motion";
import {
  FaStar,
  FaShoppingCart,
  FaQuoteLeft,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { FiArrowLeft, FiPackage, FiTag, FiUser } from "react-icons/fi";
import { useCart } from "../../context/useCart";
import useWishlist from "../../hooks/useWishList";
import useRecentlyViewed from "../../hooks/useRecentlyViewed";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_BASE_URL;

const StarRow = ({ rating, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar
        key={s}
        size={size}
        className={
          s <= Math.round(rating) ? "text-gold-400" : "text-base-content/15"
        }
      />
    ))}
  </div>
);

const AVATAR_COLORS = [
  "bg-orange-500",
  "bg-teal-600",
  "bg-gold-500",
  "bg-orange-400",
  "bg-teal-400",
  "bg-gold-400",
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addItem, updateItemQuantity } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [prodRes, revRes] = await Promise.all([
          axios.get(`${API}/api/products/public/${id}`),
          axios.get(`${API}/api/products/public/${id}/reviews`),
        ]);
        const p = prodRes.data.product;
        setProduct(p);
        setReviews(revRes.data.reviews || []);
        setAvgRating(revRes.data.avgRating || 0);
        setReviewTotal(revRes.data.total || 0);
        // Track recently viewed
        addToRecentlyViewed(p);
      } catch {
        toast.error("Product not found");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const cartItem = cartItems.find((i) => i.productId === id);
  const outOfStock = product?.stock === 0;
  const atMax = cartItem?.quantity >= product?.stock;
  const wishlisted = product ? isWishlisted(product._id) : false;
  const image =
    product?.images?.[0]?.url || product?.imageUrl || "/placeholder.jpg";

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    if (outOfStock) {
      toast.error("Out of stock");
      return;
    }
    if (cartItem) {
      const newQty = cartItem.quantity + qty;
      if (newQty > product.stock) {
        toast.error(`Only ${product.stock} available`);
        return;
      }
      updateItemQuantity(product._id, newQty);
      toast.success("Cart updated!");
    } else {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        stock: product.stock,
        image,
        vendorId: product.vendor?._id,
      });
      toast.success("Added to cart!");
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    if (!product) return;
    toggleWishlist(product);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-cream dark:bg-base-200 px-4 sm:px-10 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="aspect-square rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse" />
          <div className="space-y-4 pt-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-8 rounded-xl bg-base-100 border border-line dark:border-base-300 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );

  if (!product) return null;

  // Filter out current product from recently viewed
  const otherRecent = recentlyViewed.filter((p) => p._id !== id);

  return (
    <div className="min-h-screen bg-cream dark:bg-base-200">
      {/* Back bar */}
      <div className="bg-base-100 border-b border-line dark:border-base-300 px-4 sm:px-10 lg:px-16 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-base-200 transition text-base-content/60"
          >
            <FiArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 text-sm text-base-content/40 font-medium">
            <Link
              to="/"
              className="hover:text-orange-600 dark:hover:text-orange-400 transition"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              to="/products"
              className="hover:text-orange-600 dark:hover:text-orange-400 transition"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-base-content truncate max-w-[200px]">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-10 lg:px-16 py-10 sm:py-14 space-y-16">
        {/* Product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative max-w-2xl mx-auto w-full"
          >
            <div className="rounded-2xl overflow-hidden bg-base-100 shadow-sm border border-line dark:border-base-300 aspect-square">
              <Motion.img
                src={image}
                alt={product.name}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full object-cover"
              />
            </div>
            {outOfStock && (
              <div className="absolute inset-0 bg-ink/50 rounded-2xl flex items-center justify-center">
                <span className="bg-ink text-cream font-semibold px-6 py-2.5 rounded-full text-sm uppercase tracking-wider">
                  Sold out
                </span>
              </div>
            )}
            {!outOfStock && product.stock <= 5 && (
              <span className="absolute top-4 left-4 bg-gold-400 text-ink text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                Only {product.stock} left
              </span>
            )}
            {/* Wishlist button on image */}
            <Motion.button
              whileTap={{ scale: 1.3 }}
              onClick={handleWishlist}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream/90 flex items-center justify-center text-ink hover:text-orange-500 shadow-md transition"
            >
              {wishlisted ? (
                <FaHeart size={16} className="text-orange-500" />
              ) : (
                <FaRegHeart size={16} />
              )}
            </Motion.button>
          </Motion.div>

          {/* Info */}
          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full">
                <FiTag size={12} /> {product.category?.name || "General"}
              </span>
              {product.vendor?.name && (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-base-content/60 bg-base-200 px-3 py-1.5 rounded-full">
                  <FiUser size={12} /> {product.vendor.name}
                </span>
              )}
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-ink dark:text-base-content leading-tight mb-4">
              {product.name}
            </h1>

            {reviewTotal > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <StarRow rating={avgRating} size={16} />
                <span className="text-base font-semibold text-base-content">
                  {avgRating}
                </span>
                <span className="text-base text-base-content/40">
                  ({reviewTotal} review{reviewTotal !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            <p className="font-serif text-4xl sm:text-5xl font-semibold text-orange-600 dark:text-orange-400 mb-5">
              ${product.price.toFixed(2)}
            </p>

            {product.description && (
              <p className="text-base-content/60 text-base leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-2 mb-6">
              <FiPackage
                size={15}
                className={outOfStock ? "text-red-500" : "text-emerald-600"}
              />
              <span
                className={`text-base font-semibold ${
                  outOfStock
                    ? "text-red-500"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {outOfStock ? "Out of stock" : `${product.stock} in stock`}
              </span>
            </div>

            {!outOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
                  Quantity
                </p>
                <div className="flex items-center gap-3 bg-base-200 rounded-full px-4 py-2">
                  <button
                    onClick={() => setQty((q) => Math.max(q - 1, 1))}
                    className="w-7 h-7 rounded-full bg-base-100 flex items-center justify-center text-base-content font-bold hover:text-orange-500 transition text-sm"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-semibold text-base-content">
                    {qty}
                  </span>
                  <button
                    onClick={() =>
                      setQty((q) => Math.min(q + 1, product.stock))
                    }
                    className="w-7 h-7 rounded-full bg-base-100 flex items-center justify-center text-base-content font-bold hover:text-orange-500 transition text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-base-content/40">
                  Max: {product.stock}
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 mb-4">
              <Motion.button
                whileHover={!outOfStock && !atMax ? { scale: 1.02, y: -2 } : {}}
                whileTap={!outOfStock && !atMax ? { scale: 0.98 } : {}}
                onClick={handleAddToCart}
                disabled={outOfStock || atMax}
                className={`flex-1 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-3 transition-all shadow-sm
                  ${
                    outOfStock || atMax
                      ? "bg-base-200 text-base-content/40 cursor-not-allowed"
                      : addedToCart
                        ? "bg-emerald-600 text-white"
                        : "bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg"
                  }`}
              >
                <FaShoppingCart size={16} />
                {outOfStock
                  ? "Out of Stock"
                  : atMax
                    ? "Max in cart"
                    : addedToCart
                      ? "Added ✓"
                      : "Add to Cart"}
              </Motion.button>

              {/* Wishlist button beside cart */}
              <Motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWishlist}
                className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all
                  ${
                    wishlisted
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-line dark:border-base-300 text-base-content/40 hover:border-orange-400 hover:text-orange-500"
                  }`}
              >
                {wishlisted ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
              </Motion.button>
            </div>

            {cartItem && (
              <Motion.div
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => navigate("/cart")}
                  className="w-full py-3.5 rounded-full border border-ink dark:border-base-content text-ink dark:text-base-content font-semibold hover:bg-ink hover:text-cream dark:hover:bg-base-content dark:hover:text-base-100 transition text-base"
                >
                  View Cart ({cartItem.quantity} in cart)
                </button>
              </Motion.div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: "🔒", text: "Secure Payment" },
                { icon: "🚚", text: "Fast Delivery" },
                { icon: "↩️", text: "Easy Returns" },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center gap-1.5 p-4 bg-base-100 border border-line dark:border-base-300 rounded-2xl text-center"
                >
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm font-semibold text-base-content/60">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </Motion.div>
        </div>

        {/* Recently Viewed */}
        {otherRecent.length > 0 && (
          <div>
            <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-2">
              Your History
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink dark:text-base-content mb-6">
              Recently Viewed
            </h2>
            <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar">
              {otherRecent.map((p, i) => {
                const rImage =
                  p.images?.[0]?.url || p.imageUrl || "/placeholder.jpg";
                return (
                  <Motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -6 }}
                    onClick={() => navigate(`/products/${p._id}`)}
                    className="shrink-0 w-60 bg-base-100 rounded-2xl overflow-hidden shadow-sm border border-line dark:border-base-300 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="h-52 overflow-hidden bg-base-200">
                      <Motion.img
                        src={rImage}
                        alt={p.name}
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3.5">
                      <p className="text-sm font-medium text-base-content line-clamp-2 mb-1.5">
                        {p.name}
                      </p>
                      <p className="text-orange-600 dark:text-orange-400 font-bold text-base">
                        ${p.price.toFixed(2)}
                      </p>
                    </div>
                  </Motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-2">
                Social Proof
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
                Customer Reviews{" "}
                {reviewTotal > 0 && (
                  <span className="text-base font-semibold text-base-content/40 ml-2">
                    ({reviewTotal})
                  </span>
                )}
              </h2>
            </div>
            {reviewTotal > 0 && (
              <div className="text-right">
                <p className="font-serif text-4xl sm:text-5xl font-semibold text-ink dark:text-base-content">
                  {avgRating}
                </p>
                <StarRow rating={avgRating} size={14} />
                <p className="text-sm text-base-content/40 mt-1">out of 5</p>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="bg-base-100 rounded-2xl p-12 text-center border border-line dark:border-base-300 shadow-sm">
              <div className="text-5xl mb-3">⭐</div>
              <p className="font-serif text-xl font-semibold text-base-content mb-1">
                No reviews yet
              </p>
              <p className="text-base text-base-content/40">
                Be the first to review after purchasing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {reviews.map((review, i) => (
                <Motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="bg-base-100 rounded-2xl p-6 shadow-sm border border-line dark:border-base-300 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300"
                >
                  <FaQuoteLeft className="text-orange-200 dark:text-orange-900/50 text-3xl" />
                  <p className="text-base-content text-base leading-relaxed flex-grow">
                    "{review.comment}"
                  </p>
                  <StarRow rating={review.rating} size={13} />
                  <div className="flex items-center gap-3 pt-3 border-t border-line dark:border-base-300">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                    >
                      {(review.user?.name || "A")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-base-content">
                        {review.user?.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-base-content/40">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>
                </Motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
