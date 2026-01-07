import Navbar from "../Components/Navbar";
import ProductModal from "../Components/ProductModal";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";
import { useState } from "react";
import { X, ShoppingCart } from "lucide-react";

function Wishlist() {
  
  const { wishlistItems, removeFromWishlist } = useWishlist([]);
  const { addToCart, cartItems } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewProduct = (product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto py-12 px-4 pt-28">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center mt-8">
          My Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Your wishlist is empty.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map((product) => {
              const isInCart = cartItems.some((item) => item.id === product.id);
              return (
                <div
                  key={product.id}
                  className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Product Info */}
                  <div
                    onClick={() => handleViewProduct(product)}
                    className="cursor-pointer"
                  >
                    <div className="w-full h-64 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {product.category}
                      </p>
                      <p className="text-xl font-bold text-indigo-600">
                        ${product.price}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons (only on card) */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) =>{
                        e.stopPropagation();
                        removeFromWishlist(product.id);
                      }}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                    >
                      <X className="w-5 h-5 text-red-500" />
                    </button>

                    {!isInCart && (
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                      >
                        <ShoppingCart className="w-5 h-5 text-indigo-600" />
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
    </>
  );
}

export default Wishlist;
