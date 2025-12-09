import { useState } from "react";

const UserList = ({ users }) => {
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase()) ||
      u.address?.toLowerCase().includes(filter.toLowerCase()) ||
      u.role.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const { key, direction } = sortConfig;

    const dir = direction === "asc" ? 1 : -1;

    const normalizeValue = (val) => {
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
        placeholder="Search by Name, Email, Address, Role"
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
              onClick={() => toggleSort("role")}
            >
              Role {renderSortIcon("role")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, i) => (
            <tr key={i} className="border-b border-gray-700 hover:bg-gray-800">
              <td className="py-2 px-3">{user.name}</td>
              <td className="py-2 px-3">{user.email}</td>
              <td className="py-2 px-3">{user.address}</td>
              <td className="py-2 px-3">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
