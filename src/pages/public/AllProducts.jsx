import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiShoppingBag, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/useCart";
import useWishlist from "../../hooks/useWishList";
import toast from "react-hot-toast";

const categoryIcons = {
  electronics: "💻",
  fashion: "👗",
  beauty: "💄",
  food: "🍕",
  sports: "⚽",
  home: "🏠",
  books: "📚",
  toys: "🧸",
  default: "🛍️",
};

function getCategoryIcon(name = "") {
  const lower = name.toLowerCase();
  for (const key in categoryIcons) {
    if (lower.includes(key)) return categoryIcons[key];
  }
  return categoryIcons.default;
}

const SkeletonCard = () => (
  <div className="bg-base-100 border border-line dark:border-base-300 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-80 sm:h-96 bg-base-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-base-200 rounded w-1/3" />
      <div className="h-4 bg-base-200 rounded w-3/4" />
      <div className="h-4 bg-base-200 rounded w-1/2" />
      <div className="h-10 bg-base-200 rounded-full mt-2" />
    </div>
  </div>
);

const AllProducts = () => {
  const { cartItems, addItem, updateItemQuantity } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [groupedProducts, setGroupedProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSelectedCategory(params.get("category") || "");
    setSearch(params.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data || []));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          ...(selectedCategory && { category: selectedCategory }),
          search,
          page,
          limit: 8,
          sort,
        }).toString();

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/public/grouped?${query}`,
        );
        setGroupedProducts(res.data.groupedProducts || {});
        setTotalPages(res.data.totalPages || 1);
      } catch {
        toast.error("Error fetching products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, search, sort, page]);

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
      toast.success("Quantity updated");
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
      toast.success("Added to cart");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSort("newest");
    setPage(1);
    navigate("/products");
  };

  const hasActiveFilters = search || selectedCategory || sort !== "newest";
  const totalProducts = Object.values(groupedProducts).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  return (
    <div className="min-h-screen bg-cream dark:bg-base-200">
      {/* ── Page Header ── */}
      <div className="px-4 sm:px-10 lg:px-16 pt-12 sm:pt-16 pb-8 border-b border-line dark:border-base-300">
        <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-3">
          Browse
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink dark:text-base-content leading-tight">
          All Products
        </h1>
        {!loading && totalProducts > 0 && (
          <p className="text-base-content/50 text-base mt-3">
            Showing {totalProducts} product{totalProducts !== 1 ? "s" : ""}
            {selectedCategory ? ` in "${selectedCategory}"` : ""}
          </p>
        )}
      </div>

      <div className="px-4 sm:px-10 lg:px-16 py-10">
        {/* ── Filter Bar ── */}
        <div className="bg-base-100 border border-line dark:border-base-300 rounded-2xl shadow-sm p-4 sm:p-5 mb-10">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="flex-1 flex items-center gap-3 bg-base-200 rounded-full px-5 py-3 border border-transparent focus-within:border-orange-400 transition">
              <FaSearch className="text-base-content/30 shrink-0 text-sm" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                >
                  <FaTimes className="text-base-content/30 hover:text-base-content/60 text-xs" />
                </button>
              )}
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCategory(val);
                setPage(1);
                navigate(val ? `?category=${val}` : "/products");
              }}
              className="bg-base-200 border border-transparent focus:border-orange-400 rounded-full px-5 py-3 text-base text-base-content outline-none transition cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {getCategoryIcon(cat.name)}{" "}
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-base-200 border border-transparent focus:border-orange-400 rounded-full px-5 py-3 text-base text-base-content outline-none transition cursor-pointer"
            >
              <option value="newest">🕒 Newest</option>
              <option value="price_asc">💰 Price: Low to High</option>
              <option value="price_desc">💎 Price: High to Low</option>
            </select>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-base font-semibold hover:bg-orange-100 dark:hover:bg-orange-900/40 transition shrink-0"
              >
                <FaTimes className="text-xs" /> Clear
              </button>
            )}
          </div>

          {/* Category pill row */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-line dark:border-base-300">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setPage(1);
                  navigate("/products");
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                  !selectedCategory
                    ? "bg-orange-500 text-white"
                    : "bg-base-200 text-base-content/60 hover:bg-base-300"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setPage(1);
                    navigate(`?category=${cat.name}`);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    selectedCategory === cat.name
                      ? "bg-orange-500 text-white"
                      : "bg-base-200 text-base-content/60 hover:bg-base-300"
                  }`}
                >
                  {getCategoryIcon(cat.name)} {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Products ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : Object.keys(groupedProducts).length === 0 ? (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-serif text-2xl font-semibold text-base-content mb-2">
              No products found
            </h3>
            <p className="text-base-content/50 text-base mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-7 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition"
            >
              Clear Filters
            </button>
          </Motion.div>
        ) : (
          Object.entries(groupedProducts).map(
            ([category, products], groupIdx) => (
              <div key={category} className="mb-14">
                {/* Category heading */}
                <Motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: groupIdx * 0.05 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <span className="text-2xl">{getCategoryIcon(category)}</span>
                  <h2 className="font-serif text-2xl font-semibold text-ink dark:text-base-content">
                    {category.charAt(0).toUpperCase() +
                      category.slice(1).toLowerCase()}
                  </h2>
                  <span className="text-xs font-semibold text-base-content/40 bg-base-200 px-2.5 py-1 rounded-full">
                    {products.length}
                  </span>
                  <div className="flex-1 h-px bg-line dark:bg-base-300" />
                </Motion.div>

                {/* Product grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
                  <AnimatePresence>
                    {products.map((product, i) => {
                      const cartItem = cartItems.find(
                        (it) => it.productId === product._id,
                      );
                      const atMax = cartItem?.quantity >= product.stock;
                      const outOfStock = product.stock === 0;

                      return (
                        <Motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          whileHover={{ y: -6 }}
                          onClick={() => navigate(`/products/${product._id}`)}
                          className="group bg-base-100 border border-line dark:border-base-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        >
                          {/* Image */}
                          <div className="relative h-80 sm:h-96 overflow-hidden bg-base-200">
                            <Motion.img
                              src={
                                product.images?.[0]?.url ||
                                product.imageUrl ||
                                "/placeholder.jpg"
                              }
                              alt={product.name}
                              whileHover={{ scale: 1.06 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="w-full h-full object-cover"
                            />

                            {outOfStock ? (
                              <span className="absolute top-3 left-3 bg-ink text-cream text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                                Sold out
                              </span>
                            ) : product.stock <= 5 ? (
                              <span className="absolute top-3 left-3 bg-gold-400 text-ink text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                                Only {product.stock} left
                              </span>
                            ) : null}

                            {cartItem && (
                              <span className="absolute top-3 left-3 bg-teal-600 text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                                {cartItem.quantity} in cart
                              </span>
                            )}

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
                                <FaHeart
                                  size={13}
                                  className="text-orange-500"
                                />
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
                            <p className="text-xs uppercase tracking-widest text-base-content/40 mb-1.5">
                              {product.category?.name || "General"}
                            </p>
                            <h3 className="font-medium text-base-content text-[15px] leading-snug mb-2 line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-orange-600 dark:text-orange-400 font-bold text-lg mb-3">
                              ${product.price.toFixed(2)}
                            </p>

                            <Motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
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
                  </AnimatePresence>
                </div>
              </div>
            ),
          )
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && !loading && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center gap-2 mt-6"
          >
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-base-100 border border-line dark:border-base-300 text-sm font-semibold disabled:opacity-40 hover:border-orange-400 transition"
            >
              <FiArrowLeft size={14} /> Prev
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-full text-sm font-semibold transition ${
                    page === i + 1
                      ? "bg-orange-500 text-white"
                      : "bg-base-100 border border-line dark:border-base-300 hover:border-orange-400 text-base-content/70"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-base-100 border border-line dark:border-base-300 text-sm font-semibold disabled:opacity-40 hover:border-orange-400 transition"
            >
              Next <FiArrowRight size={14} />
            </button>
          </Motion.div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
