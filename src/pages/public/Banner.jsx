import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { motion as Motion } from "framer-motion";
import axios from "axios";
import { FiTruck, FiShield, FiRefreshCw, FiStar } from "react-icons/fi";

const getProductImage = (product) =>
  product?.images?.[0]?.url || product?.imageUrl || null;

// Append Cloudinary transformation params (resize, auto quality/format)
// so hero-sized images stay sharp instead of being upscaled by the browser.
const cld = (url, transform) => {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
};

const STATS = [
  { value: "200+", label: "Vendors" },
  { value: "5k+", label: "Products" },
  { value: "12k+", label: "Happy buyers" },
];

const TRUST_ITEMS = [
  { icon: FiTruck, label: "Fast delivery" },
  { icon: FiShield, label: "Secure checkout" },
  { icon: FiStar, label: "Verified reviews" },
  { icon: FiRefreshCw, label: "30-day returns" },
];

// Static branded hero image — independent of live product data
const HERO_IMAGE =
  "https://res.cloudinary.com/dw5pbuaxx/image/upload/v1781276274/akhil-yerabati-Q2uV5TkjNz8-unsplash_ikmsxs.jpg";

const Banner = () => {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/products/public?limit=4`)
      .then((res) => setFeatured(res.data.products?.[0] || null))
      .catch(() => {});
  }, []);

  // featuredImage is now ONLY used for the small badge thumbnail
  const featuredImage = getProductImage(featured);
  const isInStock = (product) => {
    const stock = product?.countInStock ?? product?.stock ?? product?.quantity;
    return stock === undefined || stock > 0;
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/products/public?limit=8`)
      .then((res) => {
        const products = res.data.products || [];
        const inStock = products.filter(isInStock);
        setFeatured(inStock[0] || null);
      })
      .catch(() => {});
  }, []);
  return (
    <section className="relative overflow-hidden bg-cream dark:bg-base-200">
      <div className="px-4 sm:px-10 lg:px-16 py-12 sm:py-20 grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
        {/* ── Left: copy ── */}
        <div>
          <Motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-5"
          >
            <Motion.span
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block text-lg"
            >
              ✨
            </Motion.span>
            200+ independent vendors
          </Motion.p>

          <Motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold text-ink dark:text-base-content leading-[1.05] mb-6"
          >
            Shop small.
            <br />
            Discover something new.
          </Motion.h1>

          <Motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base-content/60 text-lg sm:text-xl mb-9 max-w-xl"
          >
            Curated finds from independent sellers, all in one easy checkout.
            New arrivals every day.
          </Motion.p>

          <Motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <Motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <HashLink
                smooth
                to="#products"
                className="inline-block px-8 py-4 rounded-full font-semibold text-base bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm hover:shadow-lg"
              >
                Shop new arrivals
              </HashLink>
            </Motion.div>
            <Motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/register/vendor"
                className="inline-block px-8 py-4 rounded-full font-semibold text-base border border-ink dark:border-base-content text-ink dark:text-base-content hover:bg-ink hover:text-cream dark:hover:bg-base-content dark:hover:text-base-100 transition"
              >
                Become a vendor
              </Link>
            </Motion.div>
          </Motion.div>

          {/* Stats */}
          <Motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-8"
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
                  {stat.value}
                </p>
                <p className="text-sm uppercase tracking-[0.2em] text-base-content/50 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </Motion.div>
        </div>

        {/* ── Right: image ── */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] max-w-md mx-auto w-full"
        >
          {/* Decorative blobs */}
          <Motion.div
            animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-orange-200 dark:bg-orange-900/30 z-0"
          />
          <Motion.div
            animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
            className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-teal-100 dark:bg-teal-900/30 z-0"
          />
          <Motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.55, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 -right-3 w-6 h-6 rounded-full bg-gold-400 z-20"
          />

          {/* Image card */}
          <Motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.02, rotate: -1 }}
            className="relative z-10 w-full h-full rounded-2xl overflow-hidden bg-base-100 border border-line dark:border-base-300 shadow-xl"
          >
            <img
              src={cld(
                HERO_IMAGE,
                "w_2000,h_1100,c_fill,g_auto,q_auto:best,f_auto",
              )}
              alt="Curated finds from independent sellers"
              className="w-full h-full object-cover"
            />
          </Motion.div>

          {/* Floating badge */}
          {featured && (
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:w-56 z-20"
            >
              <Motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                }}
                className="bg-base-100 border border-line dark:border-base-300 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-base-200 overflow-hidden shrink-0">
                  <img
                    src={cld(
                      featuredImage,
                      "w_80,h_80,c_fill,g_auto,q_auto:best,f_auto",
                    )}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-base-content truncate">
                    {featured.name}
                  </p>
                  <p className="text-xs text-base-content/50 mt-0.5">
                    New arrival
                  </p>
                </div>
              </Motion.div>
            </Motion.div>
          )}
        </Motion.div>
      </div>

      {/* Trust strip */}
      <div className="border-t border-line dark:border-base-300 bg-base-100">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-4 px-4 sm:px-10 lg:px-16 text-xs uppercase tracking-[0.15em] text-base-content/50">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <item.icon size={14} className="text-orange-500" />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
