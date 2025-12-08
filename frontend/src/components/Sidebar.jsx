const Sidebar = ({ setActiveTab }) => {
  const tabs = ["Dashboard", "Users", "Stores", "Add User"];

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4 hidden md:block">
      <ul>
        {tabs.map((tab) => (
          <li
            key={tab}
            className="p-2 my-1 cursor-pointer hover:bg-gray-700 rounded"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
