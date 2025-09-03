import { Route,Routes, } from "react-router-dom"
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
function App() {


  return (
    <>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route path="/Register" element={<Register />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/About" element={<About />} />
              <Route path="/Shop" element={<Shop />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/Cart" element={<Cart />} />
              <Route path="/Wishlist" element={<Wishlist />} />
              <Route path="/Orders" element={<Orders />} />
              <Route path="/MyAccount" element={<MyAccount />} />
              <Route path="/Payment" element={<Payment />} />

              <Route
                path="/"
                element={
                  <ProtectedRouter>
                    <Home />
                  </ProtectedRouter>
                }
              />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App  
