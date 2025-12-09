import { useState } from "react";

const StoreList = ({ stores }) => {
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.email.toLowerCase().includes(filter.toLowerCase()) ||
      s.address.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedStores = [...filteredStores].sort((a, b) => {
    const { key, direction } = sortConfig;

    const dir = direction === "asc" ? 1 : -1;

    const normalizeValue = (val) => {
      if (key === "rating" || key === "totalRatings") {
        if (typeof val === "number") return val;
        const parsed = Number(val);
        return Number.isNaN(parsed) ? -1 : parsed;
      }
      return String(val || "").toLowerCase();
    };

    const aValue = normalizeValue(a[key]);
    const bValue = normalizeValue(b[key]);

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

  return (
    <div className="p-4 overflow-x-auto">
      <input
        type="text"
        placeholder="Search by Name, Email, Address"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 px-3 py-2 rounded w-full bg-gray-800 text-white placeholder-gray-400"
      />
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            <th
              className="py-2 px-3 cursor-pointer select-none"
              onClick={() => toggleSort("name")}
            >
              Name {renderSortIcon("name")}
            </th>
            <th
              className="py-2 px-3 cursor-pointer select-none"
              onClick={() => toggleSort("email")}
            >
              Email {renderSortIcon("email")}
            </th>
            <th
              className="py-2 px-3 cursor-pointer select-none"
              onClick={() => toggleSort("address")}
            >
              Address {renderSortIcon("address")}
            </th>
            <th
              className="py-2 px-3 cursor-pointer select-none"
              onClick={() => toggleSort("rating")}
            >
              Average Rating {renderSortIcon("rating")}
            </th>
            <th
              className="py-2 px-3 cursor-pointer select-none"
              onClick={() => toggleSort("totalRatings")}
            >
              Total Ratings {renderSortIcon("totalRatings")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedStores.map((store, i) => {
            const ratingDisplay =
              store.totalRatings > 0 ? `${store.rating}` : "No ratings yet";

            return (
              <tr
                key={i}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="py-2 px-3">{store.name}</td>
                <td className="py-2 px-3">{store.email}</td>
                <td className="py-2 px-3">{store.address}</td>
                <td className="py-2 px-3">{ratingDisplay}</td>
                <td className="py-2 px-3">{store.totalRatings}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StoreList;
