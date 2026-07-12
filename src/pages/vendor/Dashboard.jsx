import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import {
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiArrowUpRight,
} from "react-icons/fi";
import { getUserFromToken } from "../../utils/auth";
import { Link, useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  paid: "bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-300",
  shipped: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300",
  delivered:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-500",
};

const TrendBadge = ({ current, previous }) => {
  if (previous === undefined || previous === null) return null;
  if (previous === 0 && current === 0) return null;

  const isNew = previous === 0 && current > 0;
  if (isNew) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-0.5 rounded-full">
        ✨ New this month
      </span>
    );
  }

  const pct = Math.round(((current - previous) / previous) * 100);
  const isUp = pct >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
        isUp
          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
          : "text-red-500 bg-red-50 dark:bg-red-900/20"
      }`}
    >
      {isUp ? "↑" : "↓"} {Math.abs(pct)}% vs last month
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
  const isClickable = !!to;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={isClickable ? { y: -4, scale: 1.01 } : {}}
      onClick={isClickable ? () => navigate(to) : undefined}
      className={`bg-base-100 rounded-2xl p-6 shadow-sm border border-line dark:border-base-300 transition-all
        ${isClickable ? "cursor-pointer hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-800" : ""}`}
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
        {isClickable && (
          <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1 ml-auto">
            View all <FiArrowUpRight size={13} />
          </p>
        )}
      </div>
    </Motion.div>
  );
};

const Dashboard = () => {
  const user = getUserFromToken();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalEarnings: 0,
    currentMonthEarnings: 0,
    lastMonthEarnings: 0,
    currentMonthOrders: 0,
    lastMonthOrders: 0,
    recentOrders: [],
    bestSellingProduct: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/vendor/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setStats(res.data);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-600 dark:text-orange-400 mb-1">
          Overview
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
          Welcome back, {user?.name?.split(" ")[0] || "Vendor"} 👋
        </h1>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            icon={FiPackage}
            label="Total Products"
            value={stats.totalProducts}
            color="bg-orange-500"
            delay={0}
            to="/vendor/manage-products"
          />
          <StatCard
            icon={FiShoppingCart}
            label="Total Orders"
            value={stats.totalOrders}
            color="bg-teal-600"
            delay={0.1}
            to="/vendor/orders"
            trendCurrent={stats.currentMonthOrders}
            trendPrevious={stats.lastMonthOrders}
          />
          <StatCard
            icon={FiDollarSign}
            label="Total Earnings"
            value={`$${stats.totalEarnings.toFixed(2)}`}
            color="bg-emerald-500"
            delay={0.2}
            to="/vendor/earnings"
            trendCurrent={stats.currentMonthEarnings}
            trendPrevious={stats.lastMonthEarnings}
          />
        </div>
      )}

      {/* Best selling */}
      {stats.bestSellingProduct && (
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-ink rounded-2xl p-6 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center shrink-0">
            <FiTrendingUp className="text-orange-400" size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] font-semibold text-orange-400 mb-1">
              Best Seller
            </p>
            <p className="text-cream font-serif text-xl font-semibold">
              {stats.bestSellingProduct.name}
            </p>
            <p className="text-cream/50 text-sm mt-0.5">
              {stats.bestSellingProduct.quantity} units sold
            </p>
          </div>
        </Motion.div>
      )}

      {/* Recent orders */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-base-100 rounded-2xl shadow-sm border border-line dark:border-base-300 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-line dark:border-base-300">
          <h2 className="font-serif font-semibold text-ink dark:text-base-content text-lg">
            Recent Orders
          </h2>
          <Link
            to="/vendor/orders"
            className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition flex items-center gap-1"
          >
            View all <FiArrowUpRight size={13} />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-base-content/40 text-base">No orders yet</p>
          </div>
        ) : (
          <div className="divide-y divide-line dark:divide-base-300">
            {stats.recentOrders.map((order, i) => (
              <Motion.div
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="text-base font-semibold text-base-content">
                    #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm text-base-content/40 mb-1">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <div className="space-y-0.5">
                    {order.products.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <p className="text-sm text-base-content/50">
                          {p.name} × {p.quantity}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${STATUS_STYLES[p.status] || STATUS_STYLES.paid}`}
                        >
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="font-serif text-xl font-semibold text-orange-600 dark:text-orange-400 shrink-0">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </Motion.div>
            ))}
          </div>
        )}
      </Motion.div>
    </div>
  );
};

export default Dashboard;
