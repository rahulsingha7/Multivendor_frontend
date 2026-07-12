import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { motion as Motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductReviewForm = ({ productId }) => {
  const token = getToken();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchReview = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/customer/reviews/${productId}`,
        { headers },
      );
      if (data && data._id) {
        setReview(data);
        setRating(data.rating);
        setComment(data.comment);
      } else {
        setReview(null);
        setRating(0);
        setComment("");
      }
    } catch (err) {
      setReview(null);
      setRating(0);
      setComment("");
      console.log("No review found", err.response?.data?.message);
    }
  };

  useEffect(() => {
    if (productId && token) {
      fetchReview();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { rating, comment };

    try {
      if (review?._id) {
        await axios.put(
          `${API_BASE_URL}/api/customer/reviews/${review._id}`,
          payload,
          { headers },
        );
        toast.success("Review updated");
      } else {
        await axios.post(
          `${API_BASE_URL}/api/customer/reviews/${productId}`,
          payload,
          { headers },
        );
        toast.success("Review added");
      }

      navigate("/customer/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Review submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!review?._id) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/api/customer/reviews/${review._id}`, {
        headers,
      });
      toast.success("Review deleted");
      navigate("/customer/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-serif text-xl font-semibold text-ink dark:text-base-content mb-4">
        {review ? "Edit your review" : "Leave a review"}
      </h3>

      <div className="flex gap-1.5 mb-5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <FaStar
              size={28}
              className={`transition ${
                star <= (hoverRating || rating)
                  ? "text-gold-400"
                  : "text-base-content/15"
              }`}
            />
          </Motion.button>
        ))}
      </div>

      <textarea
        className="w-full bg-base-200 rounded-xl px-4 py-3.5 border border-transparent focus:border-orange-400 outline-none text-base text-base-content placeholder-base-content/40 resize-none mb-5 transition"
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || rating === 0}
          className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg"
        >
          {loading ? "Saving..." : review ? "Update" : "Submit"}
        </Motion.button>
        {review && review._id && (
          <Motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-8 py-3.5 border border-red-300 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 font-semibold text-base rounded-full transition"
          >
            Delete
          </Motion.button>
        )}
      </div>
    </form>
  );
};

export default ProductReviewForm;
