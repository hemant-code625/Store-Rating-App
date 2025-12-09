import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/admin/Sidebar";
import DashboardCard from "../components/admin/DashboardCard";
import UserList from "../components/admin/UserList";
import StoreList from "../components/admin/StoreList";
import AddUserForm from "../components/admin/AddUserForm";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [users, setUsers] = useState([]);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [storeAverages, setStoreAverages] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [usersRes, averagesRes] = await Promise.all([
        fetch("http://localhost:8080/api/users/getUsers", {
          method: "GET",
          credentials: "include",
        }),
        fetch("http://localhost:8080/api/ratings/averages/all", {
          method: "GET",
          credentials: "include",
        }),
      ]);

      const usersJson = await usersRes.json();
      const averagesJson = await averagesRes.json();

      if (!usersRes.ok) {
        throw new Error(usersJson.message || "Failed to fetch users");
      }

      if (!averagesRes.ok) {
        throw new Error(
          averagesJson.message || "Failed to fetch store averages"
        );
      }

      setUsers(usersJson.data || []);

      const averagesMap = averagesJson?.data?.averages || {};
      setStoreAverages(averagesMap);

      const totalRatingsCount = Object.values(averagesMap).reduce(
        (sum, store) => sum + (store.totalRatings || 0),
        0
      );
      setRatingsCount(totalRatingsCount);

      setError("");
    } catch (e) {
      console.error(e);
      setError(e.message || "Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stores = users
    .filter((u) => u.role === "OWNER")
    .map((owner) => {
      const storeStats = storeAverages[owner.id] || {};

      return {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        address: owner.address,
        rating:
          storeStats.totalRatings > 0 ? storeStats.averageRating : "No ratings",
        totalRatings: storeStats.totalRatings || 0,
      };
    });

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
