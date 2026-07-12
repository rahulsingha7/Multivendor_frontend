import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiArrowUpRight,
  FiStar,
  FiBarChart2,
  FiEye,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiSearch,
} from "react-icons/fi";
import { getUserFromToken } from "../../utils/auth";

const API = import.meta.env.VITE_API_BASE_URL;

const STATUS_BADGE = {
  paid: "bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-300",
  shipped: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300",
  delivered:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-500",
};

const TrendBadge = ({ current, previous }) => {
  if (previous === undefined || previous === null) return null;
  if (previous === 0 && current === 0) return null;
  if (previous === 0 && current > 0)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-0.5 rounded-full">
        ✨ New
      </span>
    );
  const pct = Math.round(((current - previous) / previous) * 100);
  const isUp = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${isUp ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" : "text-red-500 bg-red-50 dark:bg-red-900/20"}`}
    >
      {isUp ? "↑" : "↓"} {Math.abs(pct)}%
    </span>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  delay,
  to,
  trendCurrent,
  trendPrevious,
}) => {
  const navigate = useNavigate();
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={to ? { y: -4, scale: 1.01 } : {}}
      onClick={to ? () => navigate(to) : undefined}
      className={`bg-base-100 rounded-2xl p-6 shadow-sm border border-line dark:border-base-300 transition-all ${to ? "cursor-pointer hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-800" : ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-widest font-semibold text-base-content/40">
          {label}
        </p>
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color}`}
        >
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="font-serif text-3xl font-semibold text-ink dark:text-base-content mb-2">
        {value}
      </p>
      <div className="flex items-center justify-between">
        <TrendBadge current={trendCurrent} previous={trendPrevious} />
        {to && (
          <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1 ml-auto">
            View all <FiArrowUpRight size={13} />
          </p>
        )}
      </div>
    </Motion.div>
  );
};

// ── Marketplace Explorer Tab ──────────────────────────────────────────────
const MarketplaceExplorer = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("best_selling");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchMarketplace = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/customer/products/marketplace`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { category, sort, page, limit: 12 },
      });
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalCount || 0);
      setCategories(res.data.categories || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, sort, page]);

  useEffect(() => {
    fetchMarketplace();
  }, [fetchMarketplace]);

  const filtered = search
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      )
    : products;

  const SORTS = [
    { value: "best_selling", label: "🏆 Best Selling" },
    { value: "most_viewed", label: "👀 Most Viewed" },
    { value: "highest_revenue", label: "💰 Highest Revenue" },
    { value: "newest", label: "🕒 Newest" },
    { value: "price_asc", label: "💵 Price: Low to High" },
    { value: "price_desc", label: "💎 Price: High to Low" },
  ];

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="bg-base-100 rounded-2xl p-4 shadow-sm border border-line dark:border-base-300">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 flex items-center gap-3 bg-base-200 rounded-full px-4 py-3 border border-transparent focus-within:border-orange-400 transition">
            <FiSearch className="text-base-content/40 shrink-0" size={15} />
            <input
              type="text"
              placeholder="Search marketplace..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
            />
          </div>
          {/* Category */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="bg-base-200 border border-transparent focus:border-orange-400 rounded-full px-4 py-3 text-base text-base-content outline-none transition cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
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
            className="bg-base-200 border border-transparent focus:border-orange-400 rounded-full px-4 py-3 text-base text-base-content outline-none transition cursor-pointer"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {totalCount > 0 && (
          <p className="text-sm text-base-content/40 mt-3">
            {totalCount} products{category ? ` in "${category}"` : ""} · sorted
            by{" "}
            {SORTS.find((s) => s.value === sort)
              ?.label.split(" ")
              .slice(1)
              .join(" ")}
          </p>
        )}
      </div>

      {/* Products table */}
      <div className="bg-base-100 rounded-2xl shadow-sm border border-line dark:border-base-300 overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-base-200/50 border-b border-line dark:border-base-300">
          <div className="col-span-5 text-xs uppercase tracking-widest font-semibold text-base-content/40">
            Product
          </div>
          <div className="col-span-2 text-xs uppercase tracking-widest font-semibold text-base-content/40 text-right">
            Price
          </div>
          <div className="col-span-2 text-xs uppercase tracking-widest font-semibold text-base-content/40 text-right">
            Units Sold
          </div>
          <div className="col-span-2 text-xs uppercase tracking-widest font-semibold text-base-content/40 text-right">
            Revenue
          </div>
          <div className="col-span-1 text-xs uppercase tracking-widest font-semibold text-base-content/40 text-right">
            Views
          </div>
        </div>

        {loading ? (
          <div className="divide-y divide-line dark:divide-base-300">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="w-12 h-12 rounded-xl bg-base-200 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-base-200 animate-pulse rounded w-1/2" />
                  <div className="h-3 bg-base-200 animate-pulse rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-serif text-xl font-semibold text-base-content mb-1">
              No products found
            </p>
            <p className="text-base-content/40 text-base">
              Try a different category or sort
            </p>
          </div>
        ) : (
          <div className="divide-y divide-line dark:divide-base-300">
            {filtered.map((p, i) => (
              <Motion.div
                key={p._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-base-200/30 transition"
              >
                {/* Product info */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={p.imageUrl || "/placeholder.jpg"}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover bg-base-200"
                    />
                    {i === 0 && sort === "best_selling" && (
                      <span className="absolute -top-1.5 -right-1.5 text-sm">
                        🏆
                      </span>
                    )}
                    {i === 0 && sort === "most_viewed" && (
                      <span className="absolute -top-1.5 -right-1.5 text-sm">
                        🔥
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-base-content text-base truncate">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <span className="text-sm text-base-content/40">
                        {p.category}
                      </span>
                      <span className="text-base-content/20">·</span>
                      <span className="text-sm text-base-content/40">
                        by {p.vendor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-right">
                  <p className="font-semibold text-base-content text-base">
                    ${p.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-base-content/40">{p.stock} left</p>
                </div>

                {/* Units sold */}
                <div className="col-span-2 text-right">
                  <p className="font-serif font-semibold text-teal-600 dark:text-teal-400 text-lg">
                    {p.unitsSold}
                  </p>
                  <p className="text-sm text-base-content/40">units</p>
                </div>

                {/* Revenue */}
                <div className="col-span-2 text-right">
                  <p className="font-serif font-semibold text-orange-600 dark:text-orange-400 text-lg">
                    ${p.revenue.toFixed(2)}
                  </p>
                  <p className="text-sm text-base-content/40">total</p>
                </div>

                {/* Views */}
                <div className="col-span-1 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <FiEye size={13} className="text-base-content/30" />
                    <p className="font-semibold text-base-content text-base">
                      {p.views || 0}
                    </p>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-base-100 border border-line dark:border-base-300 text-sm font-semibold disabled:opacity-40 hover:border-orange-400 transition"
          >
            <FiArrowLeft size={14} /> Prev
          </button>
          <div className="flex gap-1">
            {[...Array(Math.min(totalPages, 7))].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-full text-sm font-semibold transition ${page === i + 1 ? "bg-orange-500 text-white" : "bg-base-100 border border-line dark:border-base-300 hover:border-orange-400 text-base-content/70"}`}
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
        </div>
      )}
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────
const SellerDashboard = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/api/customer/products/dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const TABS = [
    { key: "overview", label: "📊 Overview" },
    { key: "marketplace", label: "🌐 Marketplace Explorer" },
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-base-200">
      {/* Header */}
      <div className="bg-base-100 border-b border-line dark:border-base-300 px-4 sm:px-10 lg:px-16 py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-0.5">
              My Store
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
              Seller Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/customer/my-products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-line dark:border-base-300 text-base font-semibold text-base-content/60 hover:border-orange-400 transition"
              >
                <FiPackage size={15} /> My Products
              </Link>
            </Motion.div>
            <Motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/customer/create-product"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold transition shadow-sm hover:shadow-lg"
              >
                <FiPlus size={15} /> List Product
              </Link>
            </Motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-full text-base font-semibold transition ${
                activeTab === tab.key
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-base-content/60 hover:text-base-content hover:bg-base-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-10 lg:px-16 py-10">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <Motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-36 rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse"
                    />
                  ))}
                </div>
              ) : !data ? (
                <div className="text-center py-24">
                  <div className="text-5xl mb-3">📦</div>
                  <p className="font-serif text-xl font-semibold text-base-content mb-2">
                    No data yet
                  </p>
                  <p className="text-base-content/40 text-base mb-6">
                    Start by listing your first product
                  </p>
                  <Link
                    to="/customer/create-product"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition"
                  >
                    <FiPlus size={15} /> List a Product
                  </Link>
                </div>
              ) : (
                <>
                  {/* Stat cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatCard
                      icon={FiPackage}
                      label="Total Products"
                      value={data.totalProducts}
                      color="bg-orange-500"
                      delay={0}
                      to="/customer/my-products"
                    />
                    <StatCard
                      icon={FiShoppingCart}
                      label="Total Orders"
                      value={data.totalOrders}
                      color="bg-teal-600"
                      delay={0.1}
                      trendCurrent={data.currentMonthOrders}
                      trendPrevious={data.lastMonthOrders}
                    />
                    <StatCard
                      icon={FiDollarSign}
                      label="Total Earnings"
                      value={`$${data.totalEarnings.toFixed(2)}`}
                      color="bg-emerald-500"
                      delay={0.2}
                      trendCurrent={data.currentMonthEarnings}
                      trendPrevious={data.lastMonthEarnings}
                    />
                  </div>

                  {/* Best seller banner */}
                  {data.productPerformance?.[0]?.unitsSold > 0 && (
                    <Motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-ink rounded-2xl p-6 flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center shrink-0">
                        <FiTrendingUp className="text-orange-400" size={22} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-[0.3em] font-semibold text-orange-400 mb-1">
                          Your Best Seller
                        </p>
                        <p className="text-cream font-serif text-xl font-semibold">
                          {data.productPerformance[0].name}
                        </p>
                        <p className="text-cream/50 text-sm mt-0.5">
                          {data.productPerformance[0].unitsSold} units sold · $
                          {data.productPerformance[0].revenue.toFixed(2)}{" "}
                          revenue
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-serif text-2xl font-semibold text-orange-400">
                          ${data.productPerformance[0].price.toFixed(2)}
                        </p>
                        <p className="text-cream/40 text-sm">per unit</p>
                      </div>
                    </Motion.div>
                  )}

                  {/* Product performance */}
                  <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-base-100 rounded-2xl shadow-sm border border-line dark:border-base-300 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-line dark:border-base-300">
                      <h2 className="font-serif font-semibold text-ink dark:text-base-content text-lg flex items-center gap-2">
                        <FiBarChart2
                          className="text-orange-600 dark:text-orange-400"
                          size={17}
                        />{" "}
                        My Product Performance
                      </h2>
                      <Link
                        to="/customer/my-products"
                        className="text-sm font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1 hover:text-orange-700 transition"
                      >
                        Manage <FiArrowUpRight size={13} />
                      </Link>
                    </div>
                    {data.productPerformance.length === 0 ? (
                      <div className="py-12 text-center">
                        <div className="text-3xl mb-2">📦</div>
                        <p className="text-base-content/40 text-base">
                          No products listed yet
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-base-200/50 border-b border-line dark:border-base-300">
                          <div className="col-span-5 text-xs uppercase tracking-widest font-semibold text-base-content/40">
                            Product
                          </div>
                          <div className="col-span-2 text-xs uppercase tracking-widest font-semibold text-base-content/40 text-right">
                            Price
                          </div>
                          <div className="col-span-2 text-xs uppercase tracking-widest font-semibold text-base-content/40 text-right">
                            Sold
                          </div>
                          <div className="col-span-2 text-xs uppercase tracking-widest font-semibold text-base-content/40 text-right">
                            Revenue
                          </div>
                          <div className="col-span-1 text-xs uppercase tracking-widest font-semibold text-base-content/40 text-right">
                            Views
                          </div>
                        </div>
                        <div className="divide-y divide-line dark:divide-base-300">
                          {data.productPerformance.map((p, i) => (
                            <div
                              key={p._id}
                              className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center px-6 py-4"
                            >
                              <div className="col-span-5 flex items-center gap-3">
                                <img
                                  src={p.imageUrl || "/placeholder.jpg"}
                                  alt={p.name}
                                  className="w-12 h-12 rounded-xl object-cover bg-base-200 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-base-content text-base truncate">
                                    {p.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    <span className="text-sm text-base-content/40">
                                      {p.category}
                                    </span>
                                    {!p.isApproved && (
                                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400">
                                        Pending
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-2 text-right">
                                <p className="font-semibold text-base-content">
                                  ${p.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="col-span-2 text-right">
                                <p className="font-serif font-semibold text-teal-600 dark:text-teal-400 text-lg">
                                  {p.unitsSold}
                                </p>
                              </div>
                              <div className="col-span-2 text-right">
                                <p className="font-serif font-semibold text-orange-600 dark:text-orange-400 text-lg">
                                  ${p.revenue.toFixed(2)}
                                </p>
                              </div>
                              <div className="col-span-1 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <FiEye
                                    size={13}
                                    className="text-base-content/30"
                                  />
                                  <p className="font-semibold text-base-content">
                                    {p.views || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </Motion.div>

                  {/* Pricing insight */}
                  {data.avgCategoryPrice > 0 && (
                    <div className="bg-base-100 rounded-2xl p-5 border border-line dark:border-base-300 flex items-center gap-3">
                      <FiStar className="text-gold-400 shrink-0" size={18} />
                      <p className="text-base text-base-content/60">
                        Your average listing price:{" "}
                        <span className="font-semibold text-base-content">
                          ${data.avgCategoryPrice.toFixed(2)}
                        </span>{" "}
                        — check the{" "}
                        <button
                          onClick={() => setActiveTab("marketplace")}
                          className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 transition"
                        >
                          Marketplace Explorer
                        </button>{" "}
                        to see how competitors are pricing.
                      </p>
                    </div>
                  )}

                  {/* Recent orders */}
                  {data.recentOrders?.length > 0 && (
                    <Motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-base-100 rounded-2xl shadow-sm border border-line dark:border-base-300 overflow-hidden"
                    >
                      <div className="px-6 py-4 border-b border-line dark:border-base-300">
                        <h2 className="font-serif font-semibold text-ink dark:text-base-content text-lg flex items-center gap-2">
                          <FiShoppingCart
                            className="text-orange-600 dark:text-orange-400"
                            size={17}
                          />{" "}
                          Recent Orders
                        </h2>
                      </div>
                      <div className="divide-y divide-line dark:divide-base-300">
                        {data.recentOrders.map((order) => (
                          <div
                            key={order._id}
                            className="flex items-center justify-between px-6 py-4 flex-wrap gap-3"
                          >
                            <div>
                              <p className="font-semibold text-base-content text-base">
                                #{order._id.toString().slice(-6).toUpperCase()}
                              </p>
                              <p className="text-sm text-base-content/40">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-1.5">
                                {order.products.map((p, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1.5"
                                  >
                                    <span className="text-sm text-base-content/60">
                                      {p.name} ×{p.quantity}
                                    </span>
                                    <span
                                      className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[p.status] || STATUS_BADGE.paid}`}
                                    >
                                      {p.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <p className="font-serif text-xl font-semibold text-orange-600 dark:text-orange-400">
                              ${order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Motion.div>
                  )}
                </>
              )}
            </Motion.div>
          )}

          {activeTab === "marketplace" && (
            <Motion.div
              key="marketplace"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-6">
                <p className="font-serif text-2xl font-semibold text-ink dark:text-base-content mb-1">
                  🌐 Marketplace Explorer
                </p>
                <p className="text-base-content/50 text-base">
                  Browse all approved products, see what's selling and how
                  competitors are pricing.
                </p>
              </div>
              <MarketplaceExplorer />
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SellerDashboard;
