import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useState } from "react";
import React from "react";
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Home,
  Store,
  Search,
} from "lucide-react";
import { useCart } from "../Context/CartContext.jsx";
import { useWishlist } from "../Context/WishlistContext.jsx";
import { useAuth } from "../Context/AuthContext.jsx";
import toast from "react-hot-toast";

// Helper component for the Bottom Navigation Bar, now with a count prop
const BottomNavItem = ({ to, icon, label, count }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        isActive ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {React.cloneElement(icon, {
          fill: isActive ? "currentColor" : "none",
        })}
        <span className="text-xs mt-1">{label}</span>
        {count > 0 && (
          <span className="absolute top-1 right-1/2 translate-x-3 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {count}
          </span>
        )}
      </>
    )}
  </NavLink>
);

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser, logoutUser } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  const cartCount = cartItems?.length || 0;
  const wishlistCount = wishlistItems?.length || 0;
  const isCartPage = location.pathname.toLowerCase() === "/cart";
  const isWishlistPage = location.pathname.toLowerCase() === "/wishlist";

  function handlelogout() {
    logoutUser();
    setIsDropdownOpen(false);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/shop?q=${trimmedQuery}`);
      setSearchQuery("");
    }
  };

  const handleProtectedLink = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      toast.error("You must be logged in to view this page.");
      navigate("/login");
    }
  };

  return (
    <>
      {/* --- Main Top Navigation Bar --- */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-11/12 md:w-4/5 z-50 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-[5px] text-indigo-700"
          >
            Elevé
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex space-x-8">
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

          <div className="flex items-center gap-4">
            {/* NEW: Search bar now visible on small screens too */}
            <form onSubmit={handleSearch} className="flex">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-32 sm:w-40 pl-9 pr-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </form>

            {/* Desktop-only action icons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => handleProtectedLink("/wishlist")}
                className="relative p-2 rounded-full hover:bg-gray-100"
              >
                <Heart
                  className={`w-6 h-6 transition ${
                    isWishlistPage ? "text-red-500" : "text-gray-700"
                  }`}
                  fill={isWishlistPage ? "currentColor" : "none"}
                />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleProtectedLink("/cart")}
                className="relative p-2 rounded-full hover:bg-gray-100"
              >
                <ShoppingCart
                  className={`w-6 h-6 transition ${
                    isCartPage ? "text-indigo-600" : "text-gray-700"
                  }`}
                  fill={isCartPage ? "currentColor" : "none"}
                />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
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
                {isDropdownOpen && currentUser && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <button
                      onClick={() => {
                        navigate("/MyAccount");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Account
                    </button>
                    <button
                      onClick={() => {
                        navigate("/orders");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
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

            {/* Mobile Profile Icon */}
            <button
              onClick={() => handleProtectedLink("/MyAccount")}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
            >
              <User size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* --- Bottom Tab Bar for Mobile --- */}
      <div className="md:hidden fixed bottom-0 left-0 z-40 w-full h-16 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          <BottomNavItem to="/" icon={<Home size={24} />} label="Home" />
          <BottomNavItem to="/shop" icon={<Store size={24} />} label="Shop" />
          {/* NEW: Pass the counts to the bottom nav items */}
          <BottomNavItem
            to="/wishlist"
            icon={<Heart size={24} />}
            label="Wishlist"
            count={wishlistCount}
          />
          <BottomNavItem
            to="/cart"
            icon={<ShoppingCart size={24} />}
            label="Cart"
            count={cartCount}
          />
        </div>
      </div>
    </>
  );
}

export default Navbar;
