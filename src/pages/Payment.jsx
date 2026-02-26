import React, { useState, useEffect } from "react";
// ============================================================================
// ⚠️ IMPORTANT: UNCOMMENT YOUR REAL IMPORTS IN YOUR PROJECT
// ============================================================================
import { useCart } from "../Context/CartContext.jsx";
import { useAuth } from "../Context/AuthContext.jsx";
import Navbar from "../Components/Navbar.jsx";
import api from "../utils/api.js";
import eleve from "../assets/eleve.svg";

import {
  CreditCard,
  Landmark,
  CircleDollarSign,
  Package,
  CheckCircle,
  Copy,
  MapPin,
  Plus,
  ArrowRight,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// --- TEMPORARY MOCKS FOR PREVIEW (DELETE IN YOUR APP) ---
// const useCart = () => ({
//   cartItems: [
//     {
//       id: 1,
//       name: "Urban Drifter X",
//       price: 2450,
//       quantity: 1,
//       imageUrl:
//         "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1000",
//     },
//     {
//       id: 2,
//       name: "Aero Glide 4000",
//       price: 1800,
//       quantity: 1,
//       imageUrl:
//         "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
//     },
//   ],
//   clearCart: async () => console.log("Cart Cleared"),
// });
// const useAuth = () => ({
//   currentUser: { name: "User", email: "user@example.com" },
// });
// const api = {
//   get: async () => ({
//     data: [
//       {
//         name: "John Doe",
//         street: "123 Fashion Ave",
//         city: "New York",
//         state: "NY",
//         zipCode: "10001",
//         phoneNumber: "1234567890",
//       },
//     ],
//   }),
//   post: async () => ({ data: { orderReference: "ELEVE-MOCK-123" } }),
// };
// const Navbar = () => (
//   <div className="w-full py-4 border-b border-gray-100 flex justify-center items-center bg-white/80 backdrop-blur-md sticky top-0 z-40">
//     <span className="font-black italic text-xl">ELEVÉ.</span>
//   </div>
// );
// const eleve = "placeholder.png";
// ============================================================================

// Helper to load Razorpay
const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Payment() {
  const { cartItems, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // --- STATES ---
  const [savedAddresses, setSavedAddresses] = useState([]); // List of addresses
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null); // Selected card index

  // Form State
  const [shippingInfo, setShippingInfo] = useState({
    name: currentUser?.name || "",
    address: "",
    city: "",
    state: "",
    phone: "",
    zip: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 1. FETCH ADDRESSES ON LOAD ---
  useEffect(() => {
    const fetchAddresses = async () => {
      // Only fetch if user is logged in
      if (currentUser) {
        try {
          console.log("Fetching addresses...");
          const res = await api.get(
            `${import.meta.env?.VITE_API_URL || ""}/User/Get-Address`
          );
          console.log("Addresses loaded:", res.data); // Check your console for this!
          setSavedAddresses(res.data);
        } catch (error) {
          console.error("Failed to load addresses", error);
        }
      }
    };

    fetchAddresses();
  }, [currentUser]);

  useEffect(() => {
    loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  // --- 2. HANDLE ADDRESS SELECTION ---
  const handleSelectAddress = (addr, index) => {
    setSelectedAddressIndex(index);

    // Auto-fill the form with data from the clicked card
    setShippingInfo({
      name: addr.name,
      address: addr.street, // Maps 'street' -> 'address'
      city: addr.city,
      state: addr.state,
      zip: addr.zipCode, // Maps 'zipCode' -> 'zip'
      phone: addr.phoneNumber, // Maps 'phoneNumber' -> 'phone'
    });

    toast.success("Address applied!");
  };

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    // If user types manually, deselect the card to avoid confusion
    if (selectedAddressIndex !== null) setSelectedAddressIndex(null);
  };

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost = subtotal > 500 ? 0 : 50;
  const total = subtotal + shippingCost;
  const EXCHANGE_RATE = 87;

  // --- PAYMENT HANDLER ---
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!currentUser || isProcessing) return;

    if (
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.zip ||
      !shippingInfo.phone
    ) {
      toast.error("Please fill in all the shipping details");
      return;
    }

    const orderPayload = {
      shippingAddress: {
        name: shippingInfo.name,
        street: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zip,
        phoneNumber: shippingInfo.phone,
      },
      items: cartItems.map((item) => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
      })),
      paymentMethod: paymentMethod === "COD" ? "Cash On Delivery" : "UPI",
    };

    const placeOrder = async (paymentId = null) => {
      try {
        const payloadToSend = {
          ...orderPayload,
          paymentMethod:
            paymentMethod === "COD" ? "Cash on Delivery" : "Prepaid",
          transactionId: paymentId,
        };

        const response = await api.post(
          `${import.meta.env?.VITE_API_URL || ""}/Order/Place-Order`,
          orderPayload
        );

        const serverId =
          response.data?.orderReference ||
          response.data?.OrderReference ||
          `ELEVE-${Date.now()}`;

        setPlacedOrderId(serverId);
        toast.success("Order Placed Successfully");
        setShowSuccess(true);
        await clearCart(false);
      } catch (error) {
        console.log("Order failed: ", error);
        const errorMsg =
          error.response?.data?.message || "Failed to place order.";
        toast.error(errorMsg);
      } finally {
        setIsProcessing(false);
      }
    };

    setIsProcessing(true);

    if (paymentMethod === "COD") {
      console.log("Processing COD Order...");
      await placeOrder();
    } else {
      if (!window.Razorpay) {
        // Fallback for preview or error handling
        console.warn("Razorpay SDK not found (Expected in Preview)");
        await placeOrder("MOCK-PAYMENT-ID"); // Allow flow to continue for preview
        return;
      }

      const totalInINR = Math.round(total * EXCHANGE_RATE);
      const amountInPaise = totalInINR * 100;

      const options = {
        key: "rzp_test_edrzdb8Gbx5U5M", // Replace with actual key
        amount: amountInPaise,
        currency: "INR",
        name: "Elevé",
        description: "Sneaker Store Transaction",
        image: eleve,
        handler: async function (response) {
          await placeOrder(response.razorpay_payment_id);
        },
        modal: {
          ondismiss: function () {
            // 1. Reset your button "Verifying" state here
            setIsProcessing(false);
            // 2. Show your toast
            toast.error("Payment cancelled");
          },
        },
        prefill: {
          name: shippingInfo.name,
          email: currentUser.email,
          contact: shippingInfo.phone,
        },
        theme: { color: "#4F46E5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  // Prevent Empty Cart Screen from blocking Success Modal
  if (cartItems.length === 0 && !showSuccess) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
        <Navbar />
        <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-neutral-300" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-widest mb-2">
            Cart is empty
          </h1>
          <p className="text-neutral-500 text-sm font-medium mb-8">
            Your cart is currently empty.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="group flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mx-auto"
          >
            <span>Start Shopping</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-black selection:text-white">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Page Header */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase mb-4">
            Checkout
          </h1>
          <p className="text-xs font-bold tracking-[0.3em] text-neutral-400 uppercase">
            Secure Payment • Fast Delivery
          </p>
        </div>

        <form
          onSubmit={handlePayment}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* --- Left Side: Shipping & Payment (Col Span 8) --- */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. SAVED ADDRESSES */}
            {savedAddresses.length > 0 && (
              <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-neutral-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-neutral-100 rounded-full text-indigo-600">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
                    Delivery Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddresses.map((addr, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectAddress(addr, index)}
                      className={`p-5 border rounded-2xl cursor-pointer transition-all duration-200 relative group
                        ${
                          selectedAddressIndex === index
                            ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600"
                            : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm bg-white"
                        }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-bold text-sm text-neutral-900 uppercase tracking-wide">
                            {addr.name}
                          </p>
                          <p className="text-xs text-neutral-500 font-medium truncate">
                            {addr.street}
                          </p>
                          <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                            {addr.city}, {addr.state} {addr.zipCode}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-mono mt-2">
                            {addr.phoneNumber}
                          </p>
                        </div>
                        {selectedAddressIndex === index && (
                          <CheckCircle className="text-indigo-600 w-5 h-5 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* "Use New Address" Button */}
                  <div
                    onClick={() => {
                      setSelectedAddressIndex(null);
                      setShippingInfo({
                        name: currentUser?.name || "",
                        address: "",
                        city: "",
                        state: "",
                        phone: "",
                        zip: "",
                      });
                    }}
                    className="p-5 border border-dashed border-neutral-300 rounded-2xl cursor-pointer hover:bg-neutral-50 hover:border-neutral-400 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-neutral-600 transition-all min-h-[140px]"
                  >
                    <div className="p-2 bg-neutral-100 rounded-full">
                      <Plus size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Add New Address
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SHIPPING FORM */}
            <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-neutral-100">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-xs">
                  02
                </span>
                {selectedAddressIndex !== null
                  ? "Confirm Details"
                  : "Shipping Information"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  value={shippingInfo.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                  className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-400"
                />
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                  className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-400"
                />
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  required
                  className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium md:col-span-2 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-400"
                />
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                  className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-400"
                />
                <div className="flex gap-6">
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                    className="w-1/2 p-4 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-400"
                  />
                  <input
                    type="text"
                    name="zip"
                    value={shippingInfo.zip}
                    onChange={handleInputChange}
                    placeholder="ZIP Code"
                    required
                    className="w-1/2 p-4 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-400"
                  />
                </div>
              </div>
            </div>

            {/* 3. PAYMENT METHOD */}
            <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-neutral-100">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-xs">
                  03
                </span>
                Payment Method
              </h2>

              <div className="space-y-4">
                {[
                  {
                    id: "UPI",
                    icon: CreditCard,
                    label: "Credit / Debit / UPI",
                  },
                  { id: "Net Banking", icon: Landmark, label: "Net Banking" },
                  {
                    id: "COD",
                    icon: CircleDollarSign,
                    label: "Cash on Delivery",
                  },
                ].map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center p-5 border rounded-xl cursor-pointer transition-all duration-200 group
                        ${
                          paymentMethod === method.id
                            ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600"
                            : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                        }`}
                  >
                    <div
                      className={`p-2 rounded-full mr-4 transition-colors ${
                        paymentMethod === method.id
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-neutral-100 text-neutral-500 group-hover:text-neutral-700"
                      }`}
                    >
                      <method.icon size={20} />
                    </div>
                    <span
                      className={`font-bold text-sm uppercase tracking-wide ${
                        paymentMethod === method.id
                          ? "text-indigo-900"
                          : "text-neutral-600"
                      }`}
                    >
                      {method.label}
                    </span>
                    {paymentMethod === method.id && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-indigo-600 shadow-sm" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- Right Side: Order Summary (Col Span 4 - Sticky) --- */}
          <div className="lg:col-span-4">
            <div className="bg-neutral-900 p-8 rounded-[2rem] shadow-2xl sticky top-32 overflow-hidden relative border border-neutral-800">
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/30 rounded-full blur-[80px] pointer-events-none" />

              <h2 className="text-xl font-black uppercase tracking-tight mb-8 text-white relative z-10">
                Summary
              </h2>

              {/* Mini Cart List */}
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 group">
                    <div className="w-14 h-14 bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-white uppercase tracking-wide truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-medium">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-md text-indigo-400 font-mono">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-neutral-700 my-6 relative z-10"></div>

              <div className="space-y-3 mb-6 relative z-10">
                <div className="flex justify-between text-xs font-bold text-neutral-400 uppercase tracking-wide">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-neutral-400 uppercase tracking-wide">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-neutral-700 my-6 relative z-10"></div>

              <div className="flex justify-between items-end mb-8 relative z-10">
                <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">
                  Total
                </span>
                <span className="text-3xl font-black text-white tracking-tight">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-white text-black py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 group relative z-10"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    Confirm & Pay{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-wider relative z-10">
                <Truck size={12} />
                <span>Free Shipping on orders over $500</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* --- SUCCESS MODAL --- */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full text-center relative animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100 shadow-sm">
              <CheckCircle
                className="text-green-500 w-12 h-12"
                strokeWidth={1.5}
              />
            </div>

            <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tight mb-2">
              Order Confirmed
            </h2>
            <p className="text-neutral-500 text-sm font-medium mb-8 leading-relaxed">
              Thank you for your purchase. Your order has been placed
              successfully and is being processed.
            </p>

            <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 mb-8">
              <p className="text-[10px] text-neutral-400 uppercase font-bold mb-2 tracking-widest">
                Order Reference
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg font-mono font-bold text-neutral-900 select-all tracking-wider">
                  {placedOrderId}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(placedOrderId);
                    toast.success("Copied to clipboard!");
                  }}
                  className="p-2 hover:bg-white rounded-lg text-indigo-600 transition-colors shadow-sm"
                  title="Copy ID"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/orders")}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all shadow-lg"
              >
                Track Order
              </button>
              <button
                onClick={() => navigate("/shop")}
                className="w-full bg-white text-neutral-900 border border-neutral-200 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-50 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
