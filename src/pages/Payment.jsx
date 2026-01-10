import React, { useState, useEffect } from "react";
import { useCart } from "../Context/CartContext.jsx";
import { useAuth } from "../Context/AuthContext.jsx";
import {
  CreditCard,
  Landmark,
  CircleDollarSign,
  Package,
  CheckCircle,
  Copy,
  MapPin,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../Components/Navbar.jsx";
import api from "../utils/api.js";
import eleve from "../assets/eleve.svg";

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
          const res = await api.get(`${import.meta.env.VITE_API_URL}/User/Get-Address`);
          console.log("Addresses loaded:", res.data); // Check your console for this!
          setSavedAddresses(res.data);
        } catch (error) {
          console.error("Failed to load addresses", error);
        }
      }
    };
    
    fetchAddresses();
  }, [currentUser]);

  useEffect(()=>{
    loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
  },[])

  // --- 2. HANDLE ADDRESS SELECTION ---
  const handleSelectAddress = (addr, index) => {
    setSelectedAddressIndex(index);
    
    // Auto-fill the form with data from the clicked card
    setShippingInfo({
      name: addr.name,
      address: addr.street,      // Maps 'street' -> 'address'
      city: addr.city,
      state: addr.state,
      zip: addr.zipCode,         // Maps 'zipCode' -> 'zip'
      phone: addr.phoneNumber    // Maps 'phoneNumber' -> 'phone'
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
      paymentMethod: paymentMethod==="COD" ? "Cash On Delivery" : "UPI",
    };

    const placeOrder = async (paymentId = null) => {
      try {
        const payloadToSend={
          ...orderPayload,
          paymentMethod:paymentMethod==="COD" ? "Cash on Delivery" : "Prepaid",
          transactionId:paymentId
        };

        const response = await api.post(
          `${import.meta.env.VITE_API_URL}/Order/Place-Order`,
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
        const errorMsg = error.response?.data?.message || "Failed to place order.";
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
        toast.error("Payment SDK failed to load");
        setIsProcessing(false);
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
        ondismiss: function() {
            // 1. Reset your button "Verifying" state here
            setIsProcessing(false) 
            // 2. Show your toast
            toast.error("Payment cancelled");
        }
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
      <div className="text-center py-40">
        <h1 className="text-2xl font-bold">Your cart is empty.</h1>
        <button
          onClick={() => navigate("/shop")}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-28">
          <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800">
            Checkout
          </h1>
          <form
            onSubmit={handlePayment}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* --- Left Side: Shipping & Payment --- */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* --- SAVED ADDRESSES SECTION --- */}
              {savedAddresses.length > 0 && (
                <div className="bg-white p-8 rounded-lg shadow-md animate-in fade-in">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <MapPin size={20} className="text-indigo-600" /> Saved Addresses
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedAddresses.map((addr, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectAddress(addr, index)}
                        className={`p-4 border rounded-xl cursor-pointer transition relative group
                          ${selectedAddressIndex === index 
                            ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" 
                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-800">{addr.name}</p>
                            <p className="text-sm text-gray-600 truncate">{addr.street}</p>
                            <p className="text-xs text-gray-500">
                                {addr.city}, {addr.state} {addr.zipCode}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{addr.phoneNumber}</p>
                          </div>
                          {selectedAddressIndex === index && (
                             <CheckCircle className="text-indigo-600 w-5 h-5" />
                          )}
                        </div>
                      </div>
                    ))}
                    {/* "Use New Address" Button */}
                    <div 
                      onClick={() => {
                        setSelectedAddressIndex(null);
                        setShippingInfo({name: currentUser?.name || "", address: "", city: "", state: "", phone: "", zip: ""});
                      }}
                      className="p-4 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-500"
                    >
                      <Plus size={20} />
                      <span className="font-medium">Use New Address</span>
                    </div>
                  </div>
                </div>
              )}

              {/* --- Manual Input Form --- */}
              <div className="bg-white p-8 rounded-lg shadow-md transition-all">
                <h2 className="text-2xl font-bold mb-6">
                  {selectedAddressIndex !== null ? "Confirm Details" : "Shipping Information"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    required
                    className="w-full p-3 border rounded-lg md:col-span-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    placeholder="State / Province"
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    type="text"
                    name="zip"
                    value={shippingInfo.zip}
                    onChange={handleInputChange}
                    placeholder="ZIP / Postal Code"
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* --- Payment Method --- */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-4">
                  <div
                    onClick={() => setPaymentMethod("UPI")}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                      paymentMethod === "UPI" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mr-4 text-indigo-600" />
                    <span>UPI / Card</span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("Net Banking")}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                      paymentMethod === "Net Banking" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
                    }`}
                  >
                    <Landmark className="w-6 h-6 mr-4 text-indigo-600" />
                    <span>Net Banking</span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("COD")}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                      paymentMethod === "COD" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
                    }`}
                  >
                    <CircleDollarSign className="w-6 h-6 mr-4 text-indigo-600" />
                    <span>Cash on Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Right Side: Order Summary --- */}
            <div className="bg-white p-8 rounded-lg shadow-md h-fit sticky top-28">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-md p-1">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t my-6"></div>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t my-6"></div>
              <div className="flex justify-between font-bold text-xl mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-lg transition flex items-center justify-center gap-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                <Package className="w-5 h-5" />
                <span>{isProcessing ? "Processing..." : "Confirm & Pay"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- SUCCESS MODAL --- */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600 w-12 h-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Order Confirmed!</h2>
            <p className="text-gray-500 mb-6">Your order has been placed successfully.</p>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-8">
              <p className="text-xs text-indigo-500 uppercase font-bold mb-1 tracking-wider">Order Reference ID</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-mono font-bold text-indigo-700 select-all">{placedOrderId}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(placedOrderId);
                    toast.success("Copied to clipboard!");
                  }}
                  className="p-1.5 hover:bg-indigo-200 rounded-md text-indigo-500 transition"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate("/orders")} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg">Track My Order</button>
              <button onClick={() => navigate("/shop")} className="w-full bg-white text-gray-700 border border-gray-200 py-3.5 rounded-xl font-bold hover:bg-gray-50">Continue Shopping</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Payment;