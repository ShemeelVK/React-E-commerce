import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard.jsx";
import ProductModal from "../Components/ProductModal.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";
import Navbar from "../Components/Navbar.jsx";

const categories = ["All", "Sneakers", "Running", "Boots"];

function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryFromUrl = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("q");

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    let itemsToDisplay = [...products];
    if (searchQuery) {
      itemsToDisplay = itemsToDisplay.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (categoryFromUrl && categoryFromUrl !== "All") {
      itemsToDisplay = itemsToDisplay.filter(
        (product) => product.category === categoryFromUrl
      );
    }
    setFilteredProducts(itemsToDisplay);
  }, [searchQuery, categoryFromUrl, products]);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleCategoryChange = (category) => {
    navigate(`/shop?category=${category}`);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto py-28 px-4">
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-colors ${
                categoryFromUrl === category && !searchQuery
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {searchQuery && (
          <h2 className="text-2xl font-bold text-center mb-8">
            Search Results for: "{searchQuery}"
          </h2>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={handleViewProduct}
              />
            ))}
          </div>
        ) : (
          searchQuery && (
            <div className="text-center py-20 px-6 bg-white rounded-lg shadow-md">
              <SearchX size={80} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                No Products Found
              </h2>
              <p className="text-gray-500 mb-8">
                Sorry, we couldn't find any products matching your search for "
                {searchQuery}".
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition"
              >
                View All Products
              </button>
            </div>
          )
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default Shop;
