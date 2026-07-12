import React from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiLock,
  FiStar,
  FiUsers,
  FiArrowUpRight,
} from "react-icons/fi";
import Banner from "./public/Banner";
import ProductList from "./public/ProductList";
import Reviews from "./public/Reviews";
import Contact from "./public/Contact";
import Newsletter from "./public/Newsletter";
import Footer from "../components/shared/Footer";

const WHY_US = [
  {
    icon: FiHome,
    title: "200+ vendors",
    desc: "Curated sellers across every category, all in one place.",
  },
  {
    icon: FiLock,
    title: "Secure checkout",
    desc: "Stripe-powered payments. Your card details are always safe.",
  },
  {
    icon: FiStar,
    title: "Verified reviews",
    desc: "Only real buyers can leave reviews. No fake ratings.",
  },
  {
    icon: FiUsers,
    title: "Seller support",
    desc: "Want to sell? Join as a vendor and reach thousands of buyers.",
  },
];

const Home = () => {
  return (
    <div>
      <Banner />

      <div id="products">
        <ProductList />
      </div>

      {/* Why shop with us */}
      <section className="py-20 sm:py-24 px-4 sm:px-10 lg:px-16 bg-base-200">
        <div className="w-full">
          <div className="text-center mb-14">
            <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-3">
              Why shop with us
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-ink dark:text-base-content">
              Built for smart shoppers
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {WHY_US.map((item, i) => (
              <Motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group bg-base-100 border border-line dark:border-base-300 rounded-2xl p-8 sm:p-10 text-center shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <Motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition-colors"
                >
                  <item.icon
                    className="text-orange-600 dark:text-orange-400"
                    size={28}
                  />
                </Motion.div>
                <h3 className="font-serif font-semibold text-xl mb-2 text-base-content">
                  {item.title}
                </h3>
                <p className="text-base-content/60 text-base leading-relaxed">
                  {item.desc}
                </p>
              </Motion.div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Link
                to="/register/vendor"
                className="inline-flex items-center gap-2 px-10 py-4 bg-ink dark:bg-base-content text-cream dark:text-base-100 font-semibold text-base rounded-full transition hover:bg-orange-600 dark:hover:bg-orange-500 hover:shadow-lg"
              >
                Become a vendor
                <FiArrowUpRight size={16} />
              </Link>
            </Motion.div>
          </div>
        </div>
      </section>

      <Reviews />

      <div id="contact">
        <Contact />
      </div>

      <Newsletter />

      <Footer />
    </div>
  );
};

export default Home;
