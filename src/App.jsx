import { Route,Routes, } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import ProtectedRouter from "./Components/ProtectedRouter";
function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route
          path="/HomePage"
          element={
            <ProtectedRouter>
              <HomePage />
            </ProtectedRouter>
          }
        />
      </Routes>
    </>
  );
}

export default App  
