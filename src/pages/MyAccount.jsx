import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { User, ShoppingBag, MapPin, LogOut,KeyRound,Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../utils/api.js";

function MyAccount() {
  const { currentUser, logoutUser, updateUserInAuthContext } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");

  if (!currentUser) {
    return (
      <div className="text-center py-40">You must be logged in to view this page.</div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection user={currentUser} onUpdate={updateUserInAuthContext} />;
      case "orders":
        return <OrdersSection orders={currentUser.orders || []} navigate={navigate} />;
      case "addresses":
        return <AddressesSection />;
      default:
        return <ProfileSection user={currentUser} onUpdate={updateUserInAuthContext} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen mt-12">
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
                    activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <User size={20} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 p-3 rounded-md text-left font-semibold transition ${
                    activeTab === 'orders' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ShoppingBag size={20} />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full flex items-center gap-3 p-3 rounded-md text-left font-semibold transition ${
                    activeTab === 'addresses' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
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

const SidebarButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-md text-left font-semibold transition duration-200 ${
      active
        ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
        : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// --- Sub-components for each section ---

const ProfileSection = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name || "");
  const [loadingName,setLoadingName]=useState(false);
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword,setIsChangingPassword]=useState(false);
  const [loadingPass,setLoadingPass] =useState(false);
  // const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwords, setPasswords] = useState({
    current:"",
    new:"",
    confirm:""
  });

  const handleUpdateName = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast("Name cannot be empty.", {
        icon: "⚠️",
        style: { background: "#fcbe03", color: "white" },
      });
      return;
    }
    setLoadingName(true);
    try {
      await api.put(`${import.meta.env.VITE_API_URL}/User/Update-Name`, {
        newName: name,
      });
      onUpdate({ ...user, name: name });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("failed to update name.");
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Failed to update name";
      toast.error(errorMsg);
    } finally {
      setLoadingName(false);
    }
  }

    const handleChangePassword = async (e) => {
      e.preventDefault();

      if (passwords.new !== passwords.confirm) {
        return toast.error("New passwords do not match");
      }
      if (passwords.new.length < 8) {
        return toast.error("Passwords must be at least 6 characters");
      }

      setLoadingName(true);
      try {
        await api.put(`${import.meta.env.VITE_API_URL}/User/change-password`, {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        });

        toast.success("Password changed successfully!");
        setIsChangingPassword(false);
        setPasswords({ current: "", new: "", confirm: "" });
      } catch (error) {
        console.error(error);

        if (error.response?.data?.errors) {
          const firstError = Object.values(error.response.data.errors)[0];
          toast.error(firstError);
        } else {
          const errorMsg =
            error.response?.data?.message || "Failed to change password.";
          toast.error(errorMsg);
        }
      } finally {
        setLoadingName(false);
      }
    };

    // if (showPasswordFields) {
    //   if (password.length < 5) {
    //     toast("Password must be at least 5 characters long.", {
    //       icon: "⚠️",
    //       style: { background: "#fcbe03", color: "white" },
    //     });
    //     return;
    //   }
    //   if (password !== confirmPassword) {
    //     toast("Passwords do not match.", {
    //       icon: "⚠️",
    //       style: { background: "#fcbe03", color: "white" },
    //     });
    //     return;
    //   }
    //   payload.password = password;
    // }

    //   try {
    //     const response = await axios.patch(
    //       `${import.meta.env.VITE_API_URL}/users/${user.id}`,
    //       payload
    //     );
    //     onUpdate(response.data);
    //     toast.success("Your profile has been updated successfully!");
    //     setShowPasswordFields(false);
    //     setPassword("");
    //     setConfirmPassword("");
    //   } catch (error) {
    //     console.error("Failed to update profile:", error);
    //     toast.error("An error occurred while updating your profile.");
    //   }
    // };

    return (
      <div className="max-w-xl animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <User className="text-indigo-600" /> Profile Information
        </h2>

        {/* --- Name Form --- */}
        <form onSubmit={handleUpdateName} className="space-y-6 mb-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">
              Email cannot be changed.
            </p>
          </div>

          {!isChangingPassword && (
            <button
              type="submit"
              disabled={loadingName}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition flex items-center gap-2"
            >
              {loadingName && <Loader2 className="animate-spin" size={18} />}
              {loadingName ? "Saving..." : "Save Changes"}
            </button>
          )}
        </form>

        {/* --- Password Section --- */}
        <div className="border-t pt-8">
          {!isChangingPassword ? (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 hover:bg-indigo-50 px-4 py-2 rounded-lg transition"
            >
              <KeyRound size={18} />
              Change Password
            </button>
          ) : (
            <form
              onSubmit={handleChangePassword}
              className="space-y-5 bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2"
            >
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <KeyRound size={18} /> Change Password
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    placeholder="Enter New password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New
                  </label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    placeholder="Repeat password"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loadingPass}
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2 transition"
                >
                  {loadingPass && (
                    <Loader2 className="animate-spin" size={18} />
                  )}
                  {loadingPass ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  // --- 2. ORDERS SECTION ---
  const OrdersSection = ({ navigate }) => {
    return (
      <div className="text-center py-10 animate-in fade-in duration-500">
        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="text-indigo-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">My Orders</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Track your current orders and review your purchase history all in one
          place.
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          View All Orders
        </button>
      </div>
    );
  };

  // --- 3. ADDRESS SECTION ---
  const AddressesSection = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <MapPin className="text-indigo-600" /> Manage Addresses
      </h2>
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
        <MapPin className="mx-auto text-gray-400 mb-3" size={48} />
        <p className="text-gray-500 mb-6 text-lg">
          You haven't saved any addresses yet.
        </p>
        <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 shadow-sm transition">
          Add New Address
        </button>
      </div>
    </div>
  );
export default MyAccount;