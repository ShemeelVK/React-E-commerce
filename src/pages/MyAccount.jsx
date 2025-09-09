import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { User, ShoppingBag, MapPin, LogOut } from "lucide-react";
import axios from "axios";

function AccountPage() {
  const { currentUser, logoutUser, updateUserInAuthContext } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");

  if (!currentUser) {
    return (
      <div className="text-center py-40">
        You must be logged in to view this page.
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileSection
            user={currentUser}
            onUpdate={updateUserInAuthContext}
          />
        );
      case "orders":
        return (
          <OrdersSection
            orders={currentUser.orders || []}
            navigate={navigate}
          />
        );
      case "addresses":
        return <AddressesSection />;
      default:
        return (
          <ProfileSection
            user={currentUser}
            onUpdate={updateUserInAuthContext}
          />
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-28">
        <h1 className="text-4xl font-extrabold mb-12 text-center text-gray-800">
          My Account
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* --- Left Sidebar Navigation --- */}
          <aside className="md:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 p-3 rounded-md text-left font-semibold transition ${
                    activeTab === "profile"
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <User size={20} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 p-3 rounded-md text-left font-semibold transition ${
                    activeTab === "orders"
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <ShoppingBag size={20} />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full flex items-center gap-3 p-3 rounded-md text-left font-semibold transition ${
                    activeTab === "addresses"
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <MapPin size={20} />
                  <span>Addresses</span>
                </button>
                <button
                  onClick={logoutUser}
                  className="w-full flex items-center gap-3 p-3 rounded-md text-left font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* --- Right Main Content --- */}
          <main className="md:col-span-3">
            <div className="bg-white p-8 rounded-lg shadow-md">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components for each section ---

const ProfileSection = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      alert("Name cannot be empty.");
      return;
    }

    const payload = { name: trimmedName };

    if (showPasswordFields) {
      if (password.length < 5) {
        alert("Password must be at least 5 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      payload.password = password;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/users/${user.id}`,
        payload
      );
      onUpdate(response.data);
      alert("Your profile has been updated successfully!");
      setShowPasswordFields(false);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("An error occurred while updating your profile.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
      <form onSubmit={handleSaveChanges} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="mt-1 block w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        {!showPasswordFields ? (
          <button
            type="button"
            onClick={() => setShowPasswordFields(true)}
            className="text-sm text-indigo-600 font-semibold hover:underline"
          >
            Change Password
          </button>
        ) : (
          <div className="space-y-4 border-t pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>
          </div>
        )}

        <div className="border-t pt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const OrdersSection = ({ orders, navigate }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
    {orders.length > 0 ? (
      <div className="space-y-4">
        {orders
          .slice(-3)
          .reverse()
          .map((order) => (
            <div
              key={order.orderId}
              className="border p-4 rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  Order #{order.orderId.split("-")[1]}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <p className="font-bold">${order.totalAmount.toFixed(2)}</p>
            </div>
          ))}
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 text-indigo-600 font-semibold"
        >
          View All Orders
        </button>
      </div>
    ) : (
      <p>You have no recent orders.</p>
    )}
  </div>
);

const AddressesSection = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Manage Addresses</h2>
    <p className="text-gray-600 mb-4">You have no saved addresses.</p>
    <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
      Add New Address
    </button>
  </div>
);

export default AccountPage;
