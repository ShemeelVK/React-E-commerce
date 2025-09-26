import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";

function ProductFormModal({ product, onClose, onSuccess }) {
  
  const isEditing = product !== null;

  const [formData, setFormData] = useState({
    name: "",
    category: "Sneakers",
    price: "",
    description: "",
    imageUrl: "",
    isFeatured: false,
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        isFeatured: product.isFeatured || false,
      });
    }
  }, [product, isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      price: parseFloat(formData.price),
    };

    try {
      if (isEditing) {
        // If editing,
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/products/${product.id}`,
          dataToSubmit
        );
        toast.success("Product updated successfully!");
      } else {
        // If adding
        await axios.post(
          `${import.meta.env.VITE_API_URL}/products`,
          dataToSubmit
        );
        toast.success("Product added successfully!");
      }
      onSuccess(); // calls fetchProducts() in the parent
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("An error occurred while saving the product.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full relative text-white">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md"
              >
                <option>Sneakers</option>
                <option>Running</option>
                <option>Boots</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md"
              ></textarea>
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                id="isFeatured"
                className="h-4 w-4 rounded text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="isFeatured"
                className="text-sm font-medium text-slate-300"
              >
                Mark as a Featured Product
              </label>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700 text-right">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-3 rounded-md text-gray-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
            >
              {isEditing ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;
