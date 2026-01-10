import { useState, useEffect ,useRef} from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard.jsx";
import ProductModal from "../Components/ProductModal.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SearchX, ArrowUpDown, ChevronDown, } from "lucide-react";
import Navbar from "../Components/Navbar.jsx";
import api from "../utils/api.js";
import toast from "react-hot-toast";

const categories = ["All", "Sneakers", "Running", "Boots"];

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading,setLoading]=useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOrder,setSortOrder]=useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const categoryFromUrl = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("q");

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {

        let endpoint="";
        if(searchQuery){
          endpoint=`/Products/Search?query=${searchQuery}`;
        }
        else if(categoryFromUrl === "All"){
          endpoint =`/Products/Get-All-Product`;
        }
        else{
          endpoint =`/Products/Product-By-Category?category=${categoryFromUrl}`;
        }

        if(sortOrder){
          const separator=endpoint.includes("?") ? "&" : "?";
          endpoint += `${separator}sortOrder=${sortOrder}`;
        }

        const response=await api.get(endpoint);
        

        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("failed to load products")
      }
      finally{
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [categoryFromUrl,searchQuery,sortOrder]);

  const displayProducts=products;

  // useEffect(() => {
  //   let itemsToDisplay = [...products];
  //   if (searchQuery) {
  //     itemsToDisplay = itemsToDisplay.filter((product) =>
  //       product.name.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   } else if (categoryFromUrl && categoryFromUrl !== "All") {
  //     itemsToDisplay = itemsToDisplay.filter(
  //       (product) => product.category === categoryFromUrl
  //     );
  //   }
  //   setFilteredProducts(itemsToDisplay);
  // }, [searchQuery, categoryFromUrl, products]);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleCategoryChange = (category) => {
    navigate(`/shop?category=${category}`);
    setSortOrder("");
  };

  const getSortLabel = () => {
    if (sortOrder === "lowToHigh") return "Price: Low to High";
    if (sortOrder === "highToLow") return "Price: High to Low";
    return "Sort by Price";
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto py-28 px-4">
        {/* --- CONTROLS HEADER --- */}
        <div className="relative z-40 mb-12 flex flex-col md:block">
          {/* 1. Categories (Centered) */}
          {/* We use 'md:absolute md:inset-x-0' to layer it, but simpler is to just text-center the container 
              and position the sort button absolutely on the right. */}

          <div className="flex justify-center order-2 md:order-1 mt-4 md:mt-0">
            <div className="inline-flex bg-gray-100 p-1.5 rounded-full shadow-inner gap-1 overflow-x-auto max-w-full">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                    categoryFromUrl === category && !searchQuery
                      ? "bg-indigo-600 text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex justify-end md:absolute md:top-1/2 md:-translate-y-1/2 md:right-0 order-1 md:order-2">
            <div className="relative w-full md:w-52" ref={sortRef}>
              {/* The "Select Box" Button */}
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={`w-full flex justify-between items-center bg-white border text-gray-700 py-2.5 pl-4 pr-3 rounded-xl shadow-sm focus:outline-none transition-all ${
                  isSortOpen
                    ? "border-indigo-500 ring-2 ring-indigo-100"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <span className="font-medium text-sm truncate">
                  {getSortLabel()}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform duration-200 ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* The "Options List" (Visible only when Open) */}
              {isSortOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl  overflow-hidden">
                  <ul className="py-1">
                    {/* Option: Default */}
                    <li>
                      <button
                        onClick={() => {
                          setSortOrder("");
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          sortOrder === ""
                            ? "text-indigo-600 bg-indigo-50 font-semibold"
                            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        }`}
                      >
                        Default
                      </button>
                    </li>

                    {/* Option: Low to High */}
                    <li>
                      <button
                        onClick={() => {
                          setSortOrder("lowToHigh");
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          sortOrder === "lowToHigh"
                            ? "text-indigo-600 bg-indigo-50 font-semibold"
                            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        }`}
                      >
                        Price: Low to High
                      </button>
                    </li>

                    {/* Option: High to Low */}
                    <li>
                      <button
                        onClick={() => {
                          setSortOrder("highToLow");
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          sortOrder === "highToLow"
                            ? "text-indigo-600 bg-indigo-50 font-semibold"
                            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        }`}
                      >
                        Price: High to Low
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title for Search Results */}
        {searchQuery && (
          <h2 className="text-2xl font-bold text-center mb-8">
            Search Results for: "{searchQuery}"
          </h2>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={handleViewProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-white rounded-lg shadow-md">
            <SearchX size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No Products Found
            </h2>
            <p className="text-gray-500 mb-8">
              {searchQuery
                ? `Sorry, we couldn't find any products matching "${searchQuery}".`
                : `No products found in the category "${categoryFromUrl}".`}
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition"
            >
              View All Products
            </button>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default Shop;
