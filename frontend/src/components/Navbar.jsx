import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserProfile from "./UserProfile";

const Navbar = ({ user }) => {
  const { logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center rounded-2xl mt-2">
        <h1 className="font-bold text-xl">{user?.role} Dashboard</h1>
        <button
          onClick={() => setProfileOpen(true)}
          className="border border-violet-400 cursor-pointer rounded-2xl px-4 py-2 font-semibold transition"
        >
          👤 Profile
        </button>
      </nav>
      <UserProfile isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

export default Navbar;
