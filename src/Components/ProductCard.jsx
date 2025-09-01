import { Heart,ShoppingCart } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";
function ProductCard({product}){
    const {name,category,price,imageUrl}=product;
    const {addToCart}=useCart();
    const {addToWishlist}=useWishlist();

    return (
      <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="w-full h-64 overflow-hidden">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{category}</p>
          <p className="text-xl font-bold text-indigo-600">${price}</p>
        </div>
        {/* Add to Cart / Wishlist Buttons (initially hidden) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={()=> addToWishlist(product)} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
            <Heart className="w-5 h-5 text-red-500" />
          </button>
          <button onClick={()=> addToCart(product)} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
          </button>
        </div>
      </div>
    );
}
export default ProductCard