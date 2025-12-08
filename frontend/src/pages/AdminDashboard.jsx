import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import UserList from "../components/UserList";
import StoreList from "../components/StoreList";
import AddUserForm from "../components/AddUserForm";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [users, setUsers] = useState([
    { name: "Alice", email: "alice@example.com", address: "NY", role: "admin" },
    { name: "Bob", email: "bob@example.com", address: "LA", role: "user" },
  ]);
  const [stores, setStores] = useState([
    { name: "Store 1", email: "s1@example.com", address: "NY", rating: 4.5 },
    { name: "Store 2", email: "s2@example.com", address: "LA", rating: 4.2 },
  ]);
  const [ratings, setRatings] = useState(15); // total submitted ratings

  const handleAddUser = (user) => {
    setUsers([...users, user]);
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <Sidebar setActiveTab={setActiveTab} />
      <div className="flex-1">
        <Navbar />
        <main className="p-4">
          {activeTab === "Dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardCard title="Total Users" value={users.length} />
              <DashboardCard title="Total Stores" value={stores.length} />
              <DashboardCard title="Total Ratings" value={ratings} />
            </div>
          )}
          {activeTab === "Users" && <UserList users={users} />}
          {activeTab === "Stores" && <StoreList stores={stores} />}
          {activeTab === "Add User" && <AddUserForm onAdd={handleAddUser} />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
