import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion as Motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

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

const SeeAllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/public`,
        { params: { page, limit: 12 } },
      );
      setReviews(res.data.reviews || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  return (
    <div className="min-h-screen bg-cream dark:bg-base-200">
      {/* ── Page Header ── */}
      <div className="px-4 sm:px-10 lg:px-16 pt-12 sm:pt-16 pb-8 border-b border-line dark:border-base-300">
        <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-3">
          Social proof
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink dark:text-base-content leading-tight">
          All Reviews
        </h1>
        <p className="text-base-content/50 text-base mt-3">
          See what real buyers are saying about products from our vendors.
        </p>
      </div>

      <div className="px-4 sm:px-10 lg:px-16 py-10">
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
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">💬</div>
            <h3 className="font-serif text-2xl font-semibold text-base-content mb-2">
              No reviews yet
            </h3>
            <p className="text-base-content/50 text-base">
              Be the first to share your experience with a product.
            </p>
          </Motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {reviews.map((review, i) => (
              <Motion.div
                key={review._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 12) * 0.04 }}
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

        {/* ── Pagination ── */}
        {totalPages > 1 && !loading && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-base-100 border border-line dark:border-base-300 text-sm font-semibold disabled:opacity-40 hover:border-orange-400 transition"
            >
              <FiArrowLeft size={14} /> Prev
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-full text-sm font-semibold transition ${
                    page === i + 1
                      ? "bg-orange-500 text-white"
                      : "bg-base-100 border border-line dark:border-base-300 hover:border-orange-400 text-base-content/70"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-base-100 border border-line dark:border-base-300 text-sm font-semibold disabled:opacity-40 hover:border-orange-400 transition"
            >
              Next <FiArrowRight size={14} />
            </button>
          </Motion.div>
        )}
      </div>
    </div>
  );
};

export default SeeAllReviews;
