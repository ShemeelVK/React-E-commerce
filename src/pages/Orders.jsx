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
  FileText,
  X,
  RotateCcw, // Added for Return Icon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// ============================================================================
// ⚠️ IMPORTANT: UNCOMMENT YOUR REAL IMPORTS IN YOUR PROJECT
// ============================================================================
import { useAuth } from "../Context/AuthContext.jsx";
import api from "../utils/api.js";
import Navbar from "../Components/Navbar";

// --- PDF VIEWER MODAL COMPONENT ---
const InvoiceModal = ({ pdfUrl, onClose }) => {
  if (!pdfUrl) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-indigo-600" />
            <h3 className="font-bold text-gray-900">Invoice Viewer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* PDF Viewer (Using native embed) */}
        <div className="flex-1 bg-gray-50 p-4">
          <iframe
            src={pdfUrl}
            className="w-full h-full rounded-lg border border-gray-200 shadow-sm bg-white"
            title="Invoice PDF"
          />
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <a
            href={pdfUrl}
            download="Invoice.pdf"
            className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
};

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the PDF Viewer
  const [viewingInvoice, setViewingInvoice] = useState(null); // stores the Blob URL

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

  const handleViewInvoice = async (orderId) => {
    const toastId = toast.loading("Loading Invoice...");
    try {
      const response = await api.get(
        `${import.meta.env?.VITE_API_URL || ""}/Order/${orderId}/invoice`,
        { responseType: "blob" }
      );

      // Create Blob URL
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      // Set state to open modal
      setViewingInvoice(fileURL);

      toast.success("Invoice Loaded", { id: toastId });
    } catch (error) {
      console.error("Invoice error:", error);
      toast.error("Unable to load invoice", { id: toastId });
    }
  };

  const handleCloseInvoice = () => {
    if (viewingInvoice) {
      URL.revokeObjectURL(viewingInvoice); // Cleanup memory
      setViewingInvoice(null);
    }
  };

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

  const handleReturnOrder = async (orderId, orderReference) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-3 p-2 font-sans text-neutral-800">
          <p className="font-bold text-sm text-center">
            Return Order #{orderReference}?
          </p>
          <p className="text-xs text-center text-neutral-500">
            Items will be returned and refund initiated.
          </p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await api.put(
                    `${
                      import.meta.env?.VITE_API_URL || ""
                    }/Order/Return-Order/${orderId}`
                  );

                  toast.success(
                    `Return initiated for Order #${orderReference}.`
                  );

                  setOrders((prevOrders) =>
                    prevOrders.map((order) => {
                      if (order.id === orderId) {
                        return { ...order, status: "Returned" };
                      }
                      return order;
                    })
                  );
                } catch (error) {
                  console.error("Failed to return order:", error);
                  if (error.response && error.response.data) {
                    toast.error(
                      error.response.data.message || "Error returning order."
                    );
                  } else {
                    toast.error("Network error. Please try again");
                  }
                }
              }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wide bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              Confirm Return
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
        id: "return-confirmation",
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

      {/* INVOICE MODAL */}
      <InvoiceModal pdfUrl={viewingInvoice} onClose={handleCloseInvoice} />

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
                            : order.status === "Returned"
                            ? "bg-purple-50 text-purple-700 border-purple-100"
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
                              : order.status === "Returned"
                              ? "bg-purple-500"
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

                    {/* Col 4: Actions (View Invoice & Actions) */}
                    <div className="p-6 flex flex-col justify-center items-stretch border-t border-neutral-100 md:border-t-0 bg-neutral-50/50 gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1 block md:hidden">
                        Actions
                      </span>

                      {/* VIEW INVOICE BUTTON - Always visible */}
                      <button
                        onClick={() => handleViewInvoice(order.id)}
                        className="w-full bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                      >
                        <FileText size={14} />
                        View Invoice
                      </button>

                      {/* CANCEL BUTTON (Condition: Only if Pending) */}
                      {order.status === "Pending" && (
                        <button
                          onClick={() => handleCancelOrder(order.id, displayId)}
                          className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      )}

                      {/* RETURN BUTTON (Condition: Only if Delivered) */}
                      {order.status === "Delivered" && (
                        <button
                          onClick={() => handleReturnOrder(order.id, displayId)}
                          className="w-full bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                        >
                          <RotateCcw size={14} />
                          Return
                        </button>
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
