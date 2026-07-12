import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet, Link } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiShield,
  FiTag,
  FiExternalLink,
  FiKey,
} from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: FiHome },
  { label: "Vendors", path: "/admin/vendors", icon: FiUsers },
  { label: "Products", path: "/admin/manage-products", icon: FiPackage },
  { label: "Orders", path: "/admin/orders", icon: FiShoppingCart },
  { label: "Users", path: "/admin/users", icon: FiUsers },
  { label: "Coupons", path: "/admin/coupons", icon: FiTag },
  { label: "API Manager", path: "/admin/api-manager", icon: FiKey },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    setIsDark(saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login/admin");
  };

  const SidebarContent = ({ onNav }) => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-line dark:border-base-300">
        <Link to="/" className="flex items-center gap-2 mb-5">
          <span className="text-xl font-serif font-semibold tracking-tight">
            <span className="text-orange-500">Multi</span>
            <span className="text-ink dark:text-base-content">Vendor</span>
          </span>
          <FiExternalLink size={12} className="text-base-content/30 mb-1" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center shrink-0">
            <FiShield className="text-orange-400" size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink dark:text-base-content">
              Administrator
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNav}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-semibold transition-all
              ${
                isActive
                  ? "bg-ink dark:bg-orange-500 text-cream dark:text-white shadow-sm"
                  : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 space-y-1 border-t border-line dark:border-base-300 pt-4">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-base font-semibold text-base-content/60 hover:bg-base-200 hover:text-base-content transition"
        >
          {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-base font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <FiLogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-cream dark:bg-base-200">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 bg-base-100 border-r border-line dark:border-base-300 flex-col sticky top-0 h-screen shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-base-100 shadow-xl z-10">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-base-200 transition"
            >
              <FiX size={18} className="text-base-content/60" />
            </button>
            <SidebarContent onNav={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3.5 bg-base-100 border-b border-line dark:border-base-300">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-base-200 transition"
          >
            <FiMenu size={20} className="text-base-content/60" />
          </button>
          <span className="font-serif font-semibold text-ink dark:text-base-content">
            Admin Panel
          </span>
          <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center">
            <FiShield className="text-orange-400" size={14} />
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
