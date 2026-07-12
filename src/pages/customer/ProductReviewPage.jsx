import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import ProductReviewForm from "./ProductReviewForm";

const ProductReviewPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream dark:bg-base-200 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-base-content/60 hover:text-orange-600 dark:hover:text-orange-400 text-sm font-semibold mb-4 transition"
        >
          <FiArrowLeft size={16} /> Back
        </button>
        <div className="bg-base-100 rounded-2xl shadow-sm border border-line dark:border-base-300 p-6 sm:p-8">
          <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-2">
            Your Feedback
          </p>
          <h2 className="font-serif text-3xl font-semibold text-ink dark:text-base-content mb-6">
            Product Review
          </h2>
          <ProductReviewForm productId={productId} />
        </div>
      </div>
    </div>
  );
};

export default ProductReviewPage;
