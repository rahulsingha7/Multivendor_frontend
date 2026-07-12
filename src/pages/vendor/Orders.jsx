import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import {
  FiSearch,
  FiPackage,
  FiX,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

const STATUS_STYLES = {
  paid: {
    bg: "bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-300",
    dot: "bg-gold-400",
  },
  shipped: {
    bg: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300",
    dot: "bg-teal-500",
  },
  delivered: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  cancelled: {
    bg: "bg-red-100 dark:bg-red-900/30 text-red-500",
    dot: "bg-red-500",
  },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/vendor/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit: 5, search, sortBy },
        },
      );
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search, sortBy]);

  const handleStatusChange = async (orderId, productId, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/vendor/orders/update-status`,
        { orderId, productId, status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-600 dark:text-orange-400 mb-1">
          Vendor
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
          My Orders
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-base-100 rounded-2xl p-4 shadow-sm border border-line dark:border-base-300 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-base-200 rounded-full px-4 py-3 border border-transparent focus-within:border-orange-400 transition">
          <FiSearch className="text-base-content/40 shrink-0 text-sm" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
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
              <FiX className="text-base-content/30 text-xs" />
            </button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="bg-base-200 border border-transparent rounded-full px-4 py-3 text-base text-base-content outline-none focus:border-orange-400 transition cursor-pointer"
        >
          <option value="newest">🕒 Newest First</option>
          <option value="oldest">🕰 Oldest First</option>
          <option value="totalHigh">💎 Total: High → Low</option>
          <option value="totalLow">💰 Total: Low → High</option>
        </select>
      </div>

      {/* Orders */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse"
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
          <h3 className="font-serif text-xl font-semibold text-base-content mb-2">
            No orders found
          </h3>
          <p className="text-base-content/40 text-base">
            Orders will appear here when customers purchase your products
          </p>
        </Motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <Motion.div
              key={order._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-base-100 rounded-2xl shadow-sm border border-line dark:border-base-300 overflow-hidden"
            >
              {/* Order header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-line dark:border-base-300 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                    <FiPackage
                      className="text-orange-600 dark:text-orange-400"
                      size={16}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-base-content text-base">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm text-base-content/40">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span className="font-serif text-xl font-semibold text-orange-600 dark:text-orange-400">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Customer info */}
              <div className="px-5 py-3 bg-base-200/50 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { label: "Customer", value: order.customer?.name || "N/A" },
                  { label: "Email", value: order.customer?.email || "N/A" },
                  { label: "Phone", value: order.phone || "N/A" },
                  { label: "Address", value: order.address || "N/A" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-base-content/40 font-semibold uppercase tracking-wider mb-0.5">
                      {label}
                    </p>
                    <p className="text-base-content font-semibold truncate">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Products */}
              <div className="divide-y divide-line dark:divide-base-300">
                {order.products.map((item) => {
                  const style =
                    STATUS_STYLES[item.status] || STATUS_STYLES.paid;
                  return (
                    <div
                      key={item.product._id}
                      className="flex items-center justify-between px-5 py-3 gap-4 flex-wrap"
                    >
                      <div>
                        <p className="text-base font-semibold text-base-content">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-base-content/40">
                          {item.quantity} × ${item.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${style.bg}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                          />
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              item.product._id,
                              e.target.value,
                            )
                          }
                          className="bg-base-200 border border-line dark:border-base-300 rounded-full px-3 py-1.5 text-sm font-semibold outline-none focus:border-orange-400 transition cursor-pointer text-base-content"
                        >
                          <option value="paid" disabled>
                            paid
                          </option>
                          <option value="shipped">shipped</option>
                          <option value="delivered">delivered</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Motion.div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-5 py-2.5 rounded-full bg-base-100 border border-line dark:border-base-300 text-sm font-semibold disabled:opacity-40 hover:border-orange-400 transition flex items-center gap-2"
              >
                ← Prev
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
                className="px-5 py-2.5 rounded-full bg-base-100 border border-line dark:border-base-300 text-sm font-semibold disabled:opacity-40 hover:border-orange-400 transition flex items-center gap-2"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
