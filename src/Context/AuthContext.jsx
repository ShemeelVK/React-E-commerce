import { createContext,useState,useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext=createContext(null)

export function AuthProvider({children}){
    const [currentUser,SetCurrentUser]=useState(null)
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate();

    useEffect(()=>{
      const fetchUserAPI = async () => {
        const storedUser=localStorage.getItem("user")
           if (storedUser) {
             try {
               const userId = JSON.parse(storedUser).id;
               const res = await axios.get(
                 `http://localhost:3000/users/${userId}`
               );
               SetCurrentUser(res.data);
             } catch (err) {
               console.error("Failed to sync user from API:", err);
               localStorage.removeItem("user")
               SetCurrentUser(null)
             }
           }
           setLoading(false)
         };

         fetchUserAPI();
    },[]);

    const loginUser=(userData)=>{
      const { password, ...userToStore } = userData;
        SetCurrentUser(userToStore)
        localStorage.setItem("user",JSON.stringify(userToStore))
        navigate("/")
    };

    const logoutUser=()=>{
        localStorage.removeItem("user")
        SetCurrentUser(null)
        navigate("/Login");
    };

    const updateUserInAuthContext = (updatedUserData) => {
      const { password, ...userToStore } = updatedUserData;
      SetCurrentUser(userToStore);
      localStorage.setItem("user", JSON.stringify(userToStore));
    };

    const value={currentUser,SetCurrentUser,loginUser,logoutUser,updateUserInAuthContext}

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
