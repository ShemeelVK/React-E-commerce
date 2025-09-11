import React from "react";
import { X, MapPin, CreditCard, User, Phone } from "lucide-react";
import toast from "react-hot-toast";

function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  // Prevent clicks inside the modal from closing it
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
    >
      {/* Modal Content */}
      <div
        onClick={handleModalContentClick}
        className="bg-slate-800 rounded-lg shadow-2xl max-w-4xl w-full relative text-white animate-fade-in-up max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Order Details{" "}
            <span className="text-indigo-400">
              #{order.orderId.split("-")[1]}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side: Items List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-slate-300 mb-2">
                Items Ordered ({order.items.length})
              </h3>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-slate-700/50 p-3 rounded-md"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-md bg-white p-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-slate-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Side: Shipping & Payment */}
            <div className="space-y-6">
              {/* Shipping Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <MapPin size={18} /> Shipping Address
                </h3>
                <div className="bg-slate-700/50 p-4 rounded-md text-sm space-y-1">
                  <p className="font-semibold">{order.shippingAddress.name}</p>
                  <p className="text-slate-400">
                    {order.shippingAddress.address}
                  </p>
                  <p className="text-slate-400">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zip}
                  </p>
                  <p className="text-slate-400 flex items-center gap-2 pt-1">
                    <Phone size={14} /> {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <CreditCard size={18} /> Payment Details
                </h3>
                <div className="bg-slate-700/50 p-4 rounded-md text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shipping</span>
                    <span className="font-semibold">
                      ${(order.totalAmount - subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-600">
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal;
