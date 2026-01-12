import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useState,useRef,useEffect } from "react";
import React from "react";
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Home,
  Store,
  Search,
  Menu,
} from "lucide-react";

// ============================================================================
// ⚠️ IMPORTANT: UNCOMMENT YOUR REAL IMPORTS IN YOUR PROJECT
// ============================================================================
import { useCart } from "../Context/CartContext.jsx";
import { useWishlist } from "../Context/WishlistContext.jsx";
import { useAuth } from "../Context/AuthContext.jsx";
import toast from "react-hot-toast";

// --- TEMPORARY MOCKS FOR PREVIEW (DELETE IN YOUR APP) ---
// const useCart = () => ({ cartItems: [] });
// const useWishlist = () => ({ wishlistItems: [] });
// const useAuth = () => ({ currentUser: { name: "User" }, logoutUser: () => {} });
// const toast = { error: () => {} };
// ============================================================================

// Helper component for the Bottom Navigation Bar
const BottomNavItem = ({ to, icon, label, count }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative flex flex-col items-center justify-center w-full pt-2 pb-1 transition-all duration-300 ${
        isActive
          ? "text-indigo-600 scale-105"
          : "text-gray-400 hover:text-indigo-600"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {React.cloneElement(icon, {
          fill: isActive ? "currentColor" : "none",
          strokeWidth: isActive ? 2.5 : 1.5,
          size: 20,
        })}
        <span className="text-[10px] mt-1 font-medium tracking-wide uppercase">
          {label}
        </span>
        {count > 0 && (
          <span className="absolute top-1 right-1/2 translate-x-3 bg-indigo-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
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

  const dropdownRef = useRef(null);

  const cartCount = cartItems?.length || 0;
  const wishlistCount = wishlistItems?.length || 0;
  const isCartPage = location.pathname.toLowerCase() === "/cart";
  const isWishlistPage = location.pathname.toLowerCase() === "/wishlist";

    useEffect(() => {
      function handleClickOutside(event) {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsDropdownOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

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
      {/* --- Main Top Navigation Bar (Floating Glass) --- */}
      <nav className="fixed top-0 sm:top-6 left-0 sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-[95%] max-w-7xl z-50 transition-all duration-300">
        <div className="bg-white/50 backdrop-blur-xl border-b sm:border border-white/20 sm:rounded-full shadow-sm sm:shadow-lg px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center group">
            <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-indigo-950 uppercase group-hover:text-indigo-700 transition-colors duration-300">
              Elevé
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            {["Home", "Shop", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item}`}
                className="relative text-sm font-bold text-gray-500 hover:text-indigo-600 uppercase tracking-widest transition-colors duration-300 group"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Search Bar (Collapsible on mobile) */}
            <form onSubmit={handleSearch} className="relative group">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="SEARCH"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-0 sm:w-48 focus:w-32 sm:focus:w-64 pl-8 pr-4 py-2 text-xs font-bold tracking-widest rounded-full bg-transparent sm:bg-gray-100 focus:bg-white border border-transparent focus:border-indigo-100 outline-none transition-all duration-300 opacity-0 sm:opacity-100 focus:opacity-100 pointer-events-none sm:pointer-events-auto focus:pointer-events-auto placeholder:text-gray-400 text-indigo-900"
                />
                <button
                  type="submit"
                  className="absolute left-2 sm:left-3 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => handleProtectedLink("/wishlist")}
                className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors group"
              >
                <Heart
                  className={`transition-all duration-300 ${
                    isWishlistPage
                      ? "fill-indigo-600 text-indigo-600"
                      : "group-hover:scale-110"
                  }`}
                  size={20}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleProtectedLink("/cart")}
                className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors group"
              >
                <ShoppingCart
                  className={`transition-all duration-300 ${
                    isCartPage
                      ? "fill-indigo-600 text-indigo-600"
                      : "group-hover:scale-110"
                  }`}
                  size={20}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative ml-2" ref={dropdownRef}>
                {currentUser ? (
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 group"
                  >
                    <User size={16} />
                    <span className="text-xs font-bold tracking-wider uppercase max-w-[100px] truncate">
                      {currentUser.name}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                  >
                    <span className="text-xs font-bold tracking-wider uppercase">
                      Login
                    </span>
                  </button>
                )}

                {/* Dropdown Menu */}
                {isDropdownOpen && currentUser && (
                  <div className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate("/MyAccount");
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        Account
                      </button>
                      <button
                        onClick={() => {
                          navigate("/orders");
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        Orders
                      </button>
                      <div className="h-[1px] bg-gray-100 mx-4 my-1" />
                      <button
                        onClick={handlelogout}
                        className="w-full flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Profile Icon */}
            <button
              onClick={() =>
                handleProtectedLink(currentUser ? "/MyAccount" : "/login")
              }
              className="md:hidden p-2 text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors"
            >
              <User size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- Bottom Tab Bar for Mobile (Floating Glass) --- */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 px-2 py-1">
          <div className="grid grid-cols-4 items-end h-14">
            <BottomNavItem to="/" icon={<Home />} label="Home" />
            <BottomNavItem to="/shop" icon={<Store />} label="Shop" />
            <BottomNavItem
              to="/wishlist"
              icon={<Heart />}
              label="Saved"
              count={wishlistCount}
            />
            <BottomNavItem
              to="/cart"
              icon={<ShoppingCart />}
              label="Cart"
              count={cartCount}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
