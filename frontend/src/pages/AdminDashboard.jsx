import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import UserList from "../components/UserList";
import StoreList from "../components/StoreList";
import AddUserForm from "../components/AddUserForm";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [users, setUsers] = useState([]);
  const [ratingsCount, setRatingsCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/users/getUsers", {
        method: "GET",
        credentials: "include",
      });

      const res = await response.json();

      if (!response.ok) {
        setError(res.message || "Failed to fetch users");
        return;
      }

      setUsers(res.data || []);
      setError("");
    } catch (e) {
      console.error(e);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const stores = users
    .filter((u) => u.role === "OWNER")
    .map((owner) => ({
      id: owner.id,
      name: owner.name,
      email: owner.email,
      address: owner.address,
      // rating will be calculated as average of ratings from all users
    }));

  // Add user locally
  const handleAddUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <Sidebar setActiveTab={setActiveTab} />

      <div className="flex-1">
        <Navbar user={useAuth().user} />

        <main className="p-4">
          {loading && <p className="text-blue-400">Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {activeTab === "Dashboard" && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardCard title="Total Users" value={users.length} />
              <DashboardCard title="Total Stores" value={stores.length} />
              <DashboardCard title="Total Ratings" value={ratingsCount} />
            </div>
          )}

          {activeTab === "Users" && <UserList users={users} />}

          {activeTab === "Stores" && <StoreList stores={stores} />}

          {activeTab === "Add: Store Owner, Admin or User" && (
            <AddUserForm onAdd={handleAddUser} />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
