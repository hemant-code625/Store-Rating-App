const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
      <h2 className="text-gray-400">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default DashboardCard;
