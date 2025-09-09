import React, { useState, useEffect } from "react";
import { useCart } from "../Context/CartContext.jsx";
import { useAuth } from "../Context/AuthContext.jsx";
import { CreditCard, Landmark, CircleDollarSign, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Function to dynamically load the Razorpay script
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
  const { cartItems } = useCart();
  const { currentUser,updateUserInAuthContext } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    name: currentUser?.name || "",
    address: "",
    city: "",
    state: "",
    phone:"",
    zip: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("upi");
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

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // --- THIS IS THE UPDATED PAYMENT HANDLER ---
  const handlePayment = async (e) => {
    e.preventDefault();

    if(!currentUser || isProcessing) return;

    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    setIsProcessing(true)

    const newOrder = {
      orderId: `ELEVE-${Date.now()}`,
      orderDate: new Date().toISOString(),
      items: cartItems,
      totalAmount: total,
      shippingAddress: shippingInfo,
      paymentMethod: paymentMethod,
      status: "In Progress",
    };

    const options = {
      key: "rzp_test_edrzdb8Gbx5U5M", // Replace with your test key
      amount: total * 100,
      currency: "INR",
      name: "Elevé",
      description: "Sneaker Store Transaction",
      image: "https://example.com/your_logo.png",
      handler: function (response) {
        // This would normally handle a successful payment.
        // We'll leave it empty for now as requested.
        console.log("Payment successful:", response);
      },
      prefill: {
        name: shippingInfo.name,
        email: currentUser.email,
        contact: shippingInfo.phone,
      },
      notes: {
        address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.phone},${shippingInfo.state} - ${shippingInfo.zip}`,
      },
      theme: {
        color: "#4F46E5",
      },
      // This function runs when the Razorpay modal is closed.
      modal: {
        ondismiss: async function () {
          const newOrder = {
            orderId: `ELEVE-${Date.now()}`,
            orderDate: new Date().toISOString(),
            items: cartItems,
            totalAmount: total,
            shippingAddress: shippingInfo,
            paymentMethod: paymentMethod,
            status: "In Progress",
          };

          try {
            // Create the updated user object with the new order and empty cart
            const updatedUser = {
              ...currentUser,
              orders: [...(currentUser.orders || []), newOrder],
              cart: [],
            };

            // Save the changes to the database
            await axios.patch(`http://localhost:3000/users/${currentUser.id}`, {
              orders: updatedUser.orders,
              cart: updatedUser.cart,
            });

            // Update the central state and give user feedback
            updateUserInAuthContext(updatedUser);
            alert("Order placed successfully! (Simulation)");
            navigate("/Orders");
          } catch (error) {
            console.error("Failed to place order:", error);
            alert("There was an error placing your order.");
            setIsProcessing(false)
          }
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
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
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
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
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Phone: "
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
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                    paymentMethod === "upi"
                      ? "border-indigo-500 bg-indigo-50"
                      : ""
                  }`}
                >
                  <CreditCard className="w-6 h-6 mr-4 text-indigo-600" />
                  <span>UPI / Credit / Debit Card</span>
                </div>
                <div
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                    paymentMethod === "netbanking"
                      ? "border-indigo-500 bg-indigo-50"
                      : ""
                  }`}
                >
                  <Landmark className="w-6 h-6 mr-4 text-indigo-600" />
                  <span>Net Banking</span>
                </div>
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-indigo-500 bg-indigo-50"
                      : ""
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-lg transition flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Confirm & Pay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Payment;
