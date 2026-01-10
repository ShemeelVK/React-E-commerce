import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext.jsx";
import { ShieldCheck, ShieldX, Search,Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api.js";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  

  // Fetch users except admin
  
    const fetchUsers = async (query="") => {
      setLoading(true);
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/User/Search-Users`,
          {params: { search:query } }
        );

        const regularUsers = response.data.filter(
          (user) => user.role !== "Admin"
        );
        setUsers(regularUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load Users");
      } finally {
        setLoading(false);
      }
    };

    useEffect(()=>{
      const delayDebounceFn=setTimeout(() => {
        fetchUsers(searchTerm)
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    },[searchTerm])


  //toggling the user's status
  const handleToggleStatus = (userId, currentIsActive, userName) => {
    const action = currentIsActive ? "Block" : "Unblock";

    toast(
      (t) => (
        // 1. Container: Matches Logout Toast (flex-col, gap-4, p-2)
        <div className="flex flex-col items-center gap-4 p-2">
          {/* 2. Text: White and Semibold */}
          <p className="font-semibold text-center text-white">
            Are you sure you want to {action.toLowerCase()} <b>{userName}?</b>
          </p>

          {/* 3. Buttons: Gap-4 */}
          <div className="flex gap-4">
            {/* LEFT BUTTON: Cancel (Always on left) */}
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-semibold bg-slate-600 text-white rounded-md hover:bg-slate-500 transition"
            >
              Cancel
            </button>

            {/* RIGHT BUTTON: Action (Block/Unblock) */}
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await api.put(
                    `${
                      import.meta.env.VITE_API_URL
                    }/User/Toggle-Status/${userId}`
                  );

                  setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                      user.id === userId
                        ? { ...user, isActive: !user.isActive }
                        : user
                    )
                  );
                  toast.success(`User has been successfully ${action}ed.`);
                } catch (error) {
                  console.error("Failed to update user status:", error);
                  toast.error("An error occurred.");
                }
              }}
              // Dynamic Color: Red for Block, Green for Unblock
              // But Size/Font matches the Logout button exactly
              className={`px-4 py-2 text-sm font-semibold text-white rounded-md transition ${
                action === "Block"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Yes, {action}
            </button>
          </div>
        </div>
      ),
      {
        id: "user-status-confirmation",
        position: "top-center",
        duration: 3000,
        // 4. Style: Dark background to match the 'text-white' class
        style: {
          background: "#1f2937", // Dark Slate
          color: "#fff",
          border: "1px solid #334155",
        },
      }
    );
  };


  return (
    <div>
      {/* Header & Search Bar Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">User Management</h1>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-sm text-white pl-10 pr-4 py-2 rounded-lg outline-none focus:border-blue-500 transition-colors"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-slate-500" />
          )}
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
              <tr>
                <th className="p-4">User ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.length === 0 && !loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-700 hover:bg-slate-700/50"
                  >
                    <td className="p-4 font-medium">#{user.id}</td>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${
                          user.isActive
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {user.isActive ? (
                          <ShieldCheck size={14} />
                        ) : (
                          <ShieldX size={14} />
                        )}
                        {user.isActive ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          handleToggleStatus(user.id, user.isActive, user.name)
                        }
                        className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
                          user.isActive
                            ? "bg-red-500/20 text-red-400 hover:bg-red-500/40"
                            : "bg-green-500/20 text-green-400 hover:bg-green-500/40"
                        }`}
                      >
                        {user.isActive ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
