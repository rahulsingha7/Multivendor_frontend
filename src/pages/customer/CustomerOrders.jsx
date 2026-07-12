import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserFromToken } from "../../utils/auth";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FiPackage,
  FiStar,
  FiChevronDown,
  FiChevronUp,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const API = import.meta.env.VITE_API_BASE_URL;

// Timeline steps — ordered progression
const TIMELINE_STEPS = [
  { key: "paid", label: "Order Placed", icon: "🛒", desc: "Payment confirmed" },
  { key: "shipped", label: "Shipped", icon: "🚚", desc: "On the way to you" },
  { key: "delivered", label: "Delivered", icon: "✅", desc: "Order complete" },
];

const STATUS_ORDER = { paid: 0, shipped: 1, delivered: 2, cancelled: -1 };

const STATUS_BADGE = {
  paid: "bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-300",
  shipped: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300",
  delivered:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-500",
};

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar
        key={s}
        size={11}
        className={s <= rating ? "text-gold-400" : "text-base-content/15"}
      />
    ))}
  </div>
);

// ── Order Timeline Component ──
const OrderTimeline = ({ status }) => {
  const isCancelled = status === "cancelled";
  const currentStep = STATUS_ORDER[status] ?? 0;

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 px-5 py-4 bg-red-50 dark:bg-red-900/10 border-t border-line dark:border-base-300">
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm shrink-0">
          ✕
        </div>
        <div>
          <p className="text-base font-semibold text-red-600 dark:text-red-400">
            Order Cancelled
          </p>
          <p className="text-sm text-base-content/40">
            This order has been cancelled
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-5 border-t border-line dark:border-base-300 bg-base-200/50 dark:bg-base-200/30">
      <p className="text-xs uppercase tracking-widest font-semibold text-base-content/40 mb-4">
        Order Progress
      </p>
      <div className="flex items-start gap-0">
        {TIMELINE_STEPS.map((step, i) => {
          const isCompleted = currentStep >= i;
          const isActive = currentStep === i;
          const isLast = i === TIMELINE_STEPS.length - 1;

          return (
            <div key={step.key} className="flex items-start flex-1">
              {/* Step */}
              <div className="flex flex-col items-center">
                <Motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 transition-all duration-500
                    ${
                      isCompleted
                        ? "bg-orange-500 border-orange-500 shadow-md shadow-orange-200 dark:shadow-orange-900/40"
                        : "bg-base-100 border-line dark:border-base-300"
                    }`}
                >
                  {isCompleted ? (
                    <Motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.1, type: "spring" }}
                    >
                      {step.icon}
                    </Motion.span>
                  ) : (
                    <span className="text-base-content/30 text-sm">
                      {i + 1}
                    </span>
                  )}
                </Motion.div>

                {/* Label */}
                <div className="mt-2 text-center w-20">
                  <p
                    className={`text-xs font-semibold leading-tight ${isCompleted ? "text-orange-600 dark:text-orange-400" : "text-base-content/40"}`}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <Motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] text-base-content/40 mt-0.5 leading-tight"
                    >
                      {step.desc}
                    </Motion.p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mt-4 mx-1">
                  <div className="h-0.5 bg-line dark:bg-base-300 rounded-full overflow-hidden">
                    <Motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: currentStep > i ? "100%" : "0%" }}
                      transition={{
                        delay: i * 0.15 + 0.2,
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                      className="h-full bg-orange-500 rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Main Component ──
const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [reviewedProducts, setReviewedProducts] = useState({});
  const [expandedOrders, setExpandedOrders] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const user = getUserFromToken();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/api/customer/orders`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit: 5 },
        });
        setOrders(res.data.orders || []);
        setTotalPages(res.data.totalPages || 1);
        // Auto-expand first order
        if (res.data.orders?.length > 0) {
          setExpandedOrders({ [res.data.orders[0]._id]: true });
        }
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  useEffect(() => {
    const fetchReviews = async () => {
      const products = new Set();
      orders.forEach((o) =>
        o.products.forEach((p) => products.add(p.product._id)),
      );
      const status = {};
      await Promise.all(
        [...products].map(async (id) => {
          try {
            const res = await axios.get(`${API}/api/customer/reviews/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            status[id] = res.data || null;
          } catch {
            status[id] = null;
          }
        }),
      );
      setReviewedProducts(status);
    };
    if (orders.length > 0) fetchReviews();
  }, [orders]);

  const toggleOrder = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const formatOrderNumber = (id) => `#${id.slice(-6).toUpperCase()}`;

  // Get the worst/most-progressed status across all products in an order
  const getOverallStatus = (products) => {
    if (products.some((p) => p.status === "cancelled")) return "cancelled";
    const statuses = products.map((p) => STATUS_ORDER[p.status] ?? 0);
    const minStep = Math.min(...statuses);
    return (
      Object.keys(STATUS_ORDER).find((k) => STATUS_ORDER[k] === minStep) ||
      "paid"
    );
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-base-200">
      {/* Header */}
      <div className="bg-base-100 border-b border-line dark:border-base-300 px-4 sm:px-10 lg:px-16 py-6">
        <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-0.5">
          Account
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
          {user?.name ? `${user.name}'s Orders` : "My Orders"}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-10 lg:px-16 py-10">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="font-serif text-2xl font-semibold text-base-content mb-2">
              No orders yet
            </h3>
            <p className="text-base-content/40 text-base mb-8">
              Your orders will appear here once you make a purchase
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
                Start Shopping
              </Link>
            </Motion.div>
          </Motion.div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, i) => {
              const isExpanded = expandedOrders[order._id];
              const overallStatus = getOverallStatus(order.products);

              return (
                <Motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-base-100 rounded-2xl shadow-sm border border-line dark:border-base-300 overflow-hidden"
                >
                  {/* Order header — clickable to expand */}
                  <button
                    onClick={() => toggleOrder(order._id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-base-200 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                        <FiPackage
                          className="text-orange-600 dark:text-orange-400"
                          size={16}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-base-content text-base">
                          {formatOrderNumber(order._id)}
                        </p>
                        <p className="text-sm text-base-content/40">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                          {" · "}
                          {order.products.length} item
                          {order.products.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-xl font-semibold text-orange-600 dark:text-orange-400">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                      <div className="text-base-content/40">
                        {isExpanded ? (
                          <FiChevronUp size={16} />
                        ) : (
                          <FiChevronDown size={16} />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Timeline — always visible */}
                  <OrderTimeline status={overallStatus} />

                  {/* Expandable products */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <Motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="divide-y divide-line dark:divide-base-300 border-t border-line dark:border-base-300">
                          {order.products.map((p, idx) => {
                            const product = p.product;
                            const review = reviewedProducts[product?._id];
                            const imgUrl = product?.imageUrl?.startsWith("http")
                              ? product.imageUrl
                              : product?.imageUrl
                                ? `${API}/uploads/${product.imageUrl}`
                                : null;

                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-4 px-5 py-4"
                              >
                                <img
                                  src={
                                    imgUrl ||
                                    "https://via.placeholder.com/48?text=?"
                                  }
                                  alt={product?.name}
                                  className="w-12 h-12 object-cover rounded-xl shrink-0 bg-base-200"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-base text-base-content truncate">
                                    {product?.name || "Product deleted"}
                                  </p>
                                  <p className="text-sm text-base-content/40">
                                    {p.quantity} × ${p.price.toFixed(2)}
                                  </p>
                                  {review && <StarRow rating={review.rating} />}
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                  {/* Per-item status badge */}
                                  <span
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[p.status] || STATUS_BADGE.paid}`}
                                  >
                                    {p.status}
                                  </span>
                                  {product && (
                                    <Link
                                      to={`/customer/review/${product._id}`}
                                      className="flex items-center gap-1 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition"
                                    >
                                      <FiStar size={11} />
                                      {review ? "Edit" : "Review"}
                                    </Link>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </Motion.div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
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
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;
