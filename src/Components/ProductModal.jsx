import { Heart, ShoppingCart, X, Star } from "lucide-react";
import { useCart } from "../Context/CartContext.jsx";
import { useWishlist } from "../Context/WishlistContext.jsx";
import { useNavigate } from "react-router-dom";


function ProductModal({ product, onClose }) {
  const { addToCart, cartItems } = useCart();
  const { addToWishlist, wishlistItems } = useWishlist();
  const navigate=useNavigate();

  // console.log("renderes")

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const isInCart = product && cartItems.some((item) => item.id === product.id);
  const isInWishlist = product && wishlistItems.some((item) => item.id === product.id);

  const stock = product.stock !== undefined ? product.stock : 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < 10;

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
            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-red-600 text-white px-4 py-2 text-lg font-bold rounded shadow-lg transform -rotate-12">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>

          {/* Right Side: Product Details */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <p className="text-indigo-600 font-semibold mb-2">
                {product.category}
              </p>
              {product.isFeatured && (
                <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 mb-2">
                  <Star size={12} />
                  <span>Featured</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              {product.description}
            </p>

            {/* Price and Stock Status Row */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-4xl md:text-5xl font-bold text-gray-900">
                ${product.price}
              </p>
              {/* Stock Availability Indicator */}
              {!isOutOfStock ? (
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    isLowStock
                      ? "text-orange-600 bg-orange-100"
                      : "text-green-600 bg-green-100"
                  }`}
                >
                  {isLowStock
                    ? `Limited Stock only: ${stock} left!`
                    : "In Stock"}
                </span>
              ) : (
                <span className="text-sm font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              ${product.price}
            </p> */}
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (isOutOfStock) return;
                  isInCart ? navigate("/cart") : addToCart(product);
                }}
                disabled={isOutOfStock}
                className={`flex-1 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition flex items-center justify-center gap-2 
                  ${
                    isOutOfStock
                      ? "bg-gray-400 cursor-not-allowed"
                      : isInCart
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {isOutOfStock
                    ? "Sold Out"
                    : isInCart
                    ? "Proceed to Cart"
                    : "Add to Cart"}
                </span>
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
