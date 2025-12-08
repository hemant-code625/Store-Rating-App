import { useState } from "react";

const UserList = ({ users }) => {
  const [filter, setFilter] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase()) ||
      u.address?.toLowerCase().includes(filter.toLowerCase()) ||
      u.role.toLowerCase().includes(filter.toLowerCase())
  );

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
            <th className="py-2 px-3">Name</th>
            <th className="py-2 px-3">Email</th>
            <th className="py-2 px-3">Address</th>
            <th className="py-2 px-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, i) => (
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
