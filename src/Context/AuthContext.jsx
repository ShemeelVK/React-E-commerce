import { createContext,useState,useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";
import toast from "react-hot-toast";

const AuthContext=createContext(null)

export function AuthProvider({children}){
    const [currentUser,SetCurrentUser]=useState(null)
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate();

    useEffect(()=>{
      const fetchUserAPI = async () => {
        try {
          const storedUser=localStorage.getItem("user");
          const storedToken=localStorage.getItem("token");
          
          if(storedUser && storedToken){
            SetCurrentUser(JSON.parse(storedUser));
          }
          else{
            SetCurrentUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Auth initialisation error: ",error)
           SetCurrentUser(null);
           localStorage.removeItem("user");
           localStorage.removeItem("token");
        }
        finally{
          
          setLoading(false);
        }
      };

         fetchUserAPI();
    },[]);

    const loginUser=async (formData)=>{
      try{
          const res=await api.post("/Auth/login",formData);
          const {token,user}=res.data;

          localStorage.setItem("token",token);
          localStorage.setItem("user",JSON.stringify(user))

          SetCurrentUser(user);

          if(user.role==="Admin"){
            navigate("/admin")
          }
          else{
            navigate("/");
          }

          return{success:true};
      }
      catch(err){
          console.log("Error: ",err)

          return{
            success:false,
            message:err.response?.data?.error || "Something went wrong!"
          }
      }
    };

    const logoutUser=async ()=>{
      try {
        await api.post(`${import.meta.env.VITE_API_URL}/Auth/Logout`);
      } catch (error) {
        console.error("Logout error", error);
      }
      finally{
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        SetCurrentUser(null)
        navigate("/");
        toast.success("Logged out Successfully")
      }
    };

    const updateUserInAuthContext = (updatedUserData) => {
      const { password, ...userToStore } = updatedUserData;
      SetCurrentUser(userToStore);
      localStorage.setItem("user", JSON.stringify(userToStore));
    };

    const value={currentUser,SetCurrentUser,loginUser,logoutUser,updateUserInAuthContext,loading}

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen text-xl">
          Loading...
        </div>
      );
    }

    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
