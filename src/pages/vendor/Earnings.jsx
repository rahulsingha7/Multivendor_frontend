import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import { FiDollarSign, FiShoppingCart, FiTrendingUp } from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const chartOptions = (label) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "#9ca3af", font: { size: 13 } },
      position: "top",
    },
    tooltip: { mode: "index", intersect: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { callback: (v) => `$${v}`, color: "#9ca3af" },
      grid: { color: "rgba(156,163,175,0.1)" },
    },
    x: {
      ticks: { color: "#9ca3af" },
      grid: { color: "rgba(156,163,175,0.1)" },
    },
  },
});

const Earnings = () => {
  const [data, setData] = useState({ totalEarnings: 0, totalOrders: 0 });
  const [monthlyEarnings, setMonthlyEarnings] = useState({});
  const [productEarnings, setProductEarnings] = useState({});
  const [monthlyProductEarnings, setMonthlyProductEarnings] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const [summaryRes, detailsRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/vendor/earnings`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/vendor/earnings/details`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        ]);
        setData(summaryRes.data);
        setMonthlyEarnings(detailsRes.data.monthlyEarnings);
        setProductEarnings(detailsRes.data.productEarnings);
        setMonthlyProductEarnings(detailsRes.data.monthlyProductEarnings || {});
      } catch {
        toast.error("Failed to fetch earnings");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const allMonths = Object.keys(monthlyEarnings).sort();
  const filteredMonths =
    selectedMonth === "all"
      ? allMonths
      : allMonths.filter((m) => m === selectedMonth);
  const filteredData = filteredMonths.map((k) => monthlyEarnings[k]);
  const currentProductEarnings =
    selectedMonth === "all"
      ? productEarnings
      : monthlyProductEarnings[selectedMonth] || {};
  const productLabels = Object.keys(currentProductEarnings);
  const productData = productLabels.map((k) => currentProductEarnings[k]);

  const lineData = {
    labels: filteredMonths,
    datasets: [
      {
        label: "Monthly Earnings ($)",
        data: filteredData,
        borderColor: "#f97316",
        backgroundColor: "rgba(249,115,22,0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#f97316",
      },
    ],
  };
  const barData = {
    labels: productLabels,
    datasets: [
      {
        label: "Earnings by Product ($)",
        data: productData,
        backgroundColor: "rgba(249,115,22,0.7)",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-600 dark:text-orange-400 mb-1">
          Analytics
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
          My Earnings
        </h1>
      </div>

      {/* Summary cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              icon: FiDollarSign,
              label: "Total Earnings",
              value: `$${data.totalEarnings.toFixed(2)}`,
              color: "bg-emerald-500",
            },
            {
              icon: FiShoppingCart,
              label: "Total Orders",
              value: data.totalOrders,
              color: "bg-teal-600",
            },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <Motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-base-100 rounded-2xl p-6 shadow-sm border border-line dark:border-base-300 flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shrink-0`}
              >
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-semibold text-base-content/40 mb-1">
                  {label}
                </p>
                <p className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
                  {value}
                </p>
              </div>
            </Motion.div>
          ))}
        </div>
      )}

      {/* Month filter */}
      <div className="flex items-center gap-4">
        <p className="text-sm font-semibold text-base-content/60 shrink-0">
          Filter by month:
        </p>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-base-100 border border-line dark:border-base-300 rounded-full px-4 py-2.5 text-base font-semibold outline-none focus:border-orange-400 transition cursor-pointer text-base-content"
        >
          <option value="all">All (Last 12 Months)</option>
          {allMonths.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Line chart */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-base-100 rounded-2xl p-6 shadow-sm border border-line dark:border-base-300"
      >
        <div className="flex items-center gap-2 mb-6">
          <FiTrendingUp className="text-orange-600 dark:text-orange-400" />
          <h2 className="font-serif text-lg font-semibold text-ink dark:text-base-content">
            Earnings by Month
          </h2>
        </div>
        <div className="h-[300px]">
          {filteredMonths.length > 0 ? (
            <Line data={lineData} options={chartOptions("Monthly Earnings")} />
          ) : (
            <div className="h-full flex items-center justify-center text-base-content/40 text-base">
              No data available
            </div>
          )}
        </div>
      </Motion.div>

      {/* Bar chart */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-base-100 rounded-2xl p-6 shadow-sm border border-line dark:border-base-300"
      >
        <div className="flex items-center gap-2 mb-6">
          <FiDollarSign className="text-orange-600 dark:text-orange-400" />
          <h2 className="font-serif text-lg font-semibold text-ink dark:text-base-content">
            Earnings by Product
          </h2>
        </div>
        <div className="h-[300px]">
          {productLabels.length > 0 ? (
            <Bar data={barData} options={chartOptions("Product Earnings")} />
          ) : (
            <div className="h-full flex items-center justify-center text-base-content/40 text-base">
              No data available
            </div>
          )}
        </div>
      </Motion.div>
    </div>
  );
};

export default Earnings;
