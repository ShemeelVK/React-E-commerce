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
import './index.css'
function App() {


  return (
    <>
      <Routes>
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/About" element={<About />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Wishlist" element={<Wishlist />} />
        <Route
          path="/"
          element={
            <ProtectedRouter>
              <Home />
            </ProtectedRouter>
          }
        />
      </Routes>
    </>
  );
}

export default App  
