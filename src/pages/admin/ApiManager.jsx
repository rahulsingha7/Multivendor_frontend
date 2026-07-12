import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion as Motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiKey,
  FiPlus,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiCopy,
  FiLink,
  FiX,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiAlertTriangle,
} from "react-icons/fi";

const API = import.meta.env.VITE_API_BASE_URL;
const token = () => localStorage.getItem("token");
const h = () => ({ headers: { Authorization: `Bearer ${token()}` } });

const PERMISSIONS = [
  { value: "products:read", label: "Read Products" },
  { value: "categories:read", label: "Read Categories" },
  { value: "orders:read", label: "Read Orders" },
  { value: "reviews:read", label: "Read Reviews" },
  { value: "vendors:read", label: "Read Vendors" },
  { value: "users:read", label: "Read Users" },
  { value: "webhooks:manage", label: "Manage Webhooks" },
];

const EVENTS = [
  "order.created",
  "order.shipped",
  "order.delivered",
  "order.cancelled",
  "product.approved",
  "product.created",
  "vendor.approved",
  "user.registered",
  "payment.success",
];

const ApiManager = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKey, setNewKey] = useState(null); // shown once after creation
  const [selectedKey, setSelectedKey] = useState(null); // for webhook management
  const [webhooks, setWebhooks] = useState([]);
  const [showWebhookForm, setShowWebhookForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    permissions: ["products:read", "orders:read", "categories:read"],
  });
  const [webhookForm, setWebhookForm] = useState({
    url: "",
    events: ["order.created"],
  });

  const fetchKeys = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/api-keys`, h());
      setApiKeys(res.data);
    } catch {
      toast.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  const fetchWebhooks = async (keyId) => {
    try {
      const res = await axios.get(
        `${API}/api/admin/api-keys/${keyId}/webhooks`,
        h(),
      );
      setWebhooks(res.data);
    } catch {
      toast.error("Failed to load webhooks");
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/admin/api-keys`, form, h());
      setNewKey(res.data.apiKey);
      setShowCreateForm(false);
      setForm({
        name: "",
        company: "",
        email: "",
        permissions: ["products:read", "orders:read", "categories:read"],
      });
      fetchKeys();
      toast.success("API key created!");
    } catch {
      toast.error("Failed to create API key");
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await axios.patch(
        `${API}/api/admin/api-keys/${id}/toggle`,
        {},
        h(),
      );
      toast.success(res.data.message);
      fetchKeys();
    } catch {
      toast.error("Failed to toggle API key");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this API key and all its webhooks?")) return;
    try {
      await axios.delete(`${API}/api/admin/api-keys/${id}`, h());
      toast.success("API key deleted");
      if (selectedKey?._id === id) setSelectedKey(null);
      fetchKeys();
    } catch {
      toast.error("Failed to delete API key");
    }
  };

  const handleCreateWebhook = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API}/api/admin/api-keys/${selectedKey._id}/webhooks`,
        webhookForm,
        h(),
      );
      toast.success("Webhook created!");
      setShowWebhookForm(false);
      setWebhookForm({ url: "", events: ["order.created"] });
      fetchWebhooks(selectedKey._id);
      // Show secret once
      if (res.data.secret) {
        toast(`Webhook secret: ${res.data.secret}`, {
          duration: 10000,
          icon: "🔐",
        });
      }
    } catch {
      toast.error("Failed to create webhook");
    }
  };

  const handleDeleteWebhook = async (webhookId) => {
    try {
      await axios.delete(
        `${API}/api/admin/api-keys/${selectedKey._id}/webhooks/${webhookId}`,
        h(),
      );
      toast.success("Webhook deleted");
      fetchWebhooks(selectedKey._id);
    } catch {
      toast.error("Failed to delete webhook");
    }
  };

  const handleToggleWebhook = async (webhookId) => {
    try {
      const res = await axios.patch(
        `${API}/api/admin/api-keys/${selectedKey._id}/webhooks/${webhookId}/toggle`,
        {},
        h(),
      );
      toast.success(res.data.message);
      fetchWebhooks(selectedKey._id);
    } catch {
      toast.error("Failed to toggle webhook");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const togglePermission = (perm) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter((p) => p !== perm)
        : [...f.permissions, perm],
    }));
  };

  const toggleEvent = (event) => {
    setWebhookForm((f) => ({
      ...f,
      events: f.events.includes(event)
        ? f.events.filter((e) => e !== event)
        : [...f.events, event],
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-600 dark:text-orange-400 mb-1">
            Integration
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
            API Manager
          </h1>
          <p className="text-base-content/50 text-base mt-1">
            Manage API keys and webhooks for external integrations. Docs at{" "}
            <a
              href={`${API}/api/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
            >
              /api/docs
            </a>
          </p>
        </div>
        <Motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition shadow-sm hover:shadow-lg"
        >
          <FiPlus size={16} /> New API Key
        </Motion.button>
      </div>

      {/* New key revealed once */}
      <AnimatePresence>
        {newKey && (
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5"
          >
            <div className="flex items-start gap-3">
              <FiAlertTriangle
                className="text-emerald-600 shrink-0 mt-0.5"
                size={18}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                  ✅ API Key Created — Save this now!
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-500 mb-3">
                  This key will never be shown in full again. Copy it
                  immediately.
                </p>
                <div className="flex items-center gap-2 bg-base-100 rounded-xl px-4 py-3 border border-emerald-200 dark:border-emerald-800">
                  <code className="text-sm font-mono text-ink dark:text-base-content flex-1 break-all">
                    {newKey.key}
                  </code>
                  <button
                    onClick={() => copyToClipboard(newKey.key)}
                    className="text-emerald-600 hover:text-emerald-700 transition shrink-0"
                  >
                    <FiCopy size={16} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setNewKey(null)}
                className="text-base-content/40 hover:text-base-content transition"
              >
                <FiX size={18} />
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Create form */}
      <AnimatePresence>
        {showCreateForm && (
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-base-100 rounded-2xl shadow-sm border border-line dark:border-base-300 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl font-semibold text-ink dark:text-base-content">
                Create New API Key
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 rounded-full hover:bg-base-200 transition text-base-content/40"
              >
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    field: "name",
                    label: "Key Name",
                    placeholder: "e.g. Acme Corp Production",
                  },
                  {
                    field: "company",
                    label: "Company",
                    placeholder: "e.g. Acme Corp",
                  },
                  {
                    field: "email",
                    label: "Contact Email",
                    placeholder: "dev@acme.com",
                  },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                      {label}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      placeholder={placeholder}
                      value={form[field]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field]: e.target.value }))
                      }
                      required
                      className="w-full bg-base-200 rounded-xl px-4 py-3 text-base text-base-content outline-none border border-transparent focus:border-orange-400 transition"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
                  Permissions
                </label>
                <div className="flex flex-wrap gap-2">
                  {PERMISSIONS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => togglePermission(p.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                        form.permissions.includes(p.value)
                          ? "bg-orange-500 text-white"
                          : "bg-base-200 text-base-content/60 hover:bg-base-300"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition shadow-sm hover:shadow-lg"
                >
                  Generate API Key
                </Motion.button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-7 py-3.5 border border-line dark:border-base-300 rounded-full font-semibold text-base-content/60 hover:border-orange-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* API Keys list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse"
            />
          ))}
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl border border-line dark:border-base-300">
          <div className="text-5xl mb-3">🔑</div>
          <p className="font-serif text-xl font-semibold text-base-content mb-1">
            No API keys yet
          </p>
          <p className="text-base-content/40 text-base">
            Create your first API key to enable external integrations
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <Motion.div
              key={key._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-base-100 rounded-2xl shadow-sm border border-line dark:border-base-300 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${key.isActive ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-base-200"}`}
                  >
                    <FiKey
                      size={18}
                      className={
                        key.isActive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-base-content/40"
                      }
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-base-content text-base">
                      {key.name}
                    </p>
                    <p className="text-sm text-base-content/40">
                      {key.company} · {key.email}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {key.permissions.map((p) => (
                        <span
                          key={p}
                          className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${key.isActive ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-base-200 text-base-content/40"}`}
                  >
                    {key.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-sm text-base-content/40">
                    {key.requestCount} requests
                  </span>
                  <button
                    onClick={() => {
                      setSelectedKey(key);
                      fetchWebhooks(key._id);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-base-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-base-content/60 hover:text-orange-600 rounded-full text-sm font-semibold transition"
                  >
                    <FiLink size={13} /> Webhooks
                  </button>
                  <button
                    onClick={() => handleToggle(key._id)}
                    className={`p-2 rounded-full transition ${key.isActive ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" : "text-base-content/40 hover:bg-base-200"}`}
                    title={key.isActive ? "Deactivate" : "Activate"}
                  >
                    {key.isActive ? (
                      <FiToggleRight size={20} />
                    ) : (
                      <FiToggleLeft size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(key._id)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Webhook section */}
              <AnimatePresence>
                {selectedKey?._id === key._id && (
                  <Motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-line dark:border-base-300"
                  >
                    <div className="px-6 py-5 bg-base-200/30">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-base-content text-base flex items-center gap-2">
                          <FiLink
                            size={15}
                            className="text-orange-600 dark:text-orange-400"
                          />
                          Webhooks for {key.name}
                        </p>
                        <button
                          onClick={() => setShowWebhookForm(!showWebhookForm)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition"
                        >
                          <FiPlus size={13} /> Add Webhook
                        </button>
                      </div>

                      {/* Webhook create form */}
                      <AnimatePresence>
                        {showWebhookForm && (
                          <Motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="bg-base-100 rounded-2xl p-5 mb-4 border border-line dark:border-base-300"
                          >
                            <form
                              onSubmit={handleCreateWebhook}
                              className="space-y-4"
                            >
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                                  Endpoint URL
                                </label>
                                <input
                                  type="url"
                                  placeholder="https://yourcompany.com/webhooks/multivendor"
                                  value={webhookForm.url}
                                  onChange={(e) =>
                                    setWebhookForm((f) => ({
                                      ...f,
                                      url: e.target.value,
                                    }))
                                  }
                                  required
                                  className="w-full bg-base-200 rounded-xl px-4 py-3 text-base text-base-content outline-none border border-transparent focus:border-orange-400 transition"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
                                  Events to receive
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {EVENTS.map((event) => (
                                    <button
                                      key={event}
                                      type="button"
                                      onClick={() => toggleEvent(event)}
                                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                                        webhookForm.events.includes(event)
                                          ? "bg-teal-500 text-white"
                                          : "bg-base-200 text-base-content/60 hover:bg-base-300"
                                      }`}
                                    >
                                      {event}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <button
                                  type="submit"
                                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full text-sm transition"
                                >
                                  Save Webhook
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowWebhookForm(false)}
                                  className="px-6 py-2.5 border border-line dark:border-base-300 rounded-full text-sm font-semibold text-base-content/60 hover:border-orange-400 transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </Motion.div>
                        )}
                      </AnimatePresence>

                      {/* Webhook list */}
                      {webhooks.length === 0 ? (
                        <p className="text-base-content/40 text-sm text-center py-4">
                          No webhooks yet — add one to receive real-time events
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {webhooks.map((wh) => (
                            <div
                              key={wh._id}
                              className="bg-base-100 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap border border-line dark:border-base-300"
                            >
                              <div className="min-w-0">
                                <p className="font-mono text-sm text-base-content truncate">
                                  {wh.url}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  {wh.events.map((e) => (
                                    <span
                                      key={e}
                                      className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300"
                                    >
                                      {e}
                                    </span>
                                  ))}
                                </div>
                                {wh.failureCount > 0 && (
                                  <p className="text-xs text-red-500 mt-1">
                                    ⚠️ {wh.failureCount} failures
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${wh.isActive ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-base-200 text-base-content/40"}`}
                                >
                                  {wh.isActive ? "Active" : "Paused"}
                                </span>
                                <button
                                  onClick={() => handleToggleWebhook(wh._id)}
                                  className={`p-1.5 rounded-full transition ${wh.isActive ? "text-emerald-600 hover:bg-emerald-50" : "text-base-content/40 hover:bg-base-200"}`}
                                >
                                  {wh.isActive ? (
                                    <FiToggleRight size={18} />
                                  ) : (
                                    <FiToggleLeft size={18} />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteWebhook(wh._id)}
                                  className="p-1.5 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </Motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiManager;
