import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { login } = useAuth();

  if (!login) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
