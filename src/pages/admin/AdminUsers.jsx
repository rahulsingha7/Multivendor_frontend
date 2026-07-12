import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import {
  FiSearch,
  FiTrash2,
  FiX,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

const ROLE_STYLES = {
  customer: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300",
  vendor:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  admin: "bg-ink/10 dark:bg-base-300 text-ink dark:text-base-content",
};

const AVATAR_COLORS = [
  "bg-teal-600",
  "bg-orange-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-orange-400",
  "bg-gold-500",
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { search, page },
        },
      );
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-600 dark:text-orange-400 mb-1">
          Admin
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
          User Management
        </h1>
      </div>

      {/* Search */}
      <div className="bg-base-100 rounded-2xl p-4 shadow-sm border border-line dark:border-base-300">
        <div className="flex items-center gap-3 bg-base-200 rounded-full px-4 py-3 border border-transparent focus-within:border-orange-400 transition max-w-md">
          <FiSearch className="text-base-content/40 shrink-0 text-sm" />
          <input
            type="text"
            placeholder="Search by name or email..."
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
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse"
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">👥</div>
          <p className="text-base-content/40 text-base">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u, i) => (
            <Motion.div
              key={u._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-base-100 rounded-2xl p-4 shadow-sm border border-line dark:border-base-300 flex items-center justify-between gap-4 flex-wrap"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                >
                  {u.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-base-content text-base">
                    {u.name}
                  </p>
                  <p className="text-xs text-base-content/40 text-base">
                    {u.email}
                  </p>
                  <p className="text-sm text-base-content/30">
                    Joined{" "}
                    {new Date(u.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ROLE_STYLES[u.role] || "bg-base-200 text-base-content/60"}`}
                >
                  {u.role}
                </span>
                {u.role !== "admin" && (
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-500 text-sm font-semibold rounded-full transition"
                  >
                    <FiTrash2 size={12} /> Delete
                  </button>
                )}
              </div>
            </Motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-2 pt-2">
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
  );
};

export default AdminUsers;
