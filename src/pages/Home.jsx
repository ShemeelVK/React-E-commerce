import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import ProductCard from "../Components/ProductCard";
import ProductModal from "../Components/ProductModal";
import api from "../utils/api";

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchproducts = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_API_URL}/Products/Featured-Products`
        );
        setProducts(res.data);
        console.log("Fetched data:", res.data);
      } catch (err) {
        console.log("Failed to fetch Products: ", err);
      }
    };
    fetchproducts();
  }, []);

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
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1330&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Decorative Elements */}
        {/* <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse"></div> */}

        {/* Navbar */}
        <div className="relative z-50">
          <Navbar />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 -mt-5">
          <div className="max-w-5xl mx-auto">
            <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-purple-300/30">
              <span className="text-purple-300 text-sm font-semibold tracking-widest uppercase">
                Limited Edition Collection
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Elevé
            </h1>
            <p className="text-3xl md:text-4xl mb-4 font-light text-white">
              Luxe in Every Step
            </p>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 text-gray-300 leading-relaxed">
              Where craftsmanship meets exclusivity. Discover limited-edition
              footwear designed for those who refuse to blend in.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/shop")}
                className="px-12 py-4 bg-purple-600 text-white font-semibold rounded-full tracking-wider uppercase text-sm shadow-lg hover:bg-purple-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Explore Collection
              </button>
              <button
                onClick={() => navigate("/shop")}
                className="px-12 py-4 border-2 border-white/40 text-white font-semibold rounded-full tracking-wider uppercase text-sm hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                New Arrivals
              </button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Collection */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-semibold tracking-widest uppercase text-sm">
              Curated Selection
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Handpicked styles that define contemporary luxury
            </p>
          </div>

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

      {/* Shop by Category Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-semibold tracking-widest uppercase text-sm">
              Explore
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sneakers Category */}
            <div
              onClick={() => handleCategoryClick("Sneakers")}
              className="relative rounded-2xl overflow-hidden h-96 group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src="https://ca-times.brightspotcdn.com/dims4/default/8fe0b21/2147483647/strip/true/crop/6122x4081+0+1/resize/1440x960!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F0b%2F7b%2F5b56302840069c22cf1fa46957be%2F1351750-fi-sneaker-buyer-coolkicks-jlc-16172-009.jpg"
                alt="Sneakers"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
                <h3 className="text-white text-3xl font-bold mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">
                  Sneakers
                </h3>
                <p className="text-purple-200 text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore Collection →
                </p>
              </div>
            </div>

            {/* Running Category */}
            <div
              onClick={() => handleCategoryClick("Running")}
              className="relative rounded-2xl overflow-hidden h-96 group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src="https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8d73cd25-91cc-48fe-9514-7a41daccb7ef/NIKE+VOMERO+PLUS.png"
                alt="Running Shoes"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-indigo-900/40 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
                <h3 className="text-white text-3xl font-bold mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">
                  Running
                </h3>
                <p className="text-indigo-200 text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore Collection →
                </p>
              </div>
            </div>

            {/* Boots Category */}
            <div
              onClick={() => handleCategoryClick("Boots")}
              className="relative rounded-2xl overflow-hidden h-96 group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src="https://egoss.in/cdn/shop/files/DSC_2106_1917a216-f12d-468f-8dd0-3587699ec440.jpg?v=1753876974&width=1950"
                alt="Boots"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
                <h3 className="text-white text-3xl font-bold mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">
                  Boots
                </h3>
                <p className="text-purple-200 text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore Collection →
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banner Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <span className="text-white text-xs font-bold tracking-widest uppercase">
                  🎉 Seasonal Offer
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Summer Styles
                <br />
                Are Here
              </h2>
              <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                Step into the season with our latest collection of premium
                footwear. Exclusive designs, exceptional comfort.
              </p>
              <div className="flex items-center gap-6 mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-fit">
                <div className="text-6xl font-black text-white">20%</div>
                <div className="text-white">
                  <div className="text-2xl font-bold">OFF</div>
                  <div className="text-purple-200">Your First Order</div>
                </div>
              </div>
              <button
                onClick={() => navigate("/shop")}
                className="px-10 py-4 bg-white text-purple-600 font-semibold rounded-full tracking-wider uppercase text-sm shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
              >
                Shop New Arrivals
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-purple-300/30 blur-3xl rounded-full"></div>
              <img
                src="https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/21f56016-2e59-4392-b80f-c9440573f798/ZOOMX+VAPORFLY+NEXT%25+4.png"
                alt="Promotional"
                className="relative w-full max-w-lg mx-auto transform hover:scale-105 hover:rotate-3 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="col-span-1">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                Elevé
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Premium footwear crafted for those who demand excellence in
                every step.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors duration-300"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors duration-300"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors duration-300"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors duration-300"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Shop Column */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">
                Shop
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    Sneakers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    Running Shoes
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    Boots
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    Sale
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">
                Support
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    Size Guide
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-200"
                  >
                    Sustainability
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t border-gray-800 pt-12 mb-12">
            <div className="max-w-xl">
              <h4 className="text-white font-bold text-xl mb-3">
                Stay in the Loop
              </h4>
              <p className="text-gray-400 mb-6">
                Subscribe to receive exclusive offers, new arrivals, and style
                inspiration.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-full border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors duration-200"
                />
                <button className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Elevé. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-gray-500 hover:text-purple-400 transition-colors duration-200"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-purple-400 transition-colors duration-200"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-purple-400 transition-colors duration-200"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default Home;
