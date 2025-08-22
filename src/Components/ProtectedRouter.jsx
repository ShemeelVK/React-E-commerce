import { Navigate } from "react-router-dom"
import Login from "../pages/Login";

function ProtectedRouter({children}){
    const user=localStorage.getItem("user")
    return user?children : <Navigate to="/Login"/>
}
export default ProtectedRouter