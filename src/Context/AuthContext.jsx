import { createContext,useState,useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cart from "../pages/Cart";

const AuthContext=createContext(null)

export function AuthProvider({children}){
    const [currentUser,SetCurrentUser]=useState(null)
    const navigate=useNavigate();

    useEffect(()=>{
        const storedUser=localStorage.getItem("user")
        if(storedUser){
            SetCurrentUser(JSON.parse(storedUser))
        }
    },[]);

    const loginUser=(userData)=>{
        const userToStore = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          cart:userData.cart || [],
          wishlist:userData.wishlist || [],
        };
        localStorage.setItem("user",JSON.stringify(userToStore))
        SetCurrentUser(userToStore)
        navigate("/")
    };

    const logoutUser=()=>{
        localStorage.removeItem("user")
        SetCurrentUser(null)
        navigate("/Login");
    };

      const updateUserInAuthContext = (updatedUserData) => {
        SetCurrentUser(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));
      };

    const value={currentUser,SetCurrentUser,loginUser,logoutUser,updateUserInAuthContext}
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
