import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import ProductCard from "../Components/ProductCard";
import ProductModal from "../Components/ProductModal";
import api from "../utils/api";
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  Zap,
  ArrowDown,
} from "lucide-react";

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
    <div className="bg-[#fdfdfd] min-h-screen font-sans selection:bg-indigo-100">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Dynamic Background Accents */}
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-[120px] animate-pulse delay-1000" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Hero Content */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
              <Sparkles className="text-indigo-600" size={14} />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                Exclusivity Redefined
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-7xl md:text-9xl font-black text-gray-900 tracking-tighter leading-[0.85] italic">
                ELEVÉ <br />
                <span className="text-indigo-600 not-italic">STUDIO</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 font-medium tracking-tight max-w-lg leading-relaxed">
                Step into the apex of artisanal footwear. Where heritage
                craftsmanship meets a bold futuristic vision.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button
                onClick={() => navigate("/shop")}
                className="group relative px-12 py-6 bg-gray-900 text-white rounded-full overflow-hidden transition-all hover:scale-105 shadow-2xl shadow-gray-300"
              >
                <div className="relative z-10 flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.2em]">
                  EXPLORE ARCHIVE{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
                <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button
                onClick={() => navigate("/shop")}
                className="px-12 py-6 bg-white border border-gray-100 text-gray-900 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all hover:shadow-lg active:scale-95"
              >
                NEW ARRIVALS
              </button>
            </div>
          </div>

          {/* Hero Image Card */}
          <div className="w-full md:w-1/2 relative group">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-[3s]" />
            <div className="relative rounded-[4rem] overflow-hidden border-[15px] border-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] bg-black">
              <img
                src="https://images.unsplash.com/photo-1560769629-975ec94e6a86"
                alt="Luxury White Sneaker"
                className="w-full h-[600px] object-cover opacity-90 transition-transform duration-[4s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-12 left-12 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={16} className="fill-white" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                    Signature Series 01
                  </span>
                </div>
                {/* Text with heavy drop shadow for luxury feel */}
                <h2 className="text-5xl font-black italic tracking-tighter uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
                  ELEVÉ
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] mt-1">
                  Artisanally Crafted
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
            Scroll
          </span>
          <ArrowDown size={14} className="text-gray-400" />
        </div> */}
      </div>

      {/* --- FEATURED COLLECTION --- */}
      <div className="py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
            <div className="space-y-5 text-left">
              <div className="h-1 w-16 bg-indigo-600 rounded-full" />
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase italic">
                Featured{" "}
                <span className="text-indigo-600 not-italic">Selection</span>
              </h2>
              <p className="text-gray-400 text-sm font-medium tracking-wide max-w-md uppercase leading-relaxed">
                Curated silhouettes defining the contemporary luxury footwear
                landscape this season.
              </p>
            </div>
            <button
              onClick={() => navigate("/shop")}
              className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2 group transition-all"
            >
              View All Archive{" "}
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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

      {/* --- CATEGORY SECTION: ASYMMETRICAL MODERN GRID --- */}
      <div className="py-20 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-50/30 blur-[100px] rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24 space-y-4">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em]">
              Explore Categories
            </p>
            <h2 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
              Shop By <span className="text-indigo-600 not-italic">DNA</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[700px]">
            {/* Sneakers */}
            <div
              onClick={() => handleCategoryClick("Sneakers")}
              className="relative rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl transition-all duration-700"
            >
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                alt="Sneakers"
                className="w-full h-full object-cover transition-transform duration-[0.5s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white text-3xl font-black italic tracking-tighter uppercase">
                    Sneakers
                  </h3>
                  <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                    Urban Essentials
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>

            {/* Performance - Highlighted */}
            <div
              onClick={() => handleCategoryClick("Running")}
              className="relative rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl transition-all duration-700 md:scale-105 z-10 border-[8px] border-white"
            >
              <img
                src="https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8d73cd25-91cc-48fe-9514-7a41daccb7ef/NIKE+VOMERO+PLUS.png"
                alt="Performance"
                className="w-full h-full object-cover transition-transform duration-[0.5s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white text-3xl font-black italic tracking-tighter uppercase">
                    Performance
                  </h3>
                  <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                    Technical Precision
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 shadow-xl flex items-center justify-center text-white group-hover:scale-110 transition-all">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>

            {/* Boots */}
            <div
              onClick={() => handleCategoryClick("Boots")}
              className="relative rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl transition-all duration-700"
            >
              <img
                src="https://egoss.in/cdn/shop/files/DSC_2106_1917a216-f12d-468f-8dd0-3587699ec440.jpg?v=1753876974&width=1950"
                alt="Boots"
                className="w-full h-full object-cover transition-transform duration-[0.5s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white text-3xl font-black italic tracking-tighter uppercase">
                    Boots
                  </h3>
                  <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                    Timeless Elegance
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PROMOTIONAL EXCLUSIVE SECTION --- */}
      <div className="py-40 max-w-7xl mx-auto px-6">
        <div className="relative bg-indigo-600 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(79,70,229,0.2)]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 p-12 md:p-24 items-center">
            <div className="space-y-10 text-left">
              <div className="inline-block px-5 py-2 bg-white/20 backdrop-blur-md rounded-full">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                  Membership Exclusive
                </p>
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.8] italic tracking-tighter">
                ELEVATE <br /> YOUR FIRST.
              </h2>
              <p className="text-indigo-100 text-lg font-medium leading-relaxed max-w-md">
                Secure 20% off your inaugural acquisition. Join the inner circle
                of global footwear luxury today.
              </p>
              <div className="flex items-center gap-8 bg-white/10 backdrop-blur-sm rounded-[2.5rem] p-8 w-fit border border-white/10">
                <div className="text-center min-w-[100px]">
                  <span className="block text-6xl font-black text-white leading-none">
                    20%
                  </span>
                  <span className="block text-[10px] font-bold text-indigo-200 uppercase tracking-widest mt-2">
                    Reduction
                  </span>
                </div>
                <div className="w-[1px] h-16 bg-white/20" />
                <button
                  onClick={() => navigate("/shop")}
                  className="px-12 py-6 bg-white text-indigo-600 font-black text-[11px] uppercase tracking-[0.3em] rounded-full hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                >
                  ACQUIRE NOW
                </button>
              </div>
            </div>

            <div className="relative group perspective-1000">
              <img
                src="https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/21f56016-2e59-4392-b80f-c9440573f798/ZOOMX+VAPORFLY+NEXT%25+4.png"
                alt="Promo Item"
                className="relative w-full max-w-lg mx-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.3)] group-hover:rotate-[10deg] transition-transform duration-1000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER: MINIMALIST LUXE --- */}
      <footer className="bg-white border-t border-gray-100 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
            <div className="col-span-1 space-y-8">
              <h3 className="text-4xl font-black text-indigo-600 italic tracking-tighter">
                ELEVÉ
              </h3>
              <p className="text-gray-400 text-[11px] font-bold leading-relaxed uppercase tracking-[0.2em]">
                Designing the future of human motion through exclusive
                artisan-engineered silhouettes for the discerning individual.
              </p>
              <div className="flex gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all cursor-pointer"
                  >
                    <Zap size={16} />
                  </div>
                ))}
              </div>
            </div>

            {["Collection", "Support", "Universe"].map((col) => (
              <div key={col} className="space-y-8">
                <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-[0.4em]">
                  {col}
                </h4>
                <ul className="space-y-4">
                  {["Archive 01", "Service Node", "Sustainability"].map(
                    (item) => (
                      <li key={item}>
                        <button className="text-gray-400 text-[11px] font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors">
                          {item}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-50 pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
              © 2025 ELEVÉ STUDIO. ENGINEERED FOR EXCELLENCE.
            </p>
            <div className="flex gap-10">
              {["Terms", "Privacy", "Cookies"].map((item) => (
                <span
                  key={item}
                  className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] cursor-pointer hover:text-indigo-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default Home;
