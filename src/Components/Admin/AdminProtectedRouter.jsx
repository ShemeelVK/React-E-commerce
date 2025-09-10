import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

function AdminProtectedRouter({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to the homepage if the user is not an admin
  if (currentUser.role !== "admin") {
    // replace prop is used to prevent the user from going back to the admin page
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the child component (the admin page)
  return children;
}

export default AdminProtectedRouter;
