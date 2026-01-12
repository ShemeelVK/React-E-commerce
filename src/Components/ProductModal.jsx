import { Heart, ShoppingCart, X, Star, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ============================================================================
// ⚠️ IMPORTANT: UNCOMMENT YOUR REAL IMPORTS IN YOUR PROJECT
// ============================================================================
import { useCart } from "../Context/CartContext.jsx";
import { useWishlist } from "../Context/WishlistContext.jsx";

// --- TEMPORARY MOCKS FOR PREVIEW (DELETE IN YOUR APP) ---
// const useCart = () => ({
//   addToCart: () => console.log("Add to cart"),
//   cartItems: [],
// });
// const useWishlist = () => ({
//   addToWishlist: () => console.log("Add to wishlist"),
//   wishlistItems: [],
// });
// ============================================================================

function ProductModal({ product, onClose }) {
  const { addToCart, cartItems } = useCart();
  const { addToWishlist, wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const isInCart = product && cartItems.some((item) => item.id === product.id);
  const isInWishlist =
    product && wishlistItems.some((item) => item.id === product.id);

  const stock = product.stock !== undefined ? product.stock : 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < 10;

  if (!product) return null;

  return (
    // The Modal Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-md transition-all duration-300"
    >
      {/* The Modal Content */}
      <div
        onClick={handleModalContentClick}
        className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh] md:max-h-[650px] animate-in fade-in zoom-in-95 duration-300 border border-white/50"
      >
        {/* Close Button - Floating Glass */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-neutral-400 hover:text-black hover:bg-white hover:shadow-lg transition-all duration-300"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Left Side: Product Image */}
        <div className="w-full md:w-1/2 bg-neutral-50 relative flex items-center justify-center p-8 md:p-12 overflow-hidden group">
          {/* Background Decor */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <img
            src={product.imageUrl}
            alt={product.name}
            className="relative z-10 w-full max-h-[300px] md:max-h-[450px] object-contain drop-shadow-xl transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-black text-white px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase border border-neutral-200 transform -rotate-12 shadow-2xl">
                Sold Out
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative overflow-y-auto">
          <div className="space-y-6">
            {/* Header: Category & Rating */}
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-bold tracking-[0.2em] text-indigo-600 uppercase">
                {product.category}
              </p>
              {product.isFeatured && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-white rounded-full">
                  <Star
                    size={10}
                    fill="currentColor"
                    className="text-yellow-400"
                  />
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Title & Desc */}
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-neutral-900 leading-tight tracking-tight mb-3 uppercase">
                {product.name}
              </h1>
              <p className="text-neutral-500 text-sm leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* Price Row */}
            <div className="flex items-center gap-4 border-y border-neutral-100 py-6">
              <p className="text-4xl font-bold text-neutral-900 tracking-tight">
                ${product.price}
              </p>

              {/* Stock Status Pill */}
              {!isOutOfStock ? (
                <div
                  className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border ${
                    isLowStock
                      ? "bg-orange-50 text-orange-600 border-orange-100"
                      : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}
                >
                  {isLowStock ? `Low Stock: ${stock} Left` : "In Stock"}
                </div>
              ) : (
                <div className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-50 text-red-600 border border-red-100">
                  Unavailable
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => {
                  if (isOutOfStock) return;
                  isInCart ? navigate("/cart") : addToCart(product);
                }}
                disabled={isOutOfStock}
                className={`flex-1 py-4 px-6 rounded-full font-bold text-xs tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm
                  ${
                    isOutOfStock
                      ? "bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none"
                      : isInCart
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-black text-white hover:bg-indigo-600"
                  }`}
              >
                {isInCart ? <Check size={18} /> : <ShoppingCart size={18} />}
                <span>
                  {isOutOfStock
                    ? "Out of Stock"
                    : isInCart
                    ? "Checkout Now"
                    : "Add to Cart"}
                </span>
              </button>

              <button
                onClick={() => addToWishlist(product)}
                className={`group p-4 rounded-full border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                  ${
                    isInWishlist
                      ? "bg-red-50 border-red-100 text-red-500"
                      : "bg-white border-neutral-200 text-neutral-400 hover:border-red-200 hover:text-red-500"
                  }`}
                aria-label="Add to wishlist"
              >
                <Heart
                  size={20}
                  className={`transition-transform duration-300 ${
                    isInWishlist ? "fill-current" : "group-hover:scale-110"
                  }`}
                  fill={isInWishlist ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
