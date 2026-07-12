import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiTrash2,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

const AdminManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { search, page },
        },
      );
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/products/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Product approved");
      fetchProducts();
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/products/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Product rejected");
      fetchProducts();
    } catch {
      toast.error("Failed to reject");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-600 dark:text-orange-400 mb-1">
          Admin
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
          Product Moderation
        </h1>
      </div>

      {/* Search */}
      <div className="bg-base-100 rounded-2xl p-4 shadow-sm border border-line dark:border-base-300">
        <div className="flex items-center gap-3 bg-base-200 rounded-full px-4 py-3 border border-transparent focus-within:border-orange-400 transition max-w-md">
          <FiSearch className="text-base-content/40 shrink-0 text-sm" />
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
              <FiX className="text-base-content/30 text-xs" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-base-content/40 text-base">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <Motion.div
                key={p._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-base-100 rounded-2xl overflow-hidden shadow-sm border border-line dark:border-base-300"
              >
                <div className="relative h-56 overflow-hidden bg-base-200">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-2 right-2 text-[11px] font-semibold px-2.5 py-1 rounded-full ${p.isApproved ? "bg-emerald-500 text-white" : "bg-gold-400 text-ink"}`}
                  >
                    {p.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-widest text-base-content/40 text-base mb-1">
                    {p.category?.name || "General"}
                  </p>
                  <h3 className="font-semibold text-base-content text-base mb-1 truncate">
                    {p.name}
                  </h3>
                  <p className="text-xs text-base-content/40 text-base mb-1">
                    Vendor:{" "}
                    <span className="font-semibold text-base-content">
                      {p.vendor?.name || "N/A"}
                    </span>
                  </p>
                  <p className="text-orange-600 dark:text-orange-400 font-bold text-base mb-3">
                    ${p.price.toFixed(2)}
                  </p>
                  <div className="flex gap-2">
                    {!p.isApproved ? (
                      <button
                        onClick={() => handleApprove(p._id)}
                        className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-full flex items-center justify-center gap-1 transition"
                      >
                        <FiCheck size={12} /> Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReject(p._id)}
                        className="flex-1 py-2 bg-gold-50 dark:bg-gold-900/20 hover:bg-gold-100 dark:hover:bg-gold-900/30 text-gold-600 dark:text-gold-400 text-sm font-semibold rounded-full flex items-center justify-center gap-1 transition"
                      >
                        <FiX size={12} /> Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-500 text-sm font-semibold rounded-full flex items-center justify-center gap-1 transition"
                    >
                      <FiTrash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>

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
        </>
      )}
    </div>
  );
};

export default AdminManageProducts;
