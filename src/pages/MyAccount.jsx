import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  KeyRound,
  Loader2,
  Package,
  ChevronRight,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

// ============================================================================
// ⚠️ IMPORTANT: UNCOMMENT YOUR REAL IMPORTS IN YOUR PROJECT
// ============================================================================
import { useAuth } from "../Context/AuthContext.jsx";
import api from "../utils/api.js";

// --- TEMPORARY MOCKS FOR PREVIEW (DELETE IN YOUR APP) ---
// const useAuth = () => ({
//   currentUser: { name: "John Doe", email: "john@example.com", id: 1 },
//   logoutUser: () => console.log("Logout"),
//   updateUserInAuthContext: () => console.log("Update Context"),
// });
// const api = {
//   get: async (url) => {
//     await new Promise((r) => setTimeout(r, 800));
//     if (url.includes("Get-Address")) return { data: [] }; // Mock empty addresses
//     if (url.includes("my-order"))
//       return {
//         data: [
//           {
//             id: 101,
//             orderReference: "ORD-88392-XJ",
//             status: "Processing",
//             totalAmount: 2450,
//             orderDate: "2023-10-15",
//           },
//           {
//             id: 102,
//             orderReference: "ORD-11293-AB",
//             status: "Delivered",
//             totalAmount: 1800,
//             orderDate: "2023-09-20",
//           },
//         ],
//       };
//     return { data: [] };
//   },
//   put: async () => ({ data: "success" }),
//   post: async () => ({ data: "success" }),
// };
// ============================================================================

function MyAccount() {
  const { currentUser, logoutUser, updateUserInAuthContext } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4">
            Access Denied
          </h2>
          <p className="text-neutral-500 mb-6">
            You must be logged in to view this page.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest"
          >
            Login Now
          </button>
        </div>
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
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-black selection:text-white">

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Page Header */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase mb-4">
            My Account
          </h1>
          <p className="text-xs font-bold tracking-[0.3em] text-neutral-400 uppercase">
            Manage your personal styling hub
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* --- Left Sidebar Navigation --- */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-neutral-100 sticky top-32">
              <div className="flex items-center gap-4 mb-8 px-2">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
                  <User size={24} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                    Welcome,
                  </p>
                  <p className="font-bold text-sm truncate">
                    {currentUser.name}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                <SidebarButton
                  active={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                  icon={<User size={18} />}
                  label="Profile"
                />
                <SidebarButton
                  active={activeTab === "orders"}
                  onClick={() => setActiveTab("orders")}
                  icon={<ShoppingBag size={18} />}
                  label="Orders"
                />
                <SidebarButton
                  active={activeTab === "addresses"}
                  onClick={() => setActiveTab("addresses")}
                  icon={<MapPin size={18} />}
                  label="Addresses"
                />

                <div className="h-[1px] bg-neutral-100 my-4" />

                <button
                  onClick={logoutUser}
                  className="w-full flex items-center gap-3 p-4 rounded-xl text-left font-bold text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all duration-200 group"
                >
                  <LogOut
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* --- Right Main Content --- */}
          <main className="lg:col-span-3">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-neutral-100 min-h-[600px]">
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
    className={`w-full flex items-center gap-4 p-4 rounded-xl text-left font-bold text-xs uppercase tracking-widest transition-all duration-300 ${
      active
        ? "bg-black text-white shadow-lg transform scale-[1.02]"
        : "text-neutral-500 hover:bg-neutral-50 hover:text-black"
    }`}
  >
    {React.cloneElement(icon, { strokeWidth: active ? 2.5 : 2 })}
    <span>{label}</span>
    {active && <ChevronRight size={14} className="ml-auto" />}
  </button>
);

// --- Sub-components for each section ---

const ProfileSection = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name || "");
  const [loadingName, setLoadingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
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
      await api.put(`${import.meta.env?.VITE_API_URL || ""}/User/Update-Name`, {
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
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match");
    }
    if (passwords.new.length < 8) {
      return toast.error("Passwords must be at least 6 characters");
    }

    setLoadingPass(true); // Fixed: was setLoadingName
    try {
      await api.put(
        `${import.meta.env?.VITE_API_URL || ""}/User/change-password`,
        {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }
      );

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
      setLoadingPass(false); // Fixed: was setLoadingName
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
          Profile Details
        </h2>
        <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase">
          Update your personal information
        </p>
      </div>

      {/* --- Name Form --- */}
      <form onSubmit={handleUpdateName} className="space-y-8 mb-16">
        <div className="group">
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-300"
            placeholder="Your Name"
          />
        </div>
        <div className="group opacity-60">
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full p-4 bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-500 cursor-not-allowed"
          />
          <p className="text-[10px] text-neutral-400 mt-2 font-medium">
            Email cannot be changed for security reasons.
          </p>
        </div>

        {!isChangingPassword && (
          <button
            type="submit"
            disabled={loadingName}
            className="px-8 py-4 bg-black text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-600 disabled:bg-neutral-300 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-3"
          >
            {loadingName && <Loader2 className="animate-spin" size={16} />}
            {loadingName ? "Saving..." : "Save Changes"}
          </button>
        )}
      </form>

      {/* --- Password Section --- */}
      <div className="border-t border-neutral-100 pt-10">
        {!isChangingPassword ? (
          <button
            onClick={() => setIsChangingPassword(true)}
            className="flex items-center gap-3 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:text-indigo-800 hover:bg-indigo-50 px-6 py-4 rounded-xl transition-all border border-indigo-100"
          >
            <KeyRound size={18} />
            Change Password
          </button>
        ) : (
          <form
            onSubmit={handleChangePassword}
            className="space-y-6 bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100 animate-in fade-in slide-in-from-top-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <KeyRound size={20} className="text-indigo-600" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-wider">
                Change Password
              </h3>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                className="w-full p-4 bg-white border border-neutral-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all"
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                  className="w-full p-4 bg-white border border-neutral-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all"
                  placeholder="Min 6 chars"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                  Confirm New
                </label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                  className="w-full p-4 bg-white border border-neutral-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all"
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loadingPass}
                className="px-8 py-3 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
              >
                {loadingPass && <Loader2 className="animate-spin" size={16} />}
                {loadingPass ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="px-8 py-3 bg-white border border-neutral-200 text-neutral-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-50 transition-all"
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
        console.error("Failed to fetch orders", error);
        toast.error("Could not load recent orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-black" size={40} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 animate-in fade-in duration-500">
        <div className="bg-neutral-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="text-neutral-300" size={32} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-widest mb-3 text-neutral-900">
          No Orders Yet
        </h2>
        <p className="text-neutral-500 mb-10 max-w-sm mx-auto text-sm font-medium">
          It looks like you haven't placed any orders yet. Start your collection
          today.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="px-8 py-4 bg-black text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            Recent Orders
          </h2>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Track your purchases
          </p>
        </div>
        <button
          onClick={() => navigate("/orders")}
          className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:text-indigo-800 border-b border-transparent hover:border-indigo-800 transition-all"
        >
          View All ({orders.length})
        </button>
      </div>

      <div className="space-y-6">
        {recentOrders.map((order) => (
          <div
            key={order.id}
            className="border border-neutral-100 rounded-[1.5rem] p-6 hover:shadow-lg transition-all duration-300 bg-white group hover:border-neutral-200"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              {/* Left: Icon & Info */}
              <div className="flex items-center gap-5">
                <div className="bg-neutral-50 p-4 rounded-2xl text-neutral-400 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <Package size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm text-neutral-900 uppercase tracking-wide">
                    Order #
                    <span className="font-mono ml-1 text-neutral-500">
                      {order.orderReference?.split("-")[2] ||
                        order.id.toString().slice(0, 8)}
                      ...
                    </span>
                  </p>
                  <p className="text-xs font-medium text-neutral-400 mt-1">
                    Placed on {new Date(order.orderDate).toLocaleDateString()}
                  </p>

                  <div className="mt-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border 
                        ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Price & Action */}
              <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end">
                <p className="text-xl font-bold text-black tracking-tight mb-2">
                  ${order.totalAmount?.toFixed(2)}
                </p>
                <button
                  onClick={() => navigate(`/orders`)}
                  className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 flex items-center gap-1 group/btn"
                >
                  Details{" "}
                  <ChevronRight
                    size={14}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length > 3 && (
        <div className="mt-10 text-center border-t border-neutral-100 pt-8">
          <button
            onClick={() => navigate("/orders")}
            className="text-neutral-400 font-bold text-xs uppercase tracking-widest hover:text-black transition-colors"
          >
            Show all {orders.length} orders
          </button>
        </div>
      )}
    </div>
  );
};

// --- 3. ADDRESS SECTION ---
const AddressesSection = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get(
        `${import.meta.env?.VITE_API_URL || ""}/User/Get-Address`
      );
      setAddresses(res.data);
    } catch (error) {
      console.error("Failed to load addresses: ", error);
      toast.error("Could not load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(
        `${import.meta.env?.VITE_API_URL || ""}/User/Add-Address`,
        formData
      );
      toast.success("Address added successfully");
      await fetchAddresses();
      setShowForm(false);
      setFormData({
        name: "",
        phoneNumber: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
      });
    } catch (error) {
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        const firstKey = Object.keys(serverErrors)[0];
        const msg = serverErrors[firstKey][0];
        toast.error(msg);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while saving the address.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center text-neutral-400 font-bold uppercase tracking-widest text-xs">
        Loading data...
      </div>
    );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            Address Book
          </h2>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Manage your shipping destinations
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition flex items-center gap-2 shadow-lg"
          >
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      {/* --- ADD ADDRESS FORM --- */}
      {showForm && (
        <div className="bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100 mb-10 animate-in slide-in-from-top-4 shadow-inner">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-6 text-neutral-900">
            New Destination Details
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:border-black outline-none transition-all placeholder:text-neutral-400"
                  required
                />
              </div>
              <div className="group">
                <input
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber || ""}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:border-black outline-none transition-all placeholder:text-neutral-400"
                  required
                />
              </div>
            </div>

            <input
              name="street"
              placeholder="Street Address"
              value={formData.street || ""}
              onChange={handleInputChange}
              className="w-full p-4 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:border-black outline-none transition-all placeholder:text-neutral-400"
              required
            />

            <div className="grid grid-cols-3 gap-6">
              <input
                name="city"
                placeholder="City"
                value={formData.city || ""}
                onChange={handleInputChange}
                className="w-full p-4 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:border-black outline-none transition-all placeholder:text-neutral-400"
                required
              />
              <input
                name="state"
                placeholder="State"
                value={formData.state || ""}
                onChange={handleInputChange}
                className="w-full p-4 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:border-black outline-none transition-all placeholder:text-neutral-400"
                required
              />
              <input
                name="zipCode"
                placeholder="Zip Code"
                value={formData.zipCode || ""}
                onChange={handleInputChange}
                className="w-full p-4 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:border-black outline-none transition-all placeholder:text-neutral-400"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                {submitting && <Loader2 className="animate-spin" size={16} />}
                {submitting ? "Saving..." : "Save Address"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-8 py-3 bg-white border border-neutral-200 text-neutral-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- ADDRESS LIST --- */}
      {addresses.length === 0 && !showForm ? (
        <div className="bg-white border-2 border-dashed border-neutral-200 rounded-[2rem] p-20 text-center hover:border-neutral-300 transition-colors">
          <div className="bg-neutral-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="text-neutral-400" size={32} />
          </div>
          <p className="text-neutral-500 mb-8 text-sm font-medium">
            You haven't saved any addresses yet. Add one to checkout faster.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-8 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black transition-all shadow-lg"
          >
            Add First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr, index) => (
            <div
              key={index}
              className="border border-neutral-100 p-8 rounded-[2rem] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start gap-5">
                <div className="p-3 bg-neutral-50 rounded-2xl text-neutral-400 group-hover:text-indigo-600 transition-colors">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-bold text-neutral-900 uppercase tracking-wide text-sm mb-1">
                    {addr.name}
                  </p>
                  <p className="text-sm text-neutral-500 font-medium leading-relaxed">
                    {addr.street}
                  </p>
                  <p className="text-xs text-neutral-400 uppercase font-bold tracking-wider mt-2">
                    {addr.city}, {addr.state}{" "}
                    <span className="text-neutral-900">{addr.zipCode}</span>
                  </p>
                  <p className="text-xs text-neutral-300 font-mono mt-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />{" "}
                    {addr.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MyAccount;
