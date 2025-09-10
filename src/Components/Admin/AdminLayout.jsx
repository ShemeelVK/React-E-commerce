import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, ShoppingBag, Box, LogOut } from "lucide-react";
import { useAuth } from "../../Context/AuthContext.jsx";

function AdminLayout() {
  const { logoutUser, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logoutUser();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* --- Sidebar Navigation --- */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-lg">
        <div className="p-6 text-2xl font-extrabold text-indigo-700 border-b">
          Elevé Admin
        </div>
        <nav className="p-4 space-y-2">
          <AdminNavLink to="/admin" icon={<LayoutDashboard size={20} />}>
            Dashboard
          </AdminNavLink>
          <AdminNavLink to="/admin/users" icon={<Users size={20} />}>
            Users
          </AdminNavLink>
          <AdminNavLink to="/admin/products" icon={<Box size={20} />}>
            Products
          </AdminNavLink>
          <AdminNavLink to="/admin/orders" icon={<ShoppingBag size={20} />}>
            Orders
          </AdminNavLink>
        </nav>
      </aside>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Welcome, {currentUser?.name}
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {/* Outlet is the placeholder where the child pages (Dashboard, etc.) will be rendered */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Helper component for sidebar links to handle active styling
const AdminNavLink = ({ to, icon, children }) => {
  const baseClasses =
    "w-full flex items-center gap-3 p-3 rounded-md font-semibold transition";
  const activeClasses = "bg-indigo-100 text-indigo-700";
  const inactiveClasses = "hover:bg-gray-100";

  return (
    <NavLink
      to={to}
      end // Use 'end' for the Dashboard link to prevent it from being active on other routes
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
};

export default AdminLayout;
