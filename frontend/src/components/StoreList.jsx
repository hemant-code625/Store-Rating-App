import { useState } from "react";

const StoreList = ({ stores }) => {
  const [filter, setFilter] = useState("");

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.email.toLowerCase().includes(filter.toLowerCase()) ||
      s.address.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4 overflow-x-auto">
      <input
        type="text"
        placeholder="Filter by Name, Email, Address"
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
            <th className="py-2 px-3">Rating</th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.map((store, i) => (
            <tr key={i} className="border-b border-gray-700 hover:bg-gray-800">
              <td className="py-2 px-3">{store.name}</td>
              <td className="py-2 px-3">{store.email}</td>
              <td className="py-2 px-3">{store.address}</td>
              <td className="py-2 px-3">{store.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreList;
