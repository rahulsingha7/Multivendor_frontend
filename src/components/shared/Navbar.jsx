import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import axios from "axios";
import { getUserFromToken, getToken } from "../../utils/auth";
import { useCart } from "../../context/useCart";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingBag,
  FaSignOutAlt,
  FaTachometerAlt,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { FiSearch, FiUser, FiChevronDown } from "react-icons/fi";
import useWishlist from "../../hooks/useWishList";

const NAV_LINKS = [
  { label: "New Arrivals", to: "/products?sort=newest" },
  { label: "Best Sellers", to: "/products?sort=popular" },
  { label: "Sell With Us", to: "/register/vendor" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();
  const user = getUserFromToken();
  const { cartItems } = useCart();

  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const mobileRef = useRef(null);
  const categoryRef = useRef(null);

  const isAuthPage = [
    "/login",
    "/register/customer",
    "/register/vendor",
    "/verify/customer",
    "/verify/vendor",
    "/login/vendor",
    "/login/admin",
    "/forgot-password",
  ].includes(location.pathname);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data.slice(0, 8)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setCategoryMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setIsDark(savedTheme === "dark");
  }, []);

  const cartCount = cartItems.length;
  const { wishlist } = useWishlist();

  const goToCategory = (cat) => {
    navigate(
      `/products?category=${encodeURIComponent(cat.name.toUpperCase())}`,
    );
    setCategoryMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-ink text-cream text-center text-xs sm:text-sm tracking-[0.2em] uppercase py-2 px-4 font-medium">
        Free Shipping On Orders Over $75
        <span className="hidden sm:inline">
          {" "}
          &nbsp;&middot;&nbsp; New Vendors Added Weekly
        </span>
      </div>

      <Motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`transition-all duration-300 border-b border-line dark:border-base-300 ${
          scrolled
            ? "bg-base-100/90 backdrop-blur-md shadow-sm py-2"
            : "bg-base-100 py-3"
        }`}
      >
        <div className="px-4 sm:px-8 lg:px-16 flex items-center justify-between gap-3">
          {/* Left: Brand + Category + Nav Links */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Brand */}
            <HashLink
              smooth
              to="/#"
              scroll={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center shrink-0"
            >
              <span className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight">
                <span className="text-orange-500">Multi</span>
                <span className="text-ink dark:text-base-content">Vendor</span>
              </span>
            </HashLink>

            {!isAuthPage && (
              <>
                {/* Category Dropdown — desktop only */}
                <div className="hidden xl:block relative" ref={categoryRef}>
                  <Motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setCategoryMenuOpen((p) => !p)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-base font-semibold text-ink dark:text-base-content hover:bg-orange-50 dark:hover:bg-base-200 hover:text-orange-600 dark:hover:text-orange-400 transition"
                  >
                    Shop By Category
                    <FiChevronDown
                      size={15}
                      className={`transition-transform ${categoryMenuOpen ? "rotate-180" : ""}`}
                    />
                  </Motion.button>
                  <AnimatePresence>
                    {categoryMenuOpen && categories.length > 0 && (
                      <Motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 mt-2 w-52 bg-base-100 border border-line dark:border-base-300 rounded-xl shadow-xl overflow-hidden z-50"
                      >
                        {categories.map((cat) => (
                          <button
                            key={cat._id}
                            onClick={() => goToCategory(cat)}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-base-content/80 hover:bg-orange-50 dark:hover:bg-base-200 hover:text-orange-600 transition capitalize"
                          >
                            {cat.name}
                          </button>
                        ))}
                        <Link
                          to="/products"
                          onClick={() => setCategoryMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm font-semibold text-teal-600 dark:text-teal-300 border-t border-line dark:border-base-300 hover:bg-teal-50 dark:hover:bg-base-200 transition"
                        >
                          View All Products &rarr;
                        </Link>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Desktop Nav Links */}
                <div className="hidden xl:flex items-center gap-0.5">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="px-3 py-2 text-base font-semibold text-base-content/70 dark:text-base-content hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Center: Search */}
          {!isAuthPage && (
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-2"
            >
              <div className="flex items-center gap-2 w-full bg-base-200 dark:bg-base-200 rounded-full px-4 py-2.5 border border-transparent focus-within:border-orange-400 transition">
                <FiSearch className="text-base-content/40 shrink-0" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Products..."
                  className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
                />
              </div>
            </form>
          )}

          {/* Right: Icons + Auth + Theme */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Desktop Right */}
            <div className="hidden xl:flex items-center gap-1">
              {(!user || user.role === "customer") && !isAuthPage && (
                <>
                  {/* Wishlist */}
                  <Motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/wishlist")}
                    className="relative p-2.5 rounded-lg hover:bg-teal-50 dark:hover:bg-base-200 text-base-content/70 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
                    title="Wishlist"
                  >
                    {wishlist.length > 0 ? (
                      <FaHeart
                        size={18}
                        className="text-teal-600 dark:text-teal-300"
                      />
                    ) : (
                      <FaRegHeart size={18} />
                    )}
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    )}
                  </Motion.button>

                  {/* Cart */}
                  <Motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/cart")}
                    className="relative p-2.5 rounded-lg hover:bg-orange-50 dark:hover:bg-base-200 text-base-content/70 hover:text-orange-600 transition-colors"
                    title="Cart"
                  >
                    <FaShoppingBag size={18} />
                    <AnimatePresence>
                      {cartCount > 0 && (
                        <Motion.span
                          key="badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                        >
                          {cartCount}
                        </Motion.span>
                      )}
                    </AnimatePresence>
                  </Motion.button>

                  {user && (
                    <Motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/customer/orders")}
                      className="px-3 py-2 text-base font-semibold text-base-content/70 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      Orders
                    </Motion.button>
                  )}

                  {user?.role === "customer" && (
                    <>
                      <Motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate("/customer/seller-dashboard")}
                        className="px-3 py-2 text-base font-semibold text-base-content/70 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                      >
                        My Store
                      </Motion.button>
                      <Motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate("/customer/my-products")}
                        className="px-3 py-2 text-base font-semibold text-base-content/70 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                      >
                        My Products
                      </Motion.button>
                      <Motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate("/customer/create-product")}
                        className="px-3 py-2 text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-full transition"
                      >
                        + List Product
                      </Motion.button>
                    </>
                  )}
                </>
              )}

              {/* Auth Buttons */}
              {!token ? (
                !isAuthPage && (
                  <div className="flex items-center gap-2 ml-1">
                    <HashLink
                      to="/login"
                      className="px-4 py-2 text-base font-semibold text-base-content/70 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      Login
                    </HashLink>
                    <HashLink
                      to="/register/customer"
                      className="px-4 py-2 text-base font-semibold border border-ink dark:border-base-content text-ink dark:text-base-content hover:bg-ink hover:text-cream rounded-full transition-all"
                    >
                      Sign Up
                    </HashLink>
                    <HashLink
                      to="/register/vendor"
                      className="px-4 py-2 text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-all shadow-sm"
                    >
                      Sell With Us
                    </HashLink>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-1 ml-1">
                  {(user?.role === "vendor" || user?.role === "admin") && (
                    <HashLink
                      to={
                        user.role === "vendor"
                          ? "/vendor/dashboard"
                          : "/admin/dashboard"
                      }
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-base-200 text-base font-semibold text-base-content hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      <FaTachometerAlt size={13} /> Dashboard
                    </HashLink>
                  )}
                  {(!user?.role || user.role === "customer") && (
                    <Motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate("/customer/profile")}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-200 hover:bg-orange-50 transition cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.[0]?.toUpperCase() || <FiUser size={12} />}
                      </div>
                      <span className="text-base font-semibold text-base-content max-w-[100px] truncate">
                        {user?.name}
                      </span>
                    </Motion.button>
                  )}
                  <Motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition"
                    title="Logout"
                  >
                    <FaSignOutAlt size={16} />
                  </Motion.button>
                </div>
              )}

              {/* Theme Toggle */}
              <Motion.button
                whileHover={{ scale: 1.1, rotate: 20 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2.5 rounded-lg hover:bg-base-200 text-base-content/60 transition ml-1"
              >
                <AnimatePresence mode="wait">
                  <Motion.div
                    key={isDark ? "sun" : "moon"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? <FaSun size={17} /> : <FaMoon size={17} />}
                  </Motion.div>
                </AnimatePresence>
              </Motion.button>
            </div>

            {/* Mobile/Tablet Right */}
            <div
              className="flex xl:hidden items-center gap-1.5"
              ref={mobileRef}
            >
              {(!user || user.role === "customer") && !isAuthPage && (
                <Motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/cart")}
                  className="relative p-2 text-base-content/70"
                >
                  <FaShoppingBag size={20} />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <Motion.span
                        key="mobile-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                      >
                        {cartCount}
                      </Motion.span>
                    )}
                  </AnimatePresence>
                </Motion.button>
              )}

              {/* Theme Toggle Mobile */}
              <Motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-base-200 text-base-content/60 transition"
              >
                {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
              </Motion.button>

              {/* Hamburger */}
              <Motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-base-content/70 hover:bg-base-200 transition"
              >
                <AnimatePresence mode="wait">
                  <Motion.div
                    key={isMobileMenuOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isMobileMenuOpen ? (
                      <FaTimes size={20} />
                    ) : (
                      <FaBars size={20} />
                    )}
                  </Motion.div>
                </AnimatePresence>
              </Motion.button>
            </div>
          </div>
        </div>

        {/* Category Strip — desktop */}
        {!isAuthPage && categories.length > 0 && (
          <div className="hidden xl:block border-t border-line dark:border-base-300 mt-2">
            <div className="px-4 sm:px-8 lg:px-16 flex items-center gap-6 overflow-x-auto py-2">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => goToCategory(cat)}
                  className="whitespace-nowrap text-sm font-medium text-base-content/60 hover:text-orange-600 dark:hover:text-orange-400 transition capitalize"
                >
                  {cat.name}
                </button>
              ))}
              <Link
                to="/products?sale=true"
                className="whitespace-nowrap text-sm font-semibold text-teal-600 dark:text-teal-300 hover:text-orange-600 transition"
              >
                Sale
              </Link>
            </div>
          </div>
        )}
      </Motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="xl:hidden overflow-hidden bg-base-100 border-t border-b border-line dark:border-base-300 shadow-lg"
          >
            <div className="px-4 sm:px-8 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
              {/* Mobile Search */}
              {!isAuthPage && (
                <form onSubmit={handleSearch} className="mb-3">
                  <div className="flex items-center gap-2 bg-base-200 rounded-full px-4 py-3 border border-transparent focus-within:border-orange-400 transition">
                    <FiSearch
                      className="text-base-content/40 shrink-0"
                      size={16}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Products..."
                      className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
                    />
                  </div>
                </form>
              )}

              {/* Nav Links */}
              {!isAuthPage &&
                NAV_LINKS.map((link, i) => (
                  <Motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-base font-semibold text-base-content hover:bg-orange-50 dark:hover:bg-base-200 hover:text-orange-600 transition"
                    >
                      {link.label}
                    </Link>
                  </Motion.div>
                ))}

              {/* Categories */}
              {!isAuthPage && categories.length > 0 && (
                <>
                  <p className="px-4 pt-3 pb-2 text-xs uppercase tracking-[0.2em] text-base-content/40 font-semibold">
                    Categories
                  </p>
                  <div className="px-4 flex flex-wrap gap-2 pb-2">
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => {
                          goToCategory(cat);
                          setIsMobileMenuOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-full border border-line dark:border-base-300 text-sm font-medium text-base-content/70 hover:border-orange-400 hover:text-orange-600 transition capitalize"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Customer Links */}
              {user && (!user.role || user.role === "customer") && (
                <>
                  <div className="h-px bg-base-200 dark:bg-base-300 my-2" />
                  {[
                    { label: "Orders", path: "/customer/orders" },
                    { label: "Wishlist", path: "/wishlist" },
                    { label: "My Store", path: "/customer/seller-dashboard" },
                    { label: "My Products", path: "/customer/my-products" },
                  ].map((item, i) => (
                    <Motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                    >
                      <button
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-base-content hover:bg-orange-50 hover:text-orange-600 transition"
                      >
                        {item.label}
                        {item.label === "Wishlist" && wishlist.length > 0 && (
                          <span className="ml-2 inline-flex w-5 h-5 bg-teal-600 text-white text-[10px] font-bold rounded-full items-center justify-center">
                            {wishlist.length}
                          </span>
                        )}
                      </button>
                    </Motion.div>
                  ))}
                  <button
                    onClick={() => {
                      navigate("/customer/create-product");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-orange-600 hover:bg-orange-50 transition"
                  >
                    + List A Product
                  </button>
                </>
              )}

              <div className="h-px bg-base-200 dark:bg-base-300 my-2" />

              {/* Auth */}
              {!token ? (
                !isAuthPage && (
                  <div className="flex flex-col gap-2">
                    <HashLink
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-full text-base font-semibold text-center border border-line hover:border-orange-400 hover:text-orange-600 transition"
                    >
                      Login
                    </HashLink>
                    <HashLink
                      to="/register/customer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-full text-base font-semibold text-center border border-ink dark:border-base-content text-ink hover:bg-ink hover:text-cream transition"
                    >
                      Customer Sign Up
                    </HashLink>
                    <HashLink
                      to="/register/vendor"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-full text-base font-semibold text-center bg-orange-500 hover:bg-orange-600 text-white transition"
                    >
                      Sell With Us
                    </HashLink>
                  </div>
                )
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-base-200 dark:bg-base-200 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-base font-bold shrink-0">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-base font-bold text-base-content">
                        {user?.name}
                      </p>
                      <p className="text-xs text-base-content/40 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>

                  {(user?.role === "vendor" || user?.role === "admin") && (
                    <HashLink
                      to={
                        user.role === "vendor"
                          ? "/vendor/dashboard"
                          : "/admin/dashboard"
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-base-content hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      <FaTachometerAlt size={13} /> Dashboard
                    </HashLink>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-semibold bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
