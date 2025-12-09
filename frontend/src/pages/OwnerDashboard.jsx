import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";

const OwnerDashboard = ({ user }) => {
  const [storeRatings, setStoreRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "userName",
    direction: "asc",
  });

  const fetchStoreRatings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/ratings/store/${user.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok && data.data) {
        setStoreRatings(data.data.ratings || []);
        setAverageRating(data.data.averageRating || 0);
        setError("");
      } else {
        setError(data.message || "Failed to fetch store ratings");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load store ratings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchStoreRatings();
    }
  }, [user?.id]);

  const filteredRatings = storeRatings.filter(
    (rating) =>
      rating.userName?.toLowerCase().includes(filter.toLowerCase()) ||
      rating.userEmail?.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedRatings = [...filteredRatings].sort((a, b) => {
    const { key, direction } = sortConfig;
    const dir = direction === "asc" ? 1 : -1;

    const normalizeValue = (rating, sortKey) => {
      if (sortKey === "rating") {
        if (typeof rating[sortKey] === "number") return rating[sortKey];
        const parsed = Number(rating[sortKey]);
        return Number.isNaN(parsed) ? -1 : parsed;
      }
      return String(rating[sortKey] || "").toLowerCase();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <div className="flex-1">
        <Navbar user={user} />
        <main className="p-6">
          {/* Store Info Card */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-gray-400">{user.address}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Average Rating</p>
                <p className="text-4xl font-bold text-yellow-400">
                  {averageRating > 0 ? averageRating.toFixed(2) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Input */}
          <input
            type="text"
            placeholder="Search by user name or email"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mb-4 px-3 py-2 rounded w-full bg-gray-800 text-white placeholder-gray-400"
          />
          {/* Ratings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th
                    className="py-2 px-3 cursor-pointer select-none"
                    onClick={() => toggleSort("userName")}
                  >
                    User Name {renderSortIcon("userName")}
                  </th>
                  <th
                    className="py-2 px-3 cursor-pointer select-none"
                    onClick={() => toggleSort("userEmail")}
                  >
                    Email {renderSortIcon("userEmail")}
                  </th>
                  <th
                    className="py-2 px-3 cursor-pointer select-none"
                    onClick={() => toggleSort("rating")}
                  >
                    Rating {renderSortIcon("rating")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRatings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-gray-400 py-4 px-3 text-center"
                    >
                      No ratings yet.
                    </td>
                  </tr>
                ) : (
                  sortedRatings.map((rating, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-800 transition"
                    >
                      <td className="py-2 px-3">{rating.userName}</td>
                      <td className="py-2 px-3">{rating.userEmail}</td>
                      <td className="py-2 px-3">
                        <span className="bg-gray-700 text-white px-2 py-1 rounded font-semibold">
                          {rating.rating}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Stats Summary */}
          {sortedRatings.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Total Ratings</p>
                <p className="text-2xl font-bold">{sortedRatings.length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Highest Rating</p>
                <p className="text-2xl font-bold">
                  {Math.max(...sortedRatings.map((r) => r.rating))}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Lowest Rating</p>
                <p className="text-2xl font-bold">
                  {Math.min(...sortedRatings.map((r) => r.rating))}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
