import Navbar from "../Components/Navbar";
import ProductModal from "../Components/ProductModal";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";
import { useState } from "react";
import { X, ShoppingCart, ArrowRight } from "lucide-react";

function Wishlist() {
  // Existing Functionality Preserved
  const { wishlistItems, removeFromWishlist } = useWishlist([]);
  const { addToCart, cartItems } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewProduct = (product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-black selection:text-white">
      <Navbar />

      <div className="max-w-[1400px] mx-auto py-24 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 pt-10">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase mb-4">
            My Wishlist
          </h1>
          <p className="text-xs font-bold tracking-[0.3em] text-neutral-400 uppercase">
            Curated Selection • {wishlistItems.length} Items
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart size={32} className="text-neutral-300" />
            </div>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-2">
              Your List is Empty
            </h2>
            <p className="text-neutral-500 text-sm max-w-xs mx-auto mb-8 font-medium">
              Start exploring our collection to build your personal wardrobe.
            </p>
            <a
              href="/shop"
              className="group flex items-center gap-2 border-b-2 border-black pb-1 text-xs font-bold tracking-widest uppercase hover:text-indigo-600 hover:border-indigo-600 transition-colors"
            >
              Start Shopping{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => {
              const isInCart = cartItems.some((item) => item.id === product.id);
              return (
                <div
                  key={product.id}
                  className="group relative w-full bg-white rounded-[1.5rem] overflow-hidden border border-neutral-100 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1"
                >
                  {/* Clickable Area for Modal */}
                  <div
                    onClick={() => handleViewProduct(product)}
                    className="cursor-pointer block"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                    </div>

                    {/* Info Container */}
                    <div className="p-5 flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                        {product.category}
                      </span>

                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-sm font-bold text-neutral-900 leading-snug uppercase tracking-wide line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold text-indigo-600 tracking-tight shrink-0">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Floating Glass Effect */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
                    {/* Remove from Wishlist */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(product.id);
                      }}
                      className="p-3 rounded-full backdrop-blur-xl bg-white/80 border border-white/50 shadow-lg text-neutral-500 hover:text-red-500 hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
                      title="Remove"
                    >
                      <X size={18} strokeWidth={2} />
                    </button>

                    {/* Add to Cart (Conditional) */}
                    {!isInCart && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="p-3 rounded-full backdrop-blur-xl bg-white/80 border border-white/50 shadow-lg text-neutral-500 hover:text-indigo-600 hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
                        title="Add to Cart"
                      >
                        <ShoppingCart size={18} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default Wishlist;
