"use client";

import { useState } from "react";
import { deleteProduct } from "@/app/actions/products";

export default function DeleteProductButton({ productId, productName }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("product_id", productId);
      await deleteProduct(formData);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <div className="admin-delete-control">
      {confirming ? (
        <div className="admin-delete-confirm">
          <span>Delete {productName}?</span>

          <form onSubmit={handleDelete}>
            <button 
              type="submit" 
              className="admin-delete-yes" 
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </button>
          </form>

          <button
            type="button"
            className="admin-delete-cancel"
            onClick={() => setConfirming(false)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="admin-delete-trigger"
          title={`Delete ${productName}`}
          onClick={() => setConfirming(true)}
        >
          Delete
        </button>
      )}
    </div>
  );
}