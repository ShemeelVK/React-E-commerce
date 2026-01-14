import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderDetailModal from "../../Components/Admin/OrderDetailModal.jsx";
import toast from "react-hot-toast";
import api from "../../utils/api.js";

const STATUS_ENUM = {
  Pending: 0,
  Shipped: 1,
  Delivered: 2,
  Cancelled: 3,
  Returned: 4, // Included Returned status
};

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState(null);

  // --- NEW STATE: Filter ---
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/Order/admin/All-Orders`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("failed to fetch Orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatusString) => {
    const statusEnumInt = STATUS_ENUM[newStatusString];
    if (statusEnumInt === undefined) {
      toast.error("Invalid status selected");
      return;
    }

    try {
      await api.put(
        `${import.meta.env.VITE_API_URL}/Order/Order-Status/${orderId}`,
        {
          status: statusEnumInt,
        }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatusString } : o
        )
      );
      toast.success(`Order status updated to "${newStatusString}".`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("An error occurred while updating the status.");
    }
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
  };

  const handleCloseModal = () => {
    setViewingOrder(null);
  };

  // --- FILTER LOGIC ---
  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  if (loading) {
    return <div className="text-white">Loading orders...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Order Management</h1>

      {/* --- FILTER TABS (Matches your admin style) --- */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          "All",
          "Pending",
          "Shipped",
          "Delivered",
          "Cancelled",
          "Returned",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
              filterStatus === status
                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg"
                : "bg-slate-800 border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {status}
            <span className="ml-2 opacity-50">
              (
              {status === "All"
                ? orders.length
                : orders.filter((o) => o.status === status).length}
              )
            </span>
          </button>
        ))}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleViewOrder(order)}
                    className="border-b border-slate-700 hover:bg-slate-700/50"
                  >
                    <td className="p-4 font-medium text-sky-400">
                      {order.orderReference}
                    </td>
                    <td className="p-4">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-white font-medium">
                      {order.username || "Guest"}
                    </td>
                    <td className="p-4 font-semibold">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === "Cancelled"
                            ? "bg-red-500/10 text-red-400"
                            : order.status === "Returned"
                            ? "bg-purple-500/10 text-purple-400"
                            : order.status === "Shipped"
                            ? "bg-blue-500/10 text-blue-400"
                            : order.status === "Delivered"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td
                      className="p-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative group inline-block text-left min-w-[140px]">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          disabled={
                            order.status === "Returned" ||
                            order.status === "Cancelled"
                          }
                          className={`appearance-none w-full bg-slate-800 text-white text-xs font-medium border border-slate-600 rounded-lg py-2.5 pl-4 pr-10 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer hover:border-slate-500 ${
                            order.status === "Returned" ||
                            order.status === "Cancelled"
                              ? "opacity-60 cursor-not-allowed italic"
                              : ""
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          {order.status === "Returned" && (
                            <option value="Returned">Returned</option>
                          )}
                        </select>

                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 group-hover:text-white transition-colors">
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500">
                    No {filterStatus !== "All" ? filterStatus : ""} orders
                    found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingOrder && (
        <OrderDetailModal order={viewingOrder} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default OrderManagement;
