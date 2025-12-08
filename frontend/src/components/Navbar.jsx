import { useAuth } from "../context/AuthContext";

const Navbar = ({ user }) => {
  const { logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center rounded-2xl mt-2">
      <h1 className="font-bold text-xl">{user?.role} Dashboard</h1>
      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
