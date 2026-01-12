import React from "react";
// ============================================================================
// ⚠️ IMPORTANT: UNCOMMENT YOUR REAL IMPORTS IN YOUR PROJECT
// ============================================================================
import { useCart } from "../Context/CartContext";
import Navbar from "../Components/Navbar";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// --- TEMPORARY MOCKS FOR PREVIEW (DELETE THIS SECTION IN YOUR APP) ---
// const useCart = () => ({
//   cartItems: [
//     {
//       id: 1,
//       name: "Urban Drifter X",
//       category: "Streetwear",
//       price: 2450,
//       quantity: 1,
//       imageUrl:
//         "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1000",
//     },
//     {
//       id: 2,
//       name: "Aero Glide 4000",
//       category: "Performance",
//       price: 1800,
//       quantity: 2,
//       imageUrl:
//         "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
//     },
//   ],
//   increaseQuantity: () => console.log("Inc"),
//   decreaseQuantity: () => console.log("Dec"),
//   removeFromCart: () => console.log("Remove"),
//   clearCart: () => console.log("Clear"),
//   processCheckout: () => console.log("Checkout"),
//   isProcessingCheckout: false,
// });
// const Navbar = () => (
//   <div className="w-full py-4 border-b border-gray-100 flex justify-center items-center bg-white/80 backdrop-blur-md sticky top-0 z-40">
//     <span className="font-black italic text-xl">ELEVÉ.</span>
//   </div>
// );
// ============================================================================

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    processCheckout,
    isProcessingCheckout,
  } = useCart();

  const navigate = useNavigate();
  // Subtotal function
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleclearcart = () => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4 p-2 font-sans">
          <p className="font-semibold text-center text-sm">
            Are you sure you want to clear your cart?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                clearCart();
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      ),
      {
        id: "confirmation-toast"
      }
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-black selection:text-white">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Page Header */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase mb-4">
            Your Cart
          </h1>
          <p className="text-xs font-bold tracking-[0.3em] text-neutral-400 uppercase">
            Review Selection • {cartItems.length} Items
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart size={32} className="text-neutral-300" />
            </div>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-2">
              Cart is Empty
            </h2>
            <p className="text-neutral-500 text-sm max-w-xs mx-auto mb-8 font-medium">
              Looks like you haven't added anything to your cart yet.
            </p>

            <button
              onClick={() => navigate("/shop")}
              className="group flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Continue Shopping</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* --- Cart Items List --- */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">
                  Items
                </h3>
                <button
                  onClick={handleclearcart}
                  className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors border-b border-transparent hover:border-red-500"
                >
                  Clear All
                </button>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col sm:flex-row bg-white rounded-[1.5rem] p-4 sm:p-5 border border-neutral-100 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-40 h-40 sm:h-40 bg-neutral-50 rounded-2xl overflow-hidden flex-shrink-0 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 mt-4 sm:mt-0 sm:ml-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase block mb-1">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight leading-none mb-2">
                          {item.name}
                        </h3>
                        <p className="text-xl font-bold text-indigo-600 tracking-tight">
                          ${item.price}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        title="Remove Item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4 sm:mt-0">
                      <div className="flex items-center gap-3 bg-neutral-50 rounded-full p-1 pr-4 border border-neutral-100">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-neutral-600 shadow-sm hover:text-black hover:shadow-md transition-all active:scale-95 border border-neutral-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-sm min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full shadow-md hover:bg-neutral-800 transition-all active:scale-95"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-md font-bold text-neutral-900">
                       ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Cart Summary (Sticky) --- */}
            <div className="lg:col-span-4">
              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-neutral-100 sticky top-32">
                <h2 className="text-xl font-black uppercase tracking-tight mb-8">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm font-medium text-neutral-500">
                    <span>Items ({cartItems.length})</span>
                    <span className="text-neutral-900 font-bold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-neutral-500">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold text-xs uppercase tracking-wider">
                      Calculated at Checkout
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-neutral-500">
                    <span>Tax (Est.)</span>
                    <span className="text-neutral-900 font-bold">$0.00</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-neutral-200 my-6"></div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">
                    Total
                  </span>
                  <span className="text-3xl font-black text-neutral-900 tracking-tight">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={processCheckout}
                  disabled={isProcessingCheckout}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isProcessingCheckout ? (
                    "Processing..."
                  ) : (
                    <>
                      Checkout{" "}
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-neutral-400 mt-4 font-medium leading-relaxed">
                  Secure Checkout • Free Shipping on Orders Over $200
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
