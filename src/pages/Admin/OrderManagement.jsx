import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderDetailModal from "../../Components/Admin/OrderDetailModal.jsx";
import toast from "react-hot-toast";
import api from "../../utils/api.js";

const STATUS_ENUM={
  "Pending":0,
  "Shipped":1,
  "Delivered":2,
  "Cancelled":3
}

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState(null);

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

  // updating order status
  const handleStatusChange = async (orderId, newStatusString) => {

    const statusEnumInt=STATUS_ENUM[newStatusString];

    if(statusEnumInt===undefined){
      toast.error("Invalid status selected");
      return;
    }

    try {
      await api.put(`${import.meta.env.VITE_API_URL}/Order/Order-Status/${orderId}`, {
        status: statusEnumInt,
      });

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

  if (loading) {
    return <div className="text-white">Loading orders...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Order Management</h1>
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
              {orders.map((order) => (
                <tr
                  key={order.id} // Using Guid ID
                  className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer"
                  onClick={() => handleViewOrder(order)}
                >
                  <td className="p-4 font-medium text-sky-400">
                    {order.orderReference} {/* Using OrderReference */}
                  </td>
                  <td className="p-4">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-white font-medium">
                    {order.username || "Guest"}
                  </td>
                  {/* <td className="p-4">Unknown User</td> */}
                  <td className="p-4 font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "Cancelled"
                          ? "bg-red-500/10 text-red-400"
                          : order.status === "Shipped"
                          ? "bg-blue-500/10 text-blue-400"
                          : order.status === "Delivered"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-slate-500/10 text-slate-400" // Default for Pending
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td
                    className="p-4 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="bg-slate-700 border border-slate-600 rounded-md p-2 text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {/* Ensure these strings match the keys in STATUS_ENUM */}
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
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
