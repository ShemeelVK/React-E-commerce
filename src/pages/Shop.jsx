import Navbar from "../Components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";

// Define your categories in an array for easy mapping
const categories = ["All", "Sneakers", "Running", "Boots"];

function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All"); // State to track the active category

  // 1. Fetch all products just once when the component mounts
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/products");
        setProducts(res.data);
        setFilteredProducts(res.data); // Initially, show all products
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchAllProducts();
  }, []); // Empty dependency array means this runs only once

  // 2. This effect runs whenever the selectedCategory or the main products list changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products); // If 'All' is selected, show all products
    } else {
      // Otherwise, filter the main products list and update the filtered list
      const filtered = products.filter(
        (product) => product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]); // Re-run this logic when these values change

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 pt-28">
        {/* --- Category Filter Buttons --- */}
        <div className="flex justify-center space-x-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-colors ${
                selectedCategory === category
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
export default Shop;
