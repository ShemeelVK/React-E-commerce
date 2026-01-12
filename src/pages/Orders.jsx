import { useState, useEffect } from "react";
import {
  Package,
  MapPin,
  CreditCard,
  ShoppingBag,
  Calendar,
  ArrowLeft,
  XCircle,
  ChevronRight,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// ============================================================================
// ⚠️ IMPORTANT: UNCOMMENT YOUR REAL IMPORTS IN YOUR PROJECT
// ============================================================================
import { useAuth } from "../Context/AuthContext.jsx";
import api from "../utils/api.js";
import Navbar from "../Components/Navbar";

// --- TEMPORARY MOCKS FOR PREVIEW (DELETE IN YOUR APP) ---
// const Navbar = () => (
//   <div className="w-full py-4 border-b border-gray-100 flex justify-center items-center bg-white/80 backdrop-blur-md sticky top-0 z-40">
//     <span className="font-black italic text-xl">ELEVÉ.</span>
//   </div>
// );
// const api = {
//   get: async () => {
//     await new Promise((r) => setTimeout(r, 1000));
//     return {
//       data: [
//         {
//           id: 101,
//           orderReference: "ORD-88392-XJ",
//           status: "Pending",
//           totalAmount: 2450,
//           orderDate: "2023-10-15",
//           paymentMethod: "UPI",
//           shippingAddress: { name: "John Doe", city: "New York" },
//           items: [
//             {
//               id: 1,
//               productName: "Urban Drifter X",
//               quantity: 1,
//               unitPrice: 2450,
//               productImage:
//                 "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1000",
//             },
//           ],
//         },
//         {
//           id: 102,
//           orderReference: "ORD-11293-AB",
//           status: "Delivered",
//           totalAmount: 1800,
//           orderDate: "2023-09-20",
//           paymentMethod: "Card",
//           shippingAddress: { name: "John Doe", city: "Los Angeles" },
//           items: [
//             {
//               id: 2,
//               productName: "Aero Glide 4000",
//               quantity: 1,
//               unitPrice: 1800,
//               productImage:
//                 "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
//             },
//           ],
//         },
//       ],
//     };
//   },
//   put: async () => {},
// };
// ============================================================================

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(
          `${import.meta.env?.VITE_API_URL || ""}/Order/my-order`
        );
        setOrders(res.data);
      } catch (error) {
        console.log("Failed to fetch orders : ", error);
        toast.error("Could not load order history");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId, orderReference) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-3 p-2 font-sans text-neutral-800">
          <p className="font-bold text-sm text-center">
            Cancel Order #{orderReference}?
          </p>
          <p className="text-xs text-center text-neutral-500">
            This action cannot be undone.
          </p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Keep Order
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await api.put(
                    `${
                      import.meta.env?.VITE_API_URL || ""
                    }/Order/Cancel-Order/${orderId}`
                  );

                  toast.success(
                    `Order #${orderReference} cancelled successfully.`
                  );

                  setOrders((prevOrders) =>
                    prevOrders.map((order) => {
                      if (order.id === orderId) {
                        return { ...order, status: "Cancelled" };
                      }
                      return order;
                    })
                  );
                } catch (error) {
                  console.error("Failed to cancel order:", error);
                  if (error.response && error.response.data) {
                    toast.error("Error cancelling order.");
                  } else {
                    toast.error("Network error. Please try again");
                  }
                }
              }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      ),
      {
        style: {
          background: "#fff",
          color: "#333",
          border: "1px solid #e5e5e5",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        },
        id: "cancel-confirmation",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-50">
        <div className="w-16 h-16 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-black selection:text-white">
      <Navbar />
      <Toaster position="top-center" />

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase mb-4">
            Order History
          </h1>
          <p className="text-xs font-bold tracking-[0.3em] text-neutral-400 uppercase">
            Track & Manage Your Purchases
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2rem] shadow-sm border border-neutral-100 p-10">
            <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
              <Package size={32} className="text-neutral-300" />
            </div>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-2">
              No Orders Yet
            </h2>
            <p className="text-neutral-500 text-sm max-w-xs mx-auto mb-8 font-medium">
              Your collection awaits. Start building your wardrobe today.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="group flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Start Shopping</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const totalItems = order.items.reduce(
                (acc, item) => acc + item.quantity,
                0
              );
              const displayId =
                order.orderReference ||
                order.id?.toString().substring(0, 8).toUpperCase();

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-[1.5rem] shadow-sm border border-neutral-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  {/* --- Order Header Bar --- */}
                  <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-50 bg-neutral-50/50">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[14px] font-bold text-neutral-400 uppercase tracking-widest">
                          Order ID
                        </span>
                        <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-center select-all">
                          #{order.orderReference}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-500 mt-1">
                        <Calendar size={12} />
                        <span className="text-xs font-medium">
                          {new Date(order.orderDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center gap-6">
                      {/* Status Badge */}
                      <div
                        className={`px-4 py-1.5 rounded-full flex items-center gap-2 border ${
                          order.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-400"
                            : order.status === "Cancelled"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : order.status === "Shipped"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            order.status === "Pending"
                              ? "bg-amber-500"
                              : order.status === "Cancelled"
                              ? "bg-red-500"
                              : order.status === "Shipped"
                              ? "bg-blue-500"
                              : "bg-emerald-500"
                          }`}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {order.status}
                        </span>
                      </div>

                      <p className="hidden md:block font-black text-2xl text-neutral-900 tracking-tight">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* --- Order Items --- */}
                  <div className="p-6 md:p-8">
                    <div className="space-y-6">
                      {order.items.map((item, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className="flex items-center gap-6 group/item"
                        >
                          <div className="w-20 h-20 bg-neutral-50 rounded-xl p-2 flex-shrink-0 border border-neutral-100 overflow-hidden">
                            <img
                              src={item.productImage}
                              alt={item.name}
                              className="w-full h-full object-contain group-hover/item:scale-110 transition-transform duration-500"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-neutral-900 uppercase tracking-wide truncate">
                              {item.productName}
                            </p>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">
                              Qty: {item.quantity}
                            </p>
                          </div>

                          <p className="font-bold text-sm text-neutral-900 font-mono">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-neutral-50 p-0 grid grid-cols-2 md:grid-cols-4 text-sm border-t border-neutral-100 md:divide-x divide-neutral-200">
                    {/* Col 1: Shipping */}
                    <div className="p-6 flex flex-col gap-1.5 items-start">
                      <div className="flex items-center gap-2 text-neutral-400 mb-1">
                        <MapPin size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Shipping To
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-bold text-neutral-900 text-sm leading-tight truncate w-full">
                          {order.shippingAddress.name}
                        </p>
                        <p className="text-xs text-neutral-500 font-medium truncate w-full">
                          {order.shippingAddress.city}
                        </p>
                      </div>
                    </div>

                    {/* Col 2: Summary */}
                    <div className="p-6 flex flex-col gap-1.5 items-start">
                      <div className="flex items-center gap-2 text-neutral-400 mb-1">
                        <ShoppingBag size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Summary
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-bold text-neutral-900 text-sm leading-tight">
                          {totalItems} Item{totalItems > 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-neutral-500 font-medium">
                          Total: ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Col 3: Payment */}
                    <div className="p-6 flex flex-col gap-1.5 items-start border-t border-neutral-100 md:border-t-0">
                      <div className="flex items-center gap-2 text-neutral-400 mb-1">
                        <CreditCard size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Payment
                        </span>
                      </div>
                      <p className="font-bold text-neutral-900 text-sm leading-tight">
                        {order.paymentMethod}
                      </p>
                    </div>

                    {/* Col 4: Actions (Cancel Button) */}
                    <div className="p-6 flex flex-col justify-center items-start border-t border-neutral-100 md:border-t-0 bg-neutral-50/50">
                      {order.status === "Pending" ? (
                        <div className="w-full flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1 block md:hidden">
                            Actions
                          </span>
                          <button
                            onClick={() =>
                              handleCancelOrder(order.id, displayId)
                            }
                            className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                          >
                            <XCircle size={14} />
                            Cancel Order
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-30">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                            No Actions
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
