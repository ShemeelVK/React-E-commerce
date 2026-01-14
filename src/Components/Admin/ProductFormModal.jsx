import React, { useState, useRef ,useEffect} from "react";
import { X, Upload, Image as ImageIcon, Loader2, Check } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// ============================================================================
// ⚠️ IMPORTANT: UNCOMMENT THIS IMPORT IN YOUR REAL PROJECT
// ============================================================================
import api from "../../utils/api";

// ============================================================================
// --- TEMPORARY MOCK FOR PREVIEW (DELETE THIS SECTION IN YOUR APP) ---
// ============================================================================
// const api = {
//   post: async (url, data, config) => {
//     console.log("Mock API Post:", url, data);
//     await new Promise((r) => setTimeout(r, 1500));
//     return { data: { success: true } };
//   },
//   put: async (url, data, config) => {
//     console.log("Mock API Put:", url, data);
//     await new Promise((r) => setTimeout(r, 1500));
//     return { data: { success: true } };
//   },
// };
// ============================================================================

function ProductFormModal({ isOpen, onClose, onSuccess, product = null }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Sneakers",
    stock: "",
    description: "",
  });

  // Populate data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        category: product.category || "Sneakers",
        stock: product.stock || "",
        description: product.description || "",
      });
      setPreview(product.imageUrl || null);
    } else {
      // Reset if adding new
      setFormData({
        name: "",
        price: "",
        category: "Sneakers",
        stock: "",
        description: "",
      });
      setPreview(null);
      setFile(null);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  // --- Drag & Drop Logic ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("description", formData.description);

      if (file) {
        data.append("imageFile", file);
      }

      const url = product
        ? `/Products/Update-Product/${product.id}`
        : "/Products/Add-Product";
      const method = product ? "put" : "post";

      await api[method](url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`Product ${product ? "updated" : "added"} successfully!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload Area (Drag & Drop) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">
              Product Image
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              className={`relative h-48 w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragActive
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700"
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <div className="text-center text-slate-400 p-4">
                  <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs opacity-50 mt-1">JPG, PNG up to 5MB</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  e.target.files[0] && handleFile(e.target.files[0])
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">
                Name
              </label>
              <input
                required
                type="text"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">
                Price ($)
              </label>
              <input
                required
                type="number"
                step="0.01"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">
                Category
              </label>
              <select
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option>Sneakers</option>
                <option>Boots</option>
                <option>Running</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">
                Stock
              </label>
              <input
                required
                type="number"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">
              Description
            </label>
            <textarea
              rows="3"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 text-white py-2.5 rounded-lg hover:bg-slate-600 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-semibold flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : product ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default ProductFormModal;
