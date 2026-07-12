import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FiTag,
  FiDollarSign,
  FiBox,
  FiImage,
  FiFileText,
  FiList,
  FiZap,
} from "react-icons/fi";

const InputField = ({ icon: Icon, label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <div className="flex items-start gap-3 bg-base-200 rounded-xl px-4 py-3.5 border border-transparent focus-within:border-orange-400 transition">
      <Icon className="text-base-content/40 shrink-0 mt-0.5" size={15} />
      {children}
    </div>
  </div>
);

const generateDescription = async ({
  name,
  categoryName,
  price,
  onChunk,
  onDone,
  onError,
}) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        stream: true,
        messages: [
          {
            role: "user",
            content: `Write a compelling product description for an e-commerce listing.

Product name: ${name}
Category: ${categoryName || "General"}
${price ? `Price: $${price}` : ""}

Requirements:
- 2-3 sentences maximum
- Highlight key benefits and features
- Use persuasive but honest language
- No bullet points, just flowing prose
- Do not mention the price
- End with a subtle call to action

Write only the description, nothing else.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "API error");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "content_block_delta" && parsed.delta?.text) {
            onChunk(parsed.delta.text);
          }
        } catch {
          /* skip malformed chunks */
        }
      }
    }
    onDone();
  } catch (err) {
    onError(err.message);
  }
};

export default function CreateProduct() {
  const fileInputRef = useRef(null);
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    categoryName: "",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGenerate = async () => {
    if (!formData.name.trim()) {
      toast.error("Enter a product name first");
      return;
    }
    setGenerating(true);
    setFormData((prev) => ({ ...prev, description: "" }));

    await generateDescription({
      name: formData.name,
      categoryName: formData.categoryName,
      price: formData.price,
      onChunk: (text) => {
        setFormData((prev) => ({
          ...prev,
          description: prev.description + text,
        }));
      },
      onDone: () => {
        setGenerating(false);
        toast.success("Description generated! ✨");
      },
      onError: (msg) => {
        setGenerating(false);
        toast.error(`AI generation failed: ${msg}`);
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, stock, image, categoryName } = formData;
    if (!name || !price || !stock || !image || !categoryName) {
      toast.error("All required fields must be filled");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v) data.append(k, v);
      });
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/vendor/products`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success("Product created! Awaiting admin approval.");
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: null,
        categoryName: "",
      });
      setPreview(null);
      setUseNewCategory(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-600 dark:text-orange-400 mb-1">
          Vendor
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
          Create Product
        </h1>
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-base-100 rounded-2xl shadow-sm border border-gray-100 dark:border-base-300 p-6"
      >
        {/* Approval notice */}
        <div className="flex items-start gap-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
          <span className="text-lg mt-0.5">ℹ️</span>
          <p className="text-xs text-orange-700 dark:text-orange-300">
            New products require admin approval before appearing in the store.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField icon={FiTag} label="Product Name" required>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Headphones"
              required
              className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-base-content placeholder-gray-400"
            />
          </InputField>

          {/* Description with AI button */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-base-content/60">
                Description
              </label>
              <Motion.button
                type="button"
                onClick={handleGenerate}
                disabled={generating || !formData.name.trim()}
                whileHover={
                  !generating && formData.name.trim() ? { scale: 1.04 } : {}
                }
                whileTap={
                  !generating && formData.name.trim() ? { scale: 0.97 } : {}
                }
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all
                  ${
                    generating || !formData.name.trim()
                      ? "bg-base-200 text-base-content/40 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-500 to-orange-500 text-white shadow-sm hover:shadow-md hover:shadow-violet-200"
                  }`}
              >
                <AnimatePresence mode="wait">
                  {generating ? (
                    <Motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <span className="loading loading-spinner loading-xs" />
                      Generating...
                    </Motion.span>
                  ) : (
                    <Motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <FiZap size={11} />✨ Generate with AI
                    </Motion.span>
                  )}
                </AnimatePresence>
              </Motion.button>
            </div>

            <div
              className={`flex items-start gap-3 bg-base-200 rounded-xl px-4 py-3.5 border transition
              ${generating ? "border-violet-400 bg-violet-50 dark:bg-violet-900/10" : "border-transparent focus-within:border-orange-400"}`}
            >
              <FiFileText
                className="text-base-content/40 shrink-0 mt-0.5"
                size={15}
              />
              <div className="relative w-full">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your product, or click ✨ Generate with AI above..."
                  className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40 resize-none"
                />
                {generating && (
                  <Motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="inline-block w-0.5 h-4 bg-violet-500 ml-0.5 align-middle"
                  />
                )}
              </div>
            </div>

            {/* AI hint */}
            <p className="text-xs text-base-content/40 mt-1.5 flex items-center gap-1">
              <FiZap size={9} className="text-violet-400" />
              Fill in product name and category first for the best AI results
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField icon={FiDollarSign} label="Price ($)" required>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
              />
            </InputField>
            <InputField icon={FiBox} label="Stock Qty" required>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
                className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
              />
            </InputField>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
              Category<span className="text-red-500 ml-0.5">*</span>
            </label>
            {!useNewCategory ? (
              <div className="flex items-center gap-3 bg-base-200 rounded-xl px-4 py-3.5 border border-transparent focus-within:border-orange-400 transition">
                <FiList className="text-base-content/40 shrink-0" size={15} />
                <select
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={(e) => {
                    if (e.target.value === "_new") {
                      setUseNewCategory(true);
                      setFormData((p) => ({ ...p, categoryName: "" }));
                    } else
                      setFormData((p) => ({
                        ...p,
                        categoryName: e.target.value,
                      }));
                  }}
                  required
                  className="w-full bg-transparent outline-none text-base text-base-content cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="_new">+ Enter new category</option>
                </select>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-3 bg-base-200 rounded-xl px-4 py-3.5 border border-transparent focus-within:border-orange-400 transition">
                  <FiList className="text-base-content/40 shrink-0" size={15} />
                  <input
                    type="text"
                    name="categoryName"
                    placeholder="Enter new category name"
                    value={formData.categoryName}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUseNewCategory(false);
                    setFormData((p) => ({ ...p, categoryName: "" }));
                  }}
                  className="px-4 py-2 rounded-full border border-line dark:border-base-300 text-sm font-semibold text-base-content/60 hover:border-orange-400 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
              Product Image<span className="text-red-500 ml-0.5">*</span>
            </label>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-line dark:border-base-300 rounded-2xl cursor-pointer hover:border-orange-400 transition bg-base-200 overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <FiImage className="text-base-content/20 text-4xl mx-auto mb-2" />
                  <p className="text-sm text-base-content/40 font-semibold">
                    Click to upload image
                  </p>
                  <p className="text-xs text-base-content/30">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
                className="hidden"
              />
            </label>
          </div>

          <Motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Create Product"
            )}
          </Motion.button>
        </form>
      </Motion.div>
    </div>
  );
}
