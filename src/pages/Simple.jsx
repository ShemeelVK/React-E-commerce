import React, { useState, useEffect } from "react";
import { useCart } from "../Context/CartContext.jsx";
import { useAuth } from "../Context/AuthContext.jsx";
import {
  CreditCard,
  Landmark,
  CircleDollarSign,
  Package,
  CheckCircle,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../Components/Navbar.jsx";
import api from "../utils/api.js";
import eleve from "../assets/eleve.svg";

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
  const { currentUser, updateUserInAuthContext } = useAuth();
  const navigate = useNavigate();

  // --- NEW STATES FOR SUCCESS UI ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  const [shippingInfo, setShippingInfo] = useState({
    name: currentUser?.name || "",
    address: "",
    city: "",
    state: "",
    phone: "",
    zip: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load the Razorpay script when the component mounts
  useEffect(() => {
    loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost = subtotal > 500 ? 0 : 50;
  const total = subtotal + shippingCost;
  const EXCHANGE_RATE = 87;

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

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
      paymentMethod: paymentMethod,
    };

    const placeOrder = async (paymentId = null) => {
      try {
        const response = await api.post(
          `${import.meta.env.VITE_API_URL}/Order/Place-Order`,
          orderPayload
        );

        // Extracting orderId from .NET response (Adjust property name based on your DTO)
        const serverId =
          response.data?.orderId || response.data?.id || `ELEVE-${Date.now()}`;
        setPlacedOrderId(serverId);

        toast.success("Order Placed Successfully");
        await clearCart();

        // Show Success UI instead of immediate navigation
        setShowSuccess(true);
      } catch (error) {
        console.log("Order failed: ", error);
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
        } else if (error.response && error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Failed to place order, Please try again.");
        }
        setIsProcessing(false);
      }
    };

    setIsProcessing(true);

    if (paymentMethod === "Cash on Delivery") {
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
        key: "test_key", // Replace with your actual key
        amount: amountInPaise,
        currency: "INR",
        name: "Elevé",
        description: "Sneaker Store Transaction",
        image: eleve,

        handler: async function (response) {
          await placeOrder(response.razorpay_payment_id);
        },
        prefill: {
          name: shippingInfo.name,
          email: currentUser.email,
          contact: shippingInfo.phone,
        },
        notes: {
          address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.zip}`,
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment was cancelled.");
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  // --- NEW: SUCCESS UI VIEW ---
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-green-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase! We've received your order and are
            getting it ready for shipment.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-dashed border-gray-300">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1 tracking-widest">
              Order Reference
            </p>
            <p className="text-lg font-mono font-bold text-indigo-600">
              {placedOrderId}
            </p>
          </div>

          <p className="text-sm text-gray-500 mb-8 italic">
            "Your order will be arriving soon at your doorstep!"
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/shop")}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              <ShoppingBag size={20} />
              Keep Shopping
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="text-gray-500 font-medium hover:text-indigo-600 transition"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
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
        <div className="max-w-7xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-extrabold mb-12 text-center text-gray-800">
            Checkout
          </h1>
          <form
            onSubmit={handlePayment}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* --- Left Side: Shipping & Payment --- */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    required
                    className="w-full p-3 border rounded-lg md:col-span-2"
                  />
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    placeholder="State / Province"
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="zip"
                    value={shippingInfo.zip}
                    onChange={handleInputChange}
                    placeholder="ZIP / Postal Code"
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-4">
                  <div
                    onClick={() => setPaymentMethod("UPI")}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                      paymentMethod === "UPI"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mr-4 text-indigo-600" />
                    <span>UPI / Card</span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("Net Banking")}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                      paymentMethod === "Net Banking"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Landmark className="w-6 h-6 mr-4 text-indigo-600" />
                    <span>Net Banking</span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("Cash on Delivery")}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                      paymentMethod === "Cash on Delivery"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    <CircleDollarSign className="w-6 h-6 mr-4 text-indigo-600" />
                    <span>Cash on Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Right Side: Order Summary --- */}
            <div className="bg-white p-8 rounded-lg shadow-md h-fit">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-md p-1">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
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
    </>
  );
}

export default Payment;
