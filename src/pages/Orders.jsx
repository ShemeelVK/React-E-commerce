import { useAuth } from "../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { Package,MapPin,CreditCard,ShoppingBag,Calendar,ArrowLeft,XCircle } from "lucide-react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import toast from "react-hot-toast";

function Orders() {
  const { currentUser, updateUserInAuthContext } = useAuth();
  const navigate = useNavigate();
  const orders = currentUser?.orders || [];

  const handleCancelOrder = async (orderId) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4 p-2 text-gray-800">
          <p className="font-semibold text-center">
            Are you sure you want to cancel this order?
          </p>
          <p className="text-sm text-center text-gray-600">
            This action cannot be undone.
          </p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => toast.dismiss(t.id)} // This button just closes the toast
              className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              No, Keep It
            </button>
            <button
              onClick={async () => {
                // First, dismiss this confirmation toast so it doesn't linger
                toast.dismiss(t.id);

                // Now, execute the actual cancellation logic
                const updatedOrders = orders.map((order) => {
                  if (order.orderId === orderId) {
                    return { ...order, status: "Cancelled" };
                  }
                  return order;
                });

                try {
                  const updatedUser = { ...currentUser, orders: updatedOrders };
                  await axios.patch(
                    `${import.meta.env.VITE_API_URL}/users/${currentUser.id}`,
                    {
                      orders: updatedOrders,
                    }
                  );
                  updateUserInAuthContext(updatedUser);
                  toast.success(
                    `Order #${orderId.split("-")[1]} has been cancelled.`
                  );
                } catch (error) {
                  console.error("Failed to cancel order:", error);
                  toast.error("There was an error cancelling the order.");
                }
              }}
              className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      ),
      {
        // Use a custom style for the confirmation box
        style: {
          background: "white",
          border: "1px solid #e5e7eb",
        },
        id: "cancel-confirmation", // Give it a unique ID
      }
    );
  };

  return (
      <div className="bg-gray-50 min-h-screen mt-12">
        <Navbar/>
      <div className="max-w-4xl mx-auto px-4 py-28">
        <h1 className="text-4xl font-extrabold mb-12 text-center text-gray-800">
          Order History
        </h1>
        {orders.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white rounded-lg shadow-md">
            <Package size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              You haven't placed any orders yet.
            </h2>
            <p className="text-gray-500 mb-8">
              When you do, your orders will be saved here.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300"
            >
              <ArrowLeft size={20} />
              <span>Start Shopping</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders
              .slice()
              .reverse()
              .map((order) => {
                const totalItems = order.items.reduce(
                  (acc, item) => acc + item.quantity,
                  0
                );

                return (
                  <div
                    key={order.orderId}
                    className="bg-white rounded-lg shadow-md border border-gray-200"
                  >
                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200">
                      <div>
                        <p className="font-bold text-lg text-gray-800">
                          Order{" "}
                          <span className="text-indigo-600">
                            #{order.orderId.split("-")[1]}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(order.orderDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <div
                          className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-2 ${
                            order.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              order.status === "In Progress"
                                ? "bg-yellow-500"
                                : order.status === "Cancelled"
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          {order.status}
                        </div>
                        <p className="font-bold text-xl text-gray-800">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="p-6">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 not-last:border-b not-last:pb-4 not-last:mb-4"
                        >
                          <div className="w-20 h-20 bg-gray-100 rounded-md p-2 flex-shrink-0">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="flex items-start gap-2 text-sm md:col-span-1">
                        <MapPin
                          size={16}
                          className="mt-1 text-gray-500 flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-gray-700">
                            Shipping To
                          </p>
                          <p className="text-gray-600">
                            {order.shippingAddress.name},{" "}
                            {order.shippingAddress.address},{" "}
                            {order.shippingAddress.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm md:col-span-1">
                        <ShoppingBag
                          size={16}
                          className="mt-1 text-gray-500 flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-gray-700">
                            Order Contents
                          </p>
                          <p className="text-gray-600">{totalItems} item(s)</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm md:col-span-1">
                        <CreditCard
                          size={16}
                          className="mt-1 text-gray-500 flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-gray-700">
                            Payment Method
                          </p>
                          <p className="text-gray-600 capitalize">
                            {order.paymentMethod}
                          </p>
                        </div>
                      </div>

                      <div className="md:text-right md:col-span-1">
                        {order.status === "In Progress" && (
                          <button
                            onClick={() => handleCancelOrder(order.orderId)}
                            className="bg-red-100 text-red-700 font-semibold px-4 py-2 rounded-lg hover:bg-red-200 transition text-sm flex items-center gap-2 ml-auto"
                          >
                            <XCircle size={14} />
                            <span>Cancel Order</span>
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
