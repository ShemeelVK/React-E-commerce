import React, { useState, useEffect, useRef } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  Star,
  Search,
  Loader2,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// ============================================================================
// ⚠️ IMPORTANT: UNCOMMENT THESE IMPORTS IN YOUR REAL PROJECT
// ============================================================================
import api from "../../utils/api.js";
import ProductFormModal from "../../Components/Admin/ProductFormModal.jsx";

// ============================================================================
// --- PREVIEW MOCKS (DELETE THIS SECTION IN YOUR APP) ---
// ============================================================================
// const api = {
//   get: async (url) => {
//     await new Promise((r) => setTimeout(r, 600));
//     return {
//       data: [
//         {
//           id: 1,
//           name: "Urban Drifter X",
//           category: "Sneakers",
//           price: 245.0,
//           stock: 12,
//           isFeatured: true,
//           imageUrl:
//             "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=200",
//           isDeleted: false,
//         },
//         {
//           id: 2,
//           name: "Aero Glide 4000",
//           category: "Running",
//           price: 180.0,
//           stock: 45,
//           isFeatured: false,
//           imageUrl:
//             "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200",
//           isDeleted: false,
//         },
//         {
//           id: 3,
//           name: "Chelsea Elite",
//           category: "Boots",
//           price: 320.5,
//           stock: 8,
//           isFeatured: true,
//           imageUrl:
//             "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=200",
//           isDeleted: false,
//         },
//       ],
//     };
//   },
//   delete: async (url) => {
//     await new Promise((r) => setTimeout(r, 500));
//     return { success: true };
//   },
//   post: async () => ({ success: true }),
//   put: async () => ({ success: true }),
// };

// --- INTERNAL COMPONENT: ProductFormModal (Restored Style + Drag & Drop) ---
// function ProductFormModal({ isOpen, onClose, onSuccess, product = null }) {
//   const [loading, setLoading] = useState(false);
//   const [preview, setPreview] = useState(null);
//   const [file, setFile] = useState(null);
//   const [dragActive, setDragActive] = useState(false);
//   const fileInputRef = useRef(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     category: "Sneakers",
//     stock: "",
//     description: "",
//   });

//   // Populate data if editing
//   useEffect(() => {
//     if (product) {
//       setFormData({
//         name: product.name || "",
//         price: product.price || "",
//         category: product.category || "Sneakers",
//         stock: product.stock || "",
//         description: product.description || "",
//       });
//       setPreview(product.imageUrl || null);
//     } else {
//       // Reset if adding new
//       setFormData({
//         name: "",
//         price: "",
//         category: "Sneakers",
//         stock: "",
//         description: "",
//       });
//       setPreview(null);
//       setFile(null);
//     }
//   }, [product, isOpen]);

//   if (!isOpen) return null;

//   // --- Drag & Drop Logic ---
//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
//     else if (e.type === "dragleave") setDragActive(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFile(e.dataTransfer.files[0]);
//     }
//   };

//   const handleFile = (selectedFile) => {
//     if (!selectedFile.type.startsWith("image/")) {
//       toast.error("Please upload an image file");
//       return;
//     }
//     setFile(selectedFile);
//     setPreview(URL.createObjectURL(selectedFile));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("price", formData.price);
//       data.append("category", formData.category);
//       data.append("stock", formData.stock);
//       data.append("description", formData.description);

//       if (file) {
//         data.append("imageFile", file);
//       }

//       const url = product
//         ? `/Products/Update-Product/${product.id}`
//         : "/Products/Add-Product";
//       const method = product ? "put" : "post";

//       await api[method](url, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success(`Product ${product ? "updated" : "added"} successfully!`);
//       if (onSuccess) onSuccess();
//       onClose();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to save product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//       <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
//         <div className="p-6 border-b border-slate-700 flex justify-between items-center">
//           <h2 className="text-xl font-bold text-white">
//             {product ? "Edit Product" : "Add New Product"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-slate-400 hover:text-white transition"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Image Upload Area (Drag & Drop) */}
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-slate-300">
//               Product Image
//             </label>
//             <div
//               onDragEnter={handleDrag}
//               onDragLeave={handleDrag}
//               onDragOver={handleDrag}
//               onDrop={handleDrop}
//               onClick={() => fileInputRef.current.click()}
//               className={`relative h-48 w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
//                 dragActive
//                   ? "border-indigo-500 bg-indigo-500/10"
//                   : "border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700"
//               }`}
//             >
//               {preview ? (
//                 <img
//                   src={preview}
//                   alt="Preview"
//                   className="h-full w-full object-contain p-2"
//                 />
//               ) : (
//                 <div className="text-center text-slate-400 p-4">
//                   <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
//                   <p className="text-sm font-medium">
//                     Drag & drop or click to upload
//                   </p>
//                   <p className="text-xs opacity-50 mt-1">JPG, PNG up to 5MB</p>
//                 </div>
//               )}
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 className="hidden"
//                 accept="image/*"
//                 onChange={(e) =>
//                   e.target.files[0] && handleFile(e.target.files[0])
//                 }
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-slate-300">
//                 Name
//               </label>
//               <input
//                 required
//                 type="text"
//                 className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-slate-300">
//                 Price ($)
//               </label>
//               <input
//                 required
//                 type="number"
//                 step="0.01"
//                 className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 value={formData.price}
//                 onChange={(e) =>
//                   setFormData({ ...formData, price: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-slate-300">
//                 Category
//               </label>
//               <select
//                 className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 value={formData.category}
//                 onChange={(e) =>
//                   setFormData({ ...formData, category: e.target.value })
//                 }
//               >
//                 <option>Sneakers</option>
//                 <option>Boots</option>
//                 <option>Formals</option>
//                 <option>Running</option>
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-slate-300">
//                 Stock
//               </label>
//               <input
//                 required
//                 type="number"
//                 className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 value={formData.stock}
//                 onChange={(e) =>
//                   setFormData({ ...formData, stock: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-slate-300">
//               Description
//             </label>
//             <textarea
//               rows="3"
//               className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//             />
//           </div>

//           <div className="flex gap-4 pt-4 border-t border-slate-700">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 bg-slate-700 text-white py-2.5 rounded-lg hover:bg-slate-600 transition font-semibold"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-semibold flex justify-center items-center gap-2 disabled:opacity-50"
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin" size={20} />
//               ) : product ? (
//                 "Save Changes"
//               ) : (
//                 "Create Product"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// ============================================================================
// --- MAIN PRODUCT MANAGEMENT COMPONENT ---
// ============================================================================

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let endpoint;
      if (searchQuery) {
        endpoint = `${
          import.meta.env?.VITE_API_URL || ""
        }/Products/Admin-Search?query=${searchQuery}`;
      } else {
        endpoint = `${
          import.meta.env?.VITE_API_URL || ""
        }/Products/Admin-Products`;
      }

      const response = await api.get(endpoint);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (productId) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4 p-2">
          <p className="font-semibold text-center text-white text-sm">
            Are you sure you want to delete this product?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-semibold bg-slate-600 text-white rounded-md hover:bg-slate-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                confirmDelete(productId);
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      ),
      {
        id: "product-delete-confirmation",
        duration: 4000,
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #334155",
        },
      }
    );
  };

  const confirmDelete = async (productId) => {
    try {
      await api.delete(
        `${
          import.meta.env?.VITE_API_URL || ""
        }/Products/Delete-Product/${productId}`
      );
      toast.success("Product deleted successfully.");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product: ", error);
      toast.error("Could not delete product");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  if (loading && products.length === 0) {
    return <div className="p-8 text-white">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">Product Management</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-slate-700 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`border-b border-slate-700 hover:bg-slate-700/50 transition ${
                    product.isDeleted
                      ? "opacity-50 bg-red-900/10 grayscale"
                      : ""
                  }`}
                >
                  <td className="p-4 font-medium flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 object-contain rounded-md bg-white p-1"
                    />
                    <div className="flex flex-col">
                      <span className="text-white">{product.name}</span>
                      {product.isDeleted && (
                        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                          Deleted
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4">{product.category}</td>
                  <td className="p-4">${product.price.toFixed(2)}</td>

                  <td className="p-4 text-center">
                    {product.isFeatured && (
                      <Star
                        size={18}
                        className="text-yellow-400 inline-block fill-yellow-400/20"
                      />
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-4">
                      {!product.isDeleted && (
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-sky-400 hover:text-sky-300 transition"
                        >
                          <Edit size={18} />
                        </button>
                      )}

                      {product.isDeleted ? (
                        <button
                          className="text-slate-500 cursor-not-allowed"
                          disabled
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="text-red-500 hover:text-red-400 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchProducts}
        product={editingProduct}
      />
    </div>
  );
}

export default ProductManagement;
