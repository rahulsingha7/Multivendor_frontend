import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiUserCheck,
  FiUser,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Line as LineChart,
  Pie as PieChart,
  Bar as BarChart,
} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  ChartDataLabels,
);

const STAT_CARDS = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: FiUsers,
    color: "bg-teal-600",
  },
  {
    key: "totalCustomers",
    label: "Customers",
    icon: FiUser,
    color: "bg-orange-500",
  },
  {
    key: "totalVendors",
    label: "Vendors",
    icon: FiUserCheck,
    color: "bg-orange-500",
  },
  {
    key: "totalProducts",
    label: "Products",
    icon: FiPackage,
    color: "bg-emerald-500",
  },
  {
    key: "totalOrders",
    label: "Orders",
    icon: FiShoppingCart,
    color: "bg-teal-500",
  },
  {
    key: "totalRevenue",
    label: "Revenue",
    icon: FiDollarSign,
    color: "bg-emerald-600",
    prefix: "$",
  },
];

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [vendorRevenue, setVendorRevenue] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const h = { Authorization: `Bearer ${token}` };
        const [s, o, r, c] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard/stats`,
            { headers: h },
          ),
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard/monthly-orders`,
            { headers: h },
          ),
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard/vendor-revenue`,
            { headers: h },
          ),
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard/category-products`,
            { headers: h },
          ),
        ]);
        setStats(s.data);
        setMonthlyOrders(o.data);
        setVendorRevenue(r.data);
        setCategoryProducts(c.data);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const lineData = {
    labels: monthlyOrders.map((i) => `Month ${i.month}`),
    datasets: [
      {
        label: "Orders",
        data: monthlyOrders.map((i) => i.orders),
        borderColor: "#f97316",
        backgroundColor: "rgba(249,115,22,0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#f97316",
      },
    ],
  };

  const pieData = {
    labels: categoryProducts.map((c) => c.name),
    datasets: [
      {
        data: categoryProducts.map((c) => c.count),
        backgroundColor: [
          "#f97316",
          "#60a5fa",
          "#4ade80",
          "#facc15",
          "#a78bfa",
          "#f87171",
        ],
      },
    ],
  };

  const barData = {
    labels: vendorRevenue.map((v) => v.name),
    datasets: [
      {
        label: "Revenue ($)",
        data: vendorRevenue.map((v) => v.revenue),
        backgroundColor: "rgba(249,115,22,0.7)",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const baseChartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#9ca3af" } },
      datalabels: { display: false },
    },
    scales: {
      y: {
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(156,163,175,0.1)" },
      },
      x: {
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(156,163,175,0.1)" },
      },
    },
  };

  const pieOpts = {
    plugins: {
      datalabels: {
        formatter: (v, ctx) => {
          const t = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          return `${((v / t) * 100).toFixed(1)}%`;
        },
        color: "#fff",
        font: { weight: "bold", size: 13 },
      },
      legend: { position: "bottom", labels: { color: "#9ca3af" } },
    },
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-600 dark:text-orange-400 mb-1">
          Admin
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
          Dashboard
        </h1>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STAT_CARDS.map(({ key, label, icon: Icon, color, prefix }, i) => (
            <Motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-base-100 rounded-2xl p-4 shadow-sm border border-line dark:border-base-300 text-center"
            >
              <div
                className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center mx-auto mb-3`}
              >
                <Icon size={16} className="text-white" />
              </div>
              <p className="text-xs uppercase tracking-widest font-semibold text-base-content/40 mb-1">
                {label}
              </p>
              <p className="font-serif text-2xl font-semibold text-ink dark:text-base-content">
                {prefix || ""}
                {key === "totalRevenue"
                  ? stats[key]?.toFixed(2) || "0.00"
                  : stats[key] || 0}
              </p>
            </Motion.div>
          ))}
        </div>
      )}

      {/* Line chart */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-base-100 rounded-2xl p-6 shadow-sm border border-line dark:border-base-300"
      >
        <h2 className="font-serif text-lg font-semibold text-ink dark:text-base-content mb-5">
          Monthly Orders
        </h2>
        <div className="h-[280px]">
          {monthlyOrders.length > 0 ? (
            <LineChart data={lineData} options={baseChartOpts} />
          ) : (
            <div className="h-full flex items-center justify-center text-base-content/40 text-base">
              No data
            </div>
          )}
        </div>
      </Motion.div>

      {/* Bar + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-base-100 rounded-2xl p-6 shadow-sm border border-line dark:border-base-300"
        >
          <h2 className="font-serif text-lg font-semibold text-ink dark:text-base-content mb-5">
            Top Vendor Revenue
          </h2>
          <div className="h-[260px]">
            {vendorRevenue.length > 0 ? (
              <BarChart data={barData} options={baseChartOpts} />
            ) : (
              <div className="h-full flex items-center justify-center text-base-content/40 text-base">
                No data
              </div>
            )}
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-base-100 rounded-2xl p-6 shadow-sm border border-line dark:border-base-300"
        >
          <h2 className="font-serif text-lg font-semibold text-ink dark:text-base-content mb-5">
            Products by Category
          </h2>
          <div className="h-[260px]">
            {categoryProducts.length > 0 ? (
              <PieChart data={pieData} options={pieOpts} />
            ) : (
              <div className="h-full flex items-center justify-center text-base-content/40 text-base">
                No data
              </div>
            )}
          </div>
        </Motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
