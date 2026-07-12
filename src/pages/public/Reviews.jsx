import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion as Motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        size={14}
        className={i < rating ? "text-gold-400" : "text-base-content/15"}
      />
    ))}
  </div>
);

const AVATAR_COLORS = [
  "bg-orange-500",
  "bg-teal-600",
  "bg-gold-500",
  "bg-orange-400",
  "bg-teal-400",
  "bg-gold-400",
];

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/public?limit=6`)
      .then((res) => setReviews(res.data.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-10 lg:px-16 bg-cream dark:bg-base-100">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-3">
          Social proof
        </p>
        <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-ink dark:text-base-content mb-4">
          What our customers say
        </h2>
        {avgRating && (
          <div className="flex items-center justify-center gap-3">
            <span className="font-serif text-5xl sm:text-6xl font-semibold text-ink dark:text-base-content">
              {avgRating}
            </span>
            <div className="text-left">
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={18}
                    className={
                      i < Math.round(parseFloat(avgRating))
                        ? "text-gold-400"
                        : "text-base-content/15"
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-base-content/40">
                Based on {reviews.length} review
                {reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-base-100 dark:bg-base-200 border border-line dark:border-base-300 animate-pulse"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-base-content/40 text-base">
          No reviews yet — be the first to leave one!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {reviews.map((review, i) => (
            <Motion.div
              key={review._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              className="bg-base-100 dark:bg-base-200 rounded-2xl p-7 sm:p-8 flex flex-col gap-5 border border-line dark:border-base-300 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <FaQuoteLeft className="text-orange-200 dark:text-orange-900/50 text-3xl" />

              <p className="text-base-content text-base leading-relaxed flex-grow">
                "{review.comment}"
              </p>

              <div>
                <StarRow rating={review.rating} />
                <p className="text-sm text-base-content/40 mt-2 font-medium">
                  {review.product?.name && (
                    <span className="text-orange-600 dark:text-orange-400">
                      {review.product.name} ·{" "}
                    </span>
                  )}
                  {review.user?.name || "Anonymous"}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-line dark:border-base-300">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    AVATAR_COLORS[i % AVATAR_COLORS.length]
                  }`}
                >
                  {(review.user?.name || "A")[0].toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-base-content">
                  {review.user?.name || "Anonymous"}
                </span>
              </div>
            </Motion.div>
          ))}
        </div>
      )}

      <div className="mt-14 text-center">
        <Motion.div
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block"
        >
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-ink dark:border-base-content text-base font-semibold text-ink dark:text-base-content hover:bg-ink hover:text-cream dark:hover:bg-base-content dark:hover:text-base-100 transition"
          >
            Read all reviews
            <FiArrowUpRight size={16} />
          </Link>
        </Motion.div>
      </div>
    </section>
  );
};

export default Reviews;
