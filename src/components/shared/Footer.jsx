import React from "react";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import { FiMail, FiMapPin, FiPhone, FiArrowUpRight } from "react-icons/fi";

const LINKS = {
  Shop: [
    { label: "All Products", to: "/products" },
    { label: "Featured Items", to: "/#products", hash: true },
    { label: "Customer Reviews", to: "/#reviews", hash: true },
    { label: "Contact Us", to: "/#contact", hash: true },
  ],
  Account: [
    { label: "Login", to: "/login" },
    { label: "Customer Sign Up", to: "/register/customer" },
    { label: "Vendor Sign Up", to: "/register/vendor" },
    { label: "My Orders", to: "/customer/orders" },
  ],
  Vendors: [
    { label: "Become a Vendor", to: "/register/vendor" },
    { label: "Vendor Dashboard", to: "/vendor/dashboard" },
    { label: "Manage Products", to: "/vendor/manage-products" },
    { label: "My Earnings", to: "/vendor/earnings" },
  ],
};

const SOCIALS = [
  {
    icon: FaFacebook,
    href: "https://facebook.com",
    label: "Facebook",
    color: "hover:text-blue-400",
  },
  {
    icon: FaTwitter,
    href: "https://twitter.com",
    label: "Twitter",
    color: "hover:text-sky-300",
  },
  {
    icon: FaInstagram,
    href: "https://instagram.com",
    label: "Instagram",
    color: "hover:text-pink-400",
  },
  {
    icon: FaGithub,
    href: "https://github.com",
    label: "GitHub",
    color: "hover:text-gray-200",
  },
];

const Footer = () => {
  return (
    <footer className="bg-ink text-cream">
      {/* Top CTA band */}
      <div className="bg-orange-500 px-4 sm:px-10 lg:px-16 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-center sm:text-left">
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-white">
              Ready to start selling?
            </p>
            <p className="text-orange-100 text-base mt-1">
              Join hundreds of vendors reaching thousands of buyers.
            </p>
          </div>
          <Motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0"
          >
            <Link
              to="/register/vendor"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-orange-600 font-semibold rounded-full hover:bg-orange-50 transition text-base shadow-sm hover:shadow-lg"
            >
              Become a Vendor
              <FiArrowUpRight size={16} />
            </Link>
          </Motion.div>
        </div>
      </div>

      {/* Main footer */}
      <div className="px-4 sm:px-10 lg:px-16 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* Brand col */}
        <div className="lg:col-span-2">
          <HashLink smooth to="/#" className="inline-flex items-center mb-4">
            <span className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight">
              <span className="text-orange-400">Multi</span>
              <span className="text-cream">Vendor</span>
            </span>
          </HashLink>
          <p className="text-cream/60 text-base leading-relaxed mb-6 max-w-xs">
            One platform, hundreds of vendors. Discover unique products, support
            independent sellers, and shop with confidence.
          </p>
          {/* Contact info */}
          <div className="space-y-2.5 text-base text-cream/60">
            {[
              { icon: FiMail, text: "support@multivendor.shop" },
              { icon: FiPhone, text: "+1 (555) 000-0000" },
              { icon: FiMapPin, text: "Sydney, Australia" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <Icon size={15} className="text-orange-400 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([title, items]) => (
          <div key={title}>
            <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-400 mb-5">
              {title}
            </h4>
            <ul className="space-y-3">
              {items.map(({ label, to, hash }) => (
                <li key={label}>
                  {hash ? (
                    <HashLink
                      smooth
                      to={to}
                      className="text-base text-cream/70 hover:text-orange-400 transition font-medium"
                    >
                      {label}
                    </HashLink>
                  ) : (
                    <Link
                      to={to}
                      className="text-base text-cream/70 hover:text-orange-400 transition font-medium"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10 px-4 sm:px-10 lg:px-16 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream/40">
            © {new Date().getFullYear()} MultiVendorShop. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {SOCIALS.map(({ icon: Icon, href, label, color }) => (
              <Motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`text-cream/40 transition text-lg ${color}`}
              >
                <Icon />
              </Motion.a>
            ))}
          </div>
          <div className="flex items-center gap-5 text-sm text-cream/40">
            <span className="cursor-default hover:text-cream/70 transition">
              Privacy Policy
            </span>
            <span className="cursor-default hover:text-cream/70 transition">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
