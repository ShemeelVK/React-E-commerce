import React from "react";
import { useAuth } from "../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { Package, Calendar, MapPin, CreditCard, ArrowLeft } from "lucide-react";

function Orders() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const orders = currentUser?.orders || [];

  return (
    <div className="bg-gray-50 min-h-screen">
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
              .map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-lg shadow-md border border-gray-200"
                >
                  {/* Order Header */}
                  <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200">
                    <div>
                      <p className="font-bold text-lg text-gray-800">
                        Order{" "}
                        <span className="text-indigo-600">
                          #{order.orderId.split("-")[1]}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.orderDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                      <div
                        className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-2 ${
                          order.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            order.status === "In Progress"
                              ? "bg-yellow-500"
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

                  {/* Order Items */}
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

                  {/* --- Order Details Footer --- */}
                  <div className="bg-gray-50 p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* Shipping Details */}
                    <div className="flex items-start gap-2 text-sm">
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

                    {/* Payment Details */}
                    <div className="flex items-start gap-2 text-sm">
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
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
