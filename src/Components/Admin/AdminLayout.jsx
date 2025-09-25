import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, ShoppingBag, Box, LogOut } from "lucide-react";
import { useAuth } from "../../Context/AuthContext.jsx";
import toast from "react-hot-toast";
function AdminLayout() {
  const { logoutUser, currentUser } = useAuth();

  const handleLogout = () => {
   
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4 p-2">
          <p className="font-semibold text-center text-white">
            Are you sure you want to log out?
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-semibold bg-slate-600 text-white rounded-md hover:bg-slate-500"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                logoutUser();
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      ),
      {

        id: "logout-confirmation",
      }
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-gray-200">
      {/*Sidebar Navigation*/}
      <aside className="w-64 flex-shrink-0 bg-slate-800 border-r border-slate-700">
        <div className="p-6 text-2xl font-extrabold text-white border-b border-slate-700 text-center">
          Elevé <span className="text-indigo-400">Admin</span>
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

      <div className="flex-1 flex flex-col">
        <header className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">
            Welcome, {currentUser?.name}
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 font-semibold hover:text-red-400 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </header>

        {/*Page Content*/}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


const AdminNavLink = ({ to, icon, children }) => {
  const baseClasses =
    "w-full flex items-center gap-3 p-3 rounded-md font-semibold transition-colors duration-200";
  const activeClasses = "bg-indigo-600 text-white";
  const inactiveClasses = "text-slate-400 hover:bg-slate-700 hover:text-white";

  return (
    <NavLink
      to={to}
      end={to === "/admin"} 
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
