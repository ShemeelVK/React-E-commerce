import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Edit, Trash2, Star ,Search} from "lucide-react";
import ProductFormModal from "../../Components/Admin/ProductFormModal.jsx";
import toast from "react-hot-toast";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); 


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products`
      );
      setProducts(response.data);
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
  const handleDeleteProduct = async (productId) => {
    if (
      toast("Are you sure you want to delete this product?", {
        icon: "⚠️",
        style: { background: "#fcbe03", color: "white" },
      })
    ) 

    {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/products/${productId}`
        );
        toast.success("Product deleted successfully.");
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast.error("An error occurred while deleting the product.");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

const filteredproducts=products.filter((product)=>
  product.name.toLowerCase().includes(searchQuery.toLowerCase())
)

  if (loading) {
    return <div className="text-white">Loading products...</div>;
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
              {filteredproducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-700 hover:bg-slate-700/50"
                >
                  <td className="p-4 font-medium flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 object-contain rounded-md bg-white p-1"
                    />
                    <span>{product.name}</span>
                  </td>
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
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-sky-400 hover:text-sky-300"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
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
