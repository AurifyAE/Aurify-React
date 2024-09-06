import { MonitorPlay, ShoppingCart, SquareUser, CreditCard } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axiosInstance from "../../axios/axiosInstance";

const MetricCard = ({ title, value, icon: Icon, additionalInfo }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
    <div>
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <div className="flex items-center">
        <p className="text-2xl font-bold">{value}</p>
        {additionalInfo && (
          <span className="text-green-500 text-sm ml-2">{additionalInfo}</span>
        )}
      </div>
    </div>
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-3 rounded-lg">
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeDeviceCount, setActiveDeviceCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [userCount, setUserCount] = useState(null); //fetch the userdata count
  const [adminId, setAdminId] = useState(null);

  

  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        setError("User not logged in");
        return;
      }

      try {
        const response = await axiosInstance.get(`/data/${userEmail}`);
        setUserData(response.data);
        setAdminId(response.data.data._id);
        await fetchUser(response.data.data._id);
        await fetchAdminData(response.data.data._id);
      } catch (err) {
        setError("Failed to fetch user data: " + err.message);
      }
    };

    fetchUserData();
  }, []);

  const fetchAdminData = async (id) => {
    try {
      const response = await axiosInstance.get(`/admin/${id}/device`);
      if (response.data.success) {
        setActiveDeviceCount(response.data.activeDeviceCount || 0);
      } else {
        setError(response.data.message || "Failed to fetch admin data");
      }
    } catch (error) {
      setError("Error fetching admin data: " + error.message);
    }
  };

  const fetchUser = async (id) => {
    try {
      const response = await axiosInstance.get(`/admin/${id}/users`);
      if (response.data.success) {
        setUserCount(response.data.users.length);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const salesData = [
    { name: "Apr", Gold: 50, Silver: 100 },
    { name: "May", Gold: 150, Silver: 200 },
    { name: "Jun", Gold: 200, Silver: 250 },
    { name: "Jul", Gold: 300, Silver: 350 },
    { name: "Aug", Gold: 250, Silver: 400 },
    { name: "Sep", Gold: 350, Silver: 300 },
    { name: "Oct", Gold: 200, Silver: 400 },
    { name: "Nov", Gold: 400, Silver: 300 },
    { name: "Dec", Gold: 300, Silver: 450 },
  ];

  const clientsData = [400, 200, 100, 200, 400, 100, 400, 200, 400];

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex-1 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <div>
            <h3 className="text-gray-500 text-sm">My Screen</h3>
            <div className="flex items-center">
              <p className="text-2xl font-bold">
                {activeDeviceCount}/{userData?.data?.screenLimit || 0}
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-3 rounded-lg">
            <MonitorPlay className="w-6 h-6 text-white" />
          </div>
        </div>
        <MetricCard
          title="Users"
          value={userCount ? userCount : 0}
          icon={SquareUser}
        />
        <MetricCard
          title="Txn Requests"
          value="34"
          icon={ShoppingCart}
          additionalInfo="0%"
        />
        <MetricCard
          title="Total Revenue"
          value="$12,345"
          icon={CreditCard}
          additionalInfo="+5.2%"
        />
      </div>

      <div className="bg-teal-900 rounded-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Add a new reminder"
            className="w-full bg-white text-gray-800 p-3 rounded-lg"
          />
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg ml-4 uppercase text-sm font-bold">
            Clear All
          </button>
        </div>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("All")}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              activeTab === "All"
                ? "bg-transparent text-purple-600"
                : "bg-transparent border-gray-600 text-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("Pending")}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              activeTab === "Pending"
                ? "bg-transparent text-purple-600"
                : "bg-transparent border-gray-600 text-gray-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("Completed")}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              activeTab === "Completed"
                ? "bg-transparent text-purple-600"
                : "bg-transparent border-gray-600 text-gray-300"
            }`}
          >
            Completed
          </button>
        </div>
        <hr className="border-teal-800 mb-4" />
        <p className="text-gray-400 mb-24">You don't have any reminder here</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Clients Chart */}
        <div className="bg-slate-800 rounded-lg shadow-md p-4">
          <h2 className="text-white text-lg font-semibold mb-2">
            Active Clients
          </h2>
          <p className="text-gray-400 text-sm mb-4">(+0%) than last week</p>
          <div className="h-40 flex items-end justify-between">
            {clientsData.map((value, index) => (
              <div
                key={index}
                className="bg-white w-6 rounded-t"
                style={{ height: `${value / 4}%` }}
              ></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-gray-800 text-lg font-semibold mb-2">
            Sales Overview
          </h2>
          <p className="text-green-500 text-sm mb-4">↑ 0% more in 2023</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="Gold"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorValue1)"
              />
              <Area
                type="monotone"
                dataKey="Silver"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorValue2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
