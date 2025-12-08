import { useEffect } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { useNavigate } from "react-router-dom";
import UserDashboard from "./components/UserDashboard.jsx";
import OwnerDashboard from "./components/OwnerDashboard.jsx";

const App = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  if (user === undefined || user === null) {
    navigate("/login");
    return null;
  }
  if (role === "ADMIN") {
    return <AdminDashboard />;
  }
  if (role === "USER") {
    return <UserDashboard user={user} />;
  }
  // if (role === "OWNER") {
  //   return <OwnerDashboard user={user} />;
  // }

  return (
    <div className="bg-gray-900 text-white text-xl min-h-screen flex flex-col items-center justify-center">
      <p>Unauthorized Role</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 rounded-sm cursor-pointer hover:bg-blue-700"
        onClick={() => (window.location.href = "/login")}
      >
        Click here to Login
      </button>
    </div>
  );
};

export default App;
