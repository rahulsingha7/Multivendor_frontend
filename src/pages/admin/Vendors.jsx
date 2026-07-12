import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import { FiSearch, FiCheck, FiTrash2, FiX } from "react-icons/fi";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/vendors`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setVendors(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/vendors/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Vendor approved");
      fetchVendors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vendor and all their products?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/vendors/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Vendor deleted");
      fetchVendors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()),
  );

  const pending = filtered.filter((v) => !v.isVendorApproved);
  const approved = filtered.filter((v) => v.isVendorApproved);

  const VendorCard = ({ vendor, i }) => (
    <Motion.div
      key={vendor._id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="bg-base-100 rounded-2xl p-5 shadow-sm border border-line dark:border-base-300 flex items-center justify-between gap-4 flex-wrap"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-semibold text-sm shrink-0">
          {vendor.name[0].toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-base-content text-base">
            {vendor.name}
          </p>
          <p className="text-xs text-base-content/40 text-base">
            {vendor.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${vendor.isVendorApproved ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-300"}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${vendor.isVendorApproved ? "bg-emerald-500" : "bg-gold-400"}`}
          />
          {vendor.isVendorApproved ? "Approved" : "Pending"}
        </span>
        {!vendor.isVendorApproved && (
          <button
            onClick={() => handleApprove(vendor._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition"
          >
            <FiCheck size={12} /> Approve
          </button>
        )}
        <button
          onClick={() => handleDelete(vendor._id)}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-500 text-sm font-semibold rounded-full transition"
        >
          <FiTrash2 size={12} /> Delete
        </button>
      </div>
    </Motion.div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-600 dark:text-orange-400 mb-1">
          Admin
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
          Manage Vendors
        </h1>
      </div>

      {/* Search */}
      <div className="bg-base-100 rounded-2xl p-4 shadow-sm border border-line dark:border-base-300">
        <div className="flex items-center gap-3 bg-base-200 rounded-full px-4 py-3 border border-transparent focus-within:border-orange-400 transition max-w-md">
          <FiSearch className="text-base-content/40 shrink-0 text-sm" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <FiX className="text-base-content/30 text-xs" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🏪</div>
          <p className="text-base-content/40 text-base">No vendors found</p>
        </div>
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-gold-600 dark:text-gold-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400" /> Pending
                Approval ({pending.length})
              </p>
              <div className="space-y-3">
                {pending.map((v, i) => (
                  <VendorCard key={v._id} vendor={v} i={i} />
                ))}
              </div>
            </div>
          )}
          {approved.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
                Approved Vendors ({approved.length})
              </p>
              <div className="space-y-3">
                {approved.map((v, i) => (
                  <VendorCard key={v._id} vendor={v} i={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Vendors;
