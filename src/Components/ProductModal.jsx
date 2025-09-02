import { Heart, ShoppingCart, X } from "lucide-react";
import { useCart } from "../Context/CartContext.jsx";
import { useWishlist } from "../Context/WishlistContext.jsx";


function ProductModal({ product, onClose }) {
  const { addToCart, cartItems } = useCart();
  const { addToWishlist, wishlistItems } = useWishlist();


  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const isInCart = product && cartItems.some((item) => item.id === product.id);
  const isInWishlist = product && wishlistItems.some((item) => item.id === product.id);

  return (
    // The Modal Backdrop (the greyed-out background)
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50  z-50 flex items-center justify-center p-4"
    >
      {/* The Modal Content */}
      <div
        onClick={handleModalContentClick}
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full relative animate-fade-in-up max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition z-10"
          aria-label="Close"
        >
          <X size={28} />
        </button>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8">
          {/* Left Side: Product Image */}
          <div className="bg-gray-100 rounded-lg flex items-center justify-center p-4 md:p-8">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-[250px] md:max-h-[400px] object-contain"
            />
          </div>

          {/* Right Side: Product Details */}
          <div className="flex flex-col justify-center">
            <p className="text-indigo-600 font-semibold mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              {product.description}
            </p>
            <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              ${product.price}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{isInCart ? "Proceed to Cart" : "Add to Cart"}</span>
              </button>
              <button
                onClick={() => addToWishlist(product)}
                className="p-3 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition"
                aria-label="Add to wishlist"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isInWishlist ? "text-red-500" : "text-gray-500"
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
