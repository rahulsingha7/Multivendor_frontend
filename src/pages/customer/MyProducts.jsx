/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/customer/products`,
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

  const handleEdit = (product) => {
    setEditId(product._id);
    setPreview(product.imageUrl || null);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock || 0,
      categoryId: product.category?._id || "",
      newCategoryName: "",
    });
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({});
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((p) => ({ ...p, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSave = async (productId) => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      if (formData.image) data.append("image", formData.image);
      const catName =
        formData.newCategoryName ||
        categories.find((c) => c._id === formData.categoryId)?.name;
      if (catName) data.append("categoryName", catName);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/customer/products/${productId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success("Product updated!");
      handleCancel();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/customer/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-600 dark:text-orange-400 mb-1">
          Vendor
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
          Manage Products
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

      {/* Products */}
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
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="font-serif text-xl font-semibold text-base-content mb-2">
            No products found
          </h3>
          <p className="text-base-content/40 text-base">
            Create your first product to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {products.map((product, i) => (
              <Motion.div
                key={product._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="bg-base-100 rounded-2xl shadow-sm border border-line dark:border-base-300 overflow-hidden"
              >
                {editId === product._id ? (
                  /* Edit form */
                  <div className="p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-2">
                      Editing
                    </p>

                    {/* Image preview */}
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-line dark:border-base-300 rounded-xl cursor-pointer hover:border-orange-400 transition overflow-hidden bg-base-200">
                      {preview ? (
                        <img
                          src={preview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-base-content/40">
                          Click to change image
                        </span>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>

                    {[
                      {
                        name: "name",
                        placeholder: "Product name",
                        type: "text",
                      },
                      {
                        name: "price",
                        placeholder: "Price ($)",
                        type: "number",
                      },
                      {
                        name: "stock",
                        placeholder: "Stock qty",
                        type: "number",
                      },
                    ].map(({ name, placeholder, type }) => (
                      <input
                        key={name}
                        type={type}
                        name={name}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full bg-base-200 border border-transparent focus:border-orange-400 rounded-xl px-3 py-2.5 text-sm outline-none transition text-base-content"
                      />
                    ))}

                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Description"
                      className="w-full bg-base-200 border border-transparent focus:border-orange-400 rounded-xl px-3 py-2.5 text-sm outline-none transition resize-none text-base-content"
                    />

                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full bg-base-200 border border-transparent focus:border-orange-400 rounded-xl px-3 py-2.5 text-sm outline-none transition cursor-pointer text-base-content"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleSave(product._id)}
                        disabled={saving}
                        className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full text-sm transition flex items-center justify-center gap-1"
                      >
                        {saving ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <>
                            <FiCheck size={13} /> Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 py-2.5 border border-line dark:border-base-300 text-base-content/60 font-semibold rounded-full text-sm hover:border-orange-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View card */
                  <>
                    <div className="relative h-56 overflow-hidden bg-base-200">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <span
                        className={`absolute top-2 right-2 text-[11px] font-semibold px-2.5 py-1 rounded-full ${product.isApproved ? "bg-emerald-500 text-white" : "bg-gold-400 text-ink"}`}
                      >
                        {product.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-widest text-base-content/40 mb-1">
                        {product.category?.name || "General"}
                      </p>
                      <h3 className="font-semibold text-base-content text-base mb-1 truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-orange-600 dark:text-orange-400 font-bold text-base">
                          ${product.price}
                        </span>
                        <span className="text-sm text-base-content/40 font-semibold">
                          {product.stock ?? 0} in stock
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 py-2 bg-base-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-line dark:border-base-300 hover:border-orange-400 text-base-content/60 rounded-full text-sm font-semibold flex items-center justify-center gap-1 transition"
                        >
                          <FiEdit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-500 rounded-full text-sm font-semibold flex items-center justify-center gap-1 transition"
                        >
                          <FiTrash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </Motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-2">
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

export default ManageProducts;
