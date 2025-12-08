import { useEffect } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { useNavigate } from "react-router-dom";
const App = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role;
  console.log("User Role:", role, user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      {role === "ADMIN" ? (
        <AdminDashboard />
      ) : (
        <>
          <p>Hello Guest</p>
        </>
      )}
    </>
  );
};

export default App;
