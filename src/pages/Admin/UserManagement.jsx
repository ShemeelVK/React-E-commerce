import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext.jsx";
import { ShieldCheck, ShieldX } from "lucide-react";
import toast from "react-hot-toast";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users except admin
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users`
        );
        const regularUsers = response.data.filter(
          (user) => user.role !== "admin"
        );
        setUsers(regularUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  //toggling the user's status
  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    const action = newStatus === "blocked" ? "block" : "unblock";

    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4 p-2 text-white">
          <p className="font-semibold text-center">
            Are you sure you want to {action} this user?
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-semibold bg-slate-600 text-white rounded-md hover:bg-slate-500"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axios.patch(
                    `${import.meta.env.VITE_API_URL}/users/${userId}`,
                    {
                      status: newStatus,
                    }
                  );
                  setUsers(
                    users.map((user) =>
                      user.id === userId ? { ...user, status: newStatus } : user
                    )
                  );
                  toast.success(`User has been successfully ${action}ed.`);
                } catch (error) {
                  console.error("Failed to update user status:", error);
                  toast.error(
                    "An error occurred while updating the user's status."
                  );
                }
              }}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-md ${
                action === "block"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Yes, {action.charAt(0).toUpperCase() + action.slice(1)}
            </button>
          </div>
        </div>
      ),
      {
        id: "user-status-confirmation",
        style: {
          background: "#1f2937",
          border: "1px solid #334155",
        },
      }
    );
  };

  if (loading) {
    return <div className="text-white">Loading user data...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">User Management</h1>
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
            <tbody>
              {users.map((user) => (
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
                        user.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {user.status === "active" ? (
                        <ShieldCheck size={14} />
                      ) : (
                        <ShieldX size={14} />
                      )}
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
                        user.status === "active"
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/40"
                          : "bg-green-500/20 text-green-400 hover:bg-green-500/40"
                      }`}
                    >
                      {user.status === "active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
