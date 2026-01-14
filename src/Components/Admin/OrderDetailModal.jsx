import React from "react";
import {
  X,
  MapPin,
  Package,
  CreditCard,
  User,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  // Helper for Status Colors (Same as your table)
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Shipped":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Delivered":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Returned":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50 sticky top-0 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              Order Details
              <span
                className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-mono">
              {order.orderReference}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Customer & Payment Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer */}
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <User size={14} /> Customer
              </h3>
              <div className="space-y-1">
                <p className="text-white font-bold text-lg">
                  {order.username || "Guest User"}
                </p>
                {/* Assuming these fields exist, otherwise remove/adjust */}
                {order.email && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Mail size={12} /> {order.email}
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                  <Calendar size={12} />{" "}
                  {new Date(order.orderDate).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MapPin size={14} /> Shipping To
              </h3>
              <div className="space-y-1 text-slate-300 text-sm leading-relaxed">
                <p className="text-white font-bold">
                  {order.shippingAddress?.name}
                </p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
                <p>{order.shippingAddress?.zipCode}</p>
                {order.shippingAddress?.phoneNumber && (
                  <p className="flex items-center gap-2 mt-2 text-indigo-400">
                    <Phone size={12} /> {order.shippingAddress.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CreditCard size={14} /> Payment
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Method</p>
                  <p className="text-white font-bold">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Total Amount</p>
                  <p className="text-2xl font-mono font-bold text-emerald-400">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Package size={14} /> Items Ordered ({order.items?.length || 0})
            </h3>
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="bg-slate-900/50 text-xs text-slate-400 uppercase">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 text-center">Qty</th>
                    <th className="px-6 py-4 text-right">Unit Price</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {order.items?.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {item.productImage && (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-10 h-10 rounded-lg object-cover bg-white"
                            />
                          )}
                          <span className="font-medium text-white">
                            {item.productName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">{item.quantity}</td>
                      <td className="px-6 py-4 text-right font-mono text-slate-400">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-white">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
