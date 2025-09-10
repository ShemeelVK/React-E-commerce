import { Route,Routes,Outlet } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRouter from "./Components/ProtectedRouter";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import MyAccount from "./pages/MyAccount";
import Payment from "./pages/Payment";
import './index.css'
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";
import { WishlistProvider } from "./Context/WishlistContext";

import AdminProtectedRouter from "./Components/Admin/AdminProtectedRouter";
import AdminLayout from "./Components/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import OrderManagement from "./pages/Admin/OrderManagement";
import ProductManagement from "./pages/Admin/ProductManagement";
import UserManagement from "./pages/Admin/UserManagement";
import Navbar from "./Components/Navbar";
function App() {


  return (
    <>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* --- Group 1: The User-Facing World (with Navbar) --- */}
              <Route
                element={
                  <>
                    <Navbar />
                    <Outlet />
                  </>
                }
              >
                <Route path="/" element={<Home />} />
                <Route path="/About" element={<About />} />
                <Route path="/Shop" element={<Shop />} />
                <Route path="/Contact" element={<Contact />} />
                <Route
                  path="/Cart"
                  element={
                    <ProtectedRouter>
                      <Cart />
                    </ProtectedRouter>
                  }
                />
                <Route
                  path="/Wishlist"
                  element={
                    <ProtectedRouter>
                      <Wishlist />
                    </ProtectedRouter>
                  }
                />
                <Route
                  path="/Orders"
                  element={
                    <ProtectedRouter>
                      <Orders />
                    </ProtectedRouter>
                  }
                />
                <Route
                  path="/MyAccount"
                  element={
                    <ProtectedRouter>
                      <MyAccount />
                    </ProtectedRouter>
                  }
                />
                <Route
                  path="/Payment"
                  element={
                    <ProtectedRouter>
                      <Payment />
                    </ProtectedRouter>
                  }
                />
              </Route>

              {/* --- Group 2: Standalone Pages (no layouts) --- */}
              <Route path="/Register" element={<Register />} />
              <Route path="/Login" element={<Login />} />

              {/* --- Group 3: The Admin World (with Admin Sidebar) --- */}
              <Route
                element={
                  <AdminProtectedRouter>
                    <AdminLayout />
                  </AdminProtectedRouter>
                }
              >
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/users" element={<UserManagement />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App  
