import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderDetailModal from "../../Components/Admin/OrderDetailModal.jsx";
import toast from "react-hot-toast";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState(null);

  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
      const users = response.data;

      let combinedOrders = [];
      users.forEach((user) => {
        if (user.orders && user.orders.length > 0) {
          const userOrders = user.orders.map((order) => ({
            ...order,
            userId: user.id,
            userName: user.name,
          }));
          combinedOrders = [...combinedOrders, ...userOrders];
        }
      });

      setOrders(
        combinedOrders.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        )
      );
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // updating order status
  const handleStatusChange = async (orderId, userId, newStatus) => {
    try {
      const userResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`
      );
      const user = userResponse.data;

      const updatedUserOrders = user.orders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      );

      await axios.patch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        orders: updatedUserOrders,
      });

      // Refresh the list in the UI
      fetchOrders();
      toast.success(`Order status updated to "${newStatus}".`);
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
                <th className="p-4">Order ID</th>
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
                  key={order.orderId}
                  className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer"
                  onClick={() => handleViewOrder(order)}
                >
                  <td className="p-4 font-medium text-sky-400">
                    #{order.orderId.split("-")[1]}
                  </td>
                  <td className="p-4">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">{order.userName}</td>
                  <td className="p-4 font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "In Progress"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : order.status === "Cancelled"
                          ? "bg-red-500/10 text-red-400"
                          : order.status === "Shipped"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-green-500/10 text-green-400"
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
                        handleStatusChange(
                          order.orderId,
                          order.userId,
                          e.target.value
                        )
                      }
                      className="bg-slate-700 border border-slate-600 rounded-md p-2 text-xs"
                    >
                      <option value="In Progress">In Progress</option>
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
