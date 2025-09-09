import Navbar from "../Components/Navbar";
import { useState, useEffect } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import ProductModal from "../Components/ProductModal";


const categories = ["All", "Sneakers", "Running", "Boots"];

function Shop() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const location = useLocation();
  const navigate=useNavigate();


    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category") || "All";


  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/products");
        setProducts(res.data); 
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchAllProducts();
  }, []);

  const filteredProducts =
    categoryFromUrl === "All" ? products : products.filter((p) => p.category === categoryFromUrl);

  const handleViewproduct = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handlecategorychange=(category)=>{
    navigate(`/shop?category=${category}`);
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 pt-28">
        {/* --- Category Filter Buttons --- */}
        <div className="flex justify-center space-x-4 mb-12 mt-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handlecategorychange(category)}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-colors ${
                categoryFromUrl === category
                  ? "bg-indigo-600 text-white shadow" // Style for the active button
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300" // Style for inactive buttons
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* --- Product Grid --- */}
        {/* This now maps over the 'filteredProducts' state */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={handleViewproduct}
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </>
  );
}
export default Shop;
