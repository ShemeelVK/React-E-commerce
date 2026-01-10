import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

function AdminProtectedRouter({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null; 
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

 
  if (currentUser.role !== "Admin") {
    
    return <Navigate to="/" replace />;
  }

 
  return children;
}

export default AdminProtectedRouter;
