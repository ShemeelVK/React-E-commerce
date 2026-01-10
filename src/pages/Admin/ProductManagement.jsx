import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Edit, Trash2, Star, Search, Loader2 } from "lucide-react";
import ProductFormModal from "../../Components/Admin/ProductFormModal.jsx";
import toast from "react-hot-toast";
import api from "../../utils/api.js";

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
          import.meta.env.VITE_API_URL
        }/Products/Admin-Search?query=${searchQuery}`;
      } else {
        endpoint = `${import.meta.env.VITE_API_URL}/Products/Admin-Products`;
      }
      const response = await api.get(
        endpoint
      );
      setProducts(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // add product
  const handleAddProduct = () => {
    setEditingProduct(null); 
    setIsModalOpen(true);
  };
// edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Delete product
  const handleDeleteClick = (productId) => {
   toast(
     (t) => (
      
       <div className="flex flex-col items-center gap-4 p-2">
         
         <p className="font-semibold text-center text-white">
           Are you sure you want to delete this product?
         </p>
       
         <div className="flex gap-4">
           {/* LEFT BUTTON: Cancel */}
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
       position: "top-center",
       duration: 3000,
      
       style: {
         background: "#1f2937", 
         color: "#fff",
         border: "1px solid #334155",
       },
     }
   );
  };

  const confirmDelete=async (productId) => {
    try {
      await api.delete(
        `${import.meta.env.VITE_API_URL}/Products/Delete-Product/${productId}`
      );
      console.log(productId)
      toast.success("Product deleted successfully.");
      fetchProducts(searchQuery);
    } catch (error) {
      console.error("Failed to delete product: ",error)
      toast.error("Could not delete product")
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  if (loading) {
     <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-slate-500" />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Product Management</h1>
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
          className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <PlusCircle size={20} />
          <span>Add New Product</span>
        </button>
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
                  // CONDITIONAL STYLING: If deleted, reduce opacity and add a red tint
                  className={`border-b border-slate-700 hover:bg-slate-700/50 transition
        ${product.isDeleted ? "opacity-50 bg-red-900/10 grayscale" : ""}
      `}
                >
                  <td className="p-4 font-medium flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 object-contain rounded-md bg-white p-1"
                    />
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      {/* Small badge if deleted */}
                      {product.isDeleted && (
                        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                          Deleted
                        </span>
                      )}
                    </div>
                  </td>

                  {/* ... Category, Price, Featured columns */}
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">${product.price.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    {product.isFeatured && (
                      <Star
                        size={18}
                        className="text-yellow-400 inline-block"
                      />
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-4">
                      {/* Disable Edit if deleted? Or allow restore? */}
                      {!product.isDeleted && (
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-sky-400 hover:text-sky-300"
                        >
                          <Edit size={18} />
                        </button>
                      )}

                      {/* Change Trash Icon logic */}
                      {product.isDeleted ? (
                        <button
                          className="text-slate-500 cursor-not-allowed"
                          disabled
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteClick(product.id)} // Use new Toast function
                          className="text-red-500 hover:text-red-400"
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

      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={handleCloseModal}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
}

export default ProductManagement;
