import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useRating } from "../context/RatingContext.jsx";
import HandleRating from "../components/user/HandleRating.jsx";

const UserDashboard = ({ user }) => {
  const [stores, setStores] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [rateLoading, setRatingsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
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
        // Initialize ratings after stores are loaded
        await initializeAllRatings();
        setRatingsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load stores");
      setRatingsLoading(false);
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

  const sortedStores = [...filteredStores].sort((a, b) => {
    const { key, direction } = sortConfig;

    const dir = direction === "asc" ? 1 : -1;

    const normalizeValue = (store, sortKey) => {
      if (sortKey === "averageRating") {
        // Try to get from context first, then from store object
        const contextRating = getAverageRating(store.id);
        const rating =
          contextRating !== 0 ? contextRating : store.averageRating;
        if (typeof rating === "number") return rating;
        const parsed = Number(rating);
        return Number.isNaN(parsed) ? -1 : parsed;
      }
      return String(store[sortKey] || "").toLowerCase();
    };

    const aValue = normalizeValue(a, key);
    const bValue = normalizeValue(b, key);

    if (aValue < bValue) return -1 * dir;
    if (aValue > bValue) return 1 * dir;
    return 0;
  });

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

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
                  <th
                    className="py-2 px-3 cursor-pointer select-none"
                    onClick={() => toggleSort("name")}
                  >
                    Store Name {renderSortIcon("name")}
                  </th>
                  <th
                    className="py-2 px-3 cursor-pointer select-none"
                    onClick={() => toggleSort("address")}
                  >
                    Address {renderSortIcon("address")}
                  </th>
                  <th
                    className="py-2 px-3 cursor-pointer select-none"
                    onClick={() => toggleSort("averageRating")}
                  >
                    Average Rating {renderSortIcon("averageRating")}
                  </th>
                  <th className="py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedStores.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-gray-400 py-4 px-3 text-center"
                    >
                      No stores found.
                    </td>
                  </tr>
                ) : (
                  sortedStores.map((store) => (
                    <tr
                      key={store.id}
                      className="border-b border-gray-700 hover:bg-gray-800 transition"
                    >
                      <td className="py-2 px-3">{store.name}</td>
                      <td className="py-2 px-3">{store.address}</td>
                      <td className="py-2 px-3">
                        {rateLoading
                          ? "Loading..."
                          : getAverageRating(store.id)}
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
