import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ShoppingCart, Heart, User,LogOut } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";
import { useAuth } from "../Context/AuthContext";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const {currentUser,logoutUser}=useAuth();
  const {cartItems}=useCart();
  const { wishlistItems } = useWishlist();

  const cartCount=cartItems?.length || 0;
  const wishlistCount =wishlistItems?.length || 0;

  const isCartpage=location.pathname==="/Cart"
  const isWishlistpage=location.pathname==="/Wishlist"

  function handlelogout() {
    logoutUser()
  }


  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-4/5 z-50 bg-gray-50 rounded-full shadow-lg border border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* --- Left Side Group: Brand and Navigation Links --- */}
        <div className="flex items-center gap-10">
          {/* Brand */}
          <div className="text-2xl font-extrabold tracking-wide text-indigo-700">
            E l e v é
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-10 ml-12">
            {["Home", "Shop", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item}`}
                className="relative text-gray-800 font-medium hover:text-indigo-700 transition-colors duration-300 group"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-700 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>

        {/* --- Right Side Group: Search and Action Icons --- */}
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="hidden md:flex mr-10">
            <div className="relative w-64 lg:w-80">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              />
              <svg
                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M5.5 11a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z"
                ></path>
              </svg>
            </div>
          </div>

          {/* Actions: Wishlist, Cart, Profile */}
          <div className="flex items-center space-x-10">
            {/* Wishlist */}
            <button onClick={() => navigate("/Wishlist")} className="relative">
              <Heart
                className={`w-6 h-6 ${
                  isWishlistpage ? "text-red-500" : " text-gray-700 hover:text-indigo-700 transition"
                }`} fill={isWishlistpage ? "currentColor" : "none"}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button onClick={() => navigate("/Cart")} className="relative">
              <ShoppingCart className={`w-6 h-6 ${isCartpage ? "text-indigo-700" : "text-gray-700 hover:text-indigo-700 transition" }`}
              fill={isCartpage ? "currentColor" : "none"} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-700 transition"
                >
                  <User className="w-5 h-5" />
                  <span>Hi, {currentUser.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-full shadow-md hover:bg-gray-300 transition"
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </button>
              )}

              {/* Dropdown Menu */}
              {isDropdownOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <button onClick={()=>navigate("/MyAccount")} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Account
                  </button>
                  <button onClick={()=>navigate("/Orders")} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Orders
                  </button>
                  <button
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handlelogout}
                  >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
