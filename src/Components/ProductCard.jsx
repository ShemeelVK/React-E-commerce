import React from "react";
import { Heart, ShoppingCart, Star, Plus } from "lucide-react";

// ============================================================================
// ⚠️ IMPORTANT: UNCOMMENT YOUR REAL IMPORTS IN YOUR PROJECT
// ============================================================================
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";
import toast from "react-hot-toast";

// --- TEMPORARY MOCKS FOR PREVIEW (DELETE IN YOUR APP) ---
// const useCart = () => ({
//   addToCart: () => console.log("Add to cart"),
//   cartItems: [],
// });
// const useWishlist = () => ({
//   addToWishlist: () => console.log("Add to wishlist"),
//   wishlistItems: [],
// });
// const toast = { success: () => {} };
// ============================================================================

function ProductCard({ product, onViewProduct }) {
  const { name, category, price, imageUrl, isFeatured } = product;
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  const isInCart = cartItems.some((item) => item.id === product.id);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  return (
    <div className="group relative w-full bg-white rounded-[1.5rem] overflow-hidden border border-neutral-100 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1">
      {/* Clickable Main Area */}
      <div
        onClick={() => onViewProduct(product)}
        className="cursor-pointer block"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
          {/* Subtle overlay on hover to make text pop if needed, keeping it minimal */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        </div>

        {/* Info Container */}
        <div className="p-5 flex flex-col gap-1.5">
          {/* Category Label */}
          <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
            {category}
          </span>

          {/* Name & Price */}
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-sm font-bold text-neutral-900 leading-snug uppercase tracking-wide line-clamp-2 group-hover:text-indigo-900 transition-colors">
              {name}
            </h3>
            <p className="text-lg font-bold text-indigo-600 tracking-tight shrink-0">
              ${price}
            </p>
          </div>
        </div>
      </div>

      {/* Featured Badge - Premium Pill Style */}
      {isFeatured && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-black/90 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 tracking-widest uppercase shadow-lg">
            <Star size={10} className="text-yellow-400" fill="currentColor" />
            <span className="text-md">Featured</span>
          </div>
        </div>
      )}

      {/* Action Buttons - Floating Glass Effect */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            addToWishlist(product);
          }}
          className={`p-3 rounded-full backdrop-blur-xl border border-white/50 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
            isInWishlist
              ? "bg-white text-red-500 border-red-100"
              : "bg-white/80 text-neutral-500 hover:text-red-500 hover:bg-white"
          }`}
          title="Add to Wishlist"
        >
          <Heart
            size={18}
            fill={isInWishlist ? "currentColor" : "none"}
            strokeWidth={isInWishlist ? 0 : 2}
          />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            addToCart(product);
          }}
          className={`p-3 rounded-full backdrop-blur-xl border border-white/50 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
            isInCart
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white/80 text-neutral-500 hover:text-indigo-600 hover:bg-white"
          }`}
          title="Add to Cart"
        >
          <ShoppingCart
            size={18}
            fill={isInCart ? "currentColor" : "none"}
            strokeWidth={2}
          />
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
