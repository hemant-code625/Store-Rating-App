import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HandleRating from "./ui/HandleRating";
import { useRating } from "../context/RatingContext";

const UserDashboard = ({ user }) => {
  const [stores, setStores] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { getAverageRating, initializeAllRatings } = useRating();

  const fetchStores = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/users/getStores",
        {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setStores(data.data || []);
        await initializeAllRatings();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load stores");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await fetchStores();
      } finally {
        setLoading(false);
      }
    })();
  }, [initializeAllRatings]);

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(filter.toLowerCase()) ||
      store.address?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading stores...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400">
        {error}
      </div>
    );

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <div className="flex-1">
        <Navbar user={user} />
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-4">Rate your favorite stores</h2>

          <input
            type="text"
            placeholder="Search by store name or address"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mb-4 px-3 py-2 rounded w-full bg-gray-800 text-white placeholder-gray-400"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 px-3">Store Name</th>
                  <th className="py-2 px-3">Address</th>
                  <th className="py-2 px-3">Average Rating</th>
                  <th className="py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-gray-400 py-4 px-3 text-center"
                    >
                      No stores found.
                    </td>
                  </tr>
                ) : (
                  filteredStores.map((store) => (
                    <tr
                      key={store.id}
                      className="border-b border-gray-700 hover:bg-gray-800 transition"
                    >
                      <td className="py-2 px-3">{store.name}</td>
                      <td className="py-2 px-3">{store.address}</td>
                      <td className="py-2 px-3">
                        {getAverageRating(store.id) ||
                          store.averageRating ||
                          "N/A"}
                      </td>
                      <td className="py-2 px-3 ">
                        <HandleRating storeId={store.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
