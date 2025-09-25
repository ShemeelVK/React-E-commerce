import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import ProductCard from "../Components/ProductCard";
import ProductModal from "../Components/ProductModal";
function Home(){
    const navigate=useNavigate();
    const [products,setProducts]=useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(()=>{
      const fetchproducts=async ()=>{
        try{
        const res = await axios.get("http://localhost:3000/products?isFeatured=true ");
        setProducts(res.data);
        console.log("Fetched data:", res.data);
        }
        catch(err){
          console.log('Failed to fetch Products: ',err);
        }

      }
      fetchproducts();
    },[])

      const handleViewProduct = (product) => {
        setSelectedProduct(product);
      };

      const handleCloseModal = () => {
        setSelectedProduct(null);
      };

      const handleCategoryClick = (category) => {
        navigate(`/shop?category=${category}`);
      };

    return (
      <>
        <div
          className="relative min-h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1330&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          {/* Gradient Overlay for a more luxurious feel and better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>

          {/* Place Navbar here so it sits on top of the hero image */}
          <Navbar />

          {/* Hero Content Container */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white px-6">
            <h1
              className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight animate-fade-in-down"
              style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
            >
              Elevé: Luxe in Every Step
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-200 animate-fade-in-down">
              Discover limited-edition sneakers crafted for the elite.
              Unparalleled design, unmatched quality.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-10 px-10 py-4 bg-transparent border-2 border-white rounded-full text-white font-bold tracking-wider uppercase text-sm shadow-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              Shop The Collection
            </button>
          </div>
        </div>

        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
              Featured Collection
            </h2>
            {/* ---Product Grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewProduct={handleViewProduct}
                />
              ))}
            </div>
          </div>
        </div>

        {/* --- Category Section --- */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Category Card: Sneakers */}
              <div
                onClick={() => handleCategoryClick("Sneakers")}
                className="relative rounded-lg overflow-hidden h-80 group cursor-pointer"
              >
                <img
                  src="https://ca-times.brightspotcdn.com/dims4/default/8fe0b21/2147483647/strip/true/crop/6122x4081+0+1/resize/1440x960!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F0b%2F7b%2F5b56302840069c22cf1fa46957be%2F1351750-fi-sneaker-buyer-coolkicks-jlc-16172-009.jpg"
                  alt="Sneakers"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white text-3xl font-bold">Sneakers</h3>
                </div>
              </div>
              {/* Category Card: Running */}
              <div
                onClick={() => handleCategoryClick("Running")}
                className="relative rounded-lg overflow-hidden h-80 group cursor-pointer"
              >
                <img
                  src="https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8d73cd25-91cc-48fe-9514-7a41daccb7ef/NIKE+VOMERO+PLUS.png"
                  alt="Running Shoes"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white text-3xl font-bold">Running</h3>
                </div>
              </div>
              {/* Category Card: Boots */}
              <div
                onClick={() => handleCategoryClick("Boots")}
                className="relative rounded-lg overflow-hidden h-80 group cursor-pointer"
              >
                <img
                  src="https://egoss.in/cdn/shop/files/DSC_2106_1917a216-f12d-468f-8dd0-3587699ec440.jpg?v=1753876974&width=1950"
                  alt="Boots"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white text-3xl font-bold">Boots</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Promotional Banner Section --- */}
        <div className="bg-indigo-700">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-4xl font-extrabold text-white tracking-tight">
                Summer Styles are Here
              </h2>
              <p className="mt-4 text-lg text-indigo-200">
                Check out our latest collection of premium sneakers and boots.
                Get 20% off your first order.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="mt-8 px-8 py-3 bg-white text-indigo-600 hover:bg-gray-100 rounded-full font-semibold shadow-lg transition duration-300"
              >
                Shop New Arrivals
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <img
                src="https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/21f56016-2e59-4392-b80f-c9440573f798/ZOOMX+VAPORFLY+NEXT%25+4.png"
                alt="Promotional"
                className="rounded-lg shadow-2xl w-full max-w-md"
              />
            </div>
          </div>
        </div>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={handleCloseModal} />
        )}
      </>
    );
}
export default Home