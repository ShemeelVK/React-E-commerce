import React from "react";
import { useCart } from "../Context/CartContext";
import { Heart, ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import Navbar from "../Components/Navbar";

function Cart() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-28">
        <h1 className="text-4xl font-extrabold mb-15 mt-8 text-center">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 text-xl mt-20">
            Your cart is empty. Start adding some products!
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* --- Cart Items List --- */}
            <div className="lg:col-span-3 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-48 h-48 bg-gray-100 flex items-center justify-center p-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-h-full object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-gray-500">{item.category}</p>
                      <p className="text-indigo-600 font-bold text-2xl mt-2">
                        ${item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-4 flex items-center gap-4">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                      >
                        <Plus size={16} />
                      </button>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto p-2 bg-red-100 hover:bg-red-200 rounded-full transition"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Cart Summary --- */}
            <div className="bg-white p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-2xl font-extrabold mb-6">Order Summary</h2>
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Items:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between font-bold text-xl mb-6">
                <span>Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-lg transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
