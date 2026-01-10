import { Route,Routes,Outlet } from "react-router-dom"
// User Side
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
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";
import { WishlistProvider } from "./Context/WishlistContext";
import './index.css'
import Navbar from "./Components/Navbar";
import { useState,useEffect } from "react";
  
// Admin Side
import AdminProtectedRouter from "./Components/Admin/AdminProtectedRouter";
import AdminLayout from "./Components/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import OrderManagement from "./pages/Admin/OrderManagement";
import ProductManagement from "./pages/Admin/ProductManagement";
import UserManagement from "./pages/Admin/UserManagement";

import { Toaster } from "react-hot-toast";
function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
   const storedUser = localStorage.getItem("user");
   if (storedUser) {
     // Parse the string back into an object and put it into your state
     setUser(JSON.parse(storedUser));
   }
   setLoading(false);
 }, []);

  return (
    <>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 5000,
                style: {
                  borderRadius: "8px",
                  background: "#333",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  style: {
                    background: "#10B981", 
                    color: "white",
                  },
                  
                  iconTheme: {
                    primary: "#DAF7A6",
                    secondary: "#10B981",
                  },
                },
                error: {
                  style: {
                    background: "#EF4444", // Red for errors
                    color: "white",
                  },
                },
                warning: {
                  style: {
                    background: "#F59E0B",
                    color: "white",
                  },
                },
              }}
            />
            <Routes>
              
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

              
              <Route path="/Register" element={<Register />} />
              <Route path="/Login" element={<Login />} />

              
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
