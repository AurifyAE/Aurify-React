import { MonitorPlay, ShoppingCart, SquareUser, CreditCard, Bell, User } from "lucide-react";
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
    <div className="primary-gradient p-3 rounded-lg">
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
      const userName = localStorage.getItem("userName");
      if (!userName) {
        setError("User not logged in");
        return;
      }

      try {
        const response = await axiosInstance.get(`/data/${userName}`);
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
    <div className="min-h-screen bg-[#f4f7fb] p-5 overflow-x-hidden">
      
  
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {/* Card */}
        <div className="relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100 blur-3xl opacity-60 rounded-full"></div>
  
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-slate-500 text-sm mb-2">My Screen</p>
  
                <h2 className="text-4xl font-bold text-slate-800">
                  {activeDeviceCount}/
                  <span className="text-slate-400">
                    {userData?.data?.screenLimit || 0}
                  </span>
                </h2>
              </div>
  
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 border-1 border-cyan-200 flex items-center justify-center">
                <MonitorPlay className="w-7 h-7 text-cyan-600" />
              </div>
            </div>
  
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[70%] h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
  
        {/* Users */}
        <div className="relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-100 blur-3xl opacity-60 rounded-full"></div>
  
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-2">Users</p>
  
              <h2 className="text-4xl font-bold text-slate-800">
                {userCount || 0}
              </h2>
  
              <p className="text-sm text-slate-400 mt-2">
                Total active users
              </p>
            </div>
  
            <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center">
              <SquareUser className="w-7 h-7 text-violet-600" />
            </div>
          </div>
        </div>
  
        {/* Transaction */}
        <div className="relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 blur-3xl opacity-60 rounded-full"></div>
  
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-2">Txn Requests</p>
  
              <h2 className="text-4xl font-bold text-slate-800">34</h2>
  
              <p className="text-emerald-600 text-sm font-semibold mt-2">
                ↑ 0% vs last week
              </p>
            </div>
  
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <ShoppingCart className="w-7 h-7 text-emerald-600" />
            </div>
          </div>
        </div>
  
        {/* Revenue */}
        <div className="relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 blur-3xl opacity-60 rounded-full"></div>
  
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-2">Revenue</p>
  
              <h2 className="text-4xl font-bold text-slate-800">
                $12,345
              </h2>
  
              <p className="text-pink-600 text-sm font-semibold mt-2">
                ↑ 5.2% growth
              </p>
            </div>
  
            <div className="w-14 h-14 rounded-2xl bg-pink-50 border border-pink-200  flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-pink-600" />
            </div>
          </div>
        </div>
      </div>
  
      {/* Reminder */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
        {/* Input */}
        <div className="flex flex-col xl:flex-row gap-4 mb-5">
          <input
            type="text"
            placeholder="Add a reminder..."
            className="flex-1 h-14 rounded-xl border border-slate-200 bg-slate-50 px-5 outline-none focus:ring-2 focus:ring-violet-500 text-slate-700"
          />
  
          <button className="h-14 px-8 rounded-xl primary-gradient  text-white font-semibold shadow-lg shadow-blue-200 hover:scale-[1.02] transition-all">
            Clear All
          </button>
        </div>
  
        {/* Tabs */}
        <div className="flex items-center gap-3 mb-8">
          {["All", "Pending", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "primary-gradient text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
  
        {/* Empty State */}
        <div className="border-t border-slate-200 pt-14 pb-10 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-5">
            <MonitorPlay className="w-9 h-9 text-slate-400" />
          </div>
  
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            No reminders available
          </h3>
  
          <p className="text-slate-500 max-w-md">
            Create reminders and manage your daily workflow more efficiently.
          </p>
        </div>
      </div>
  
      {/* Charts */}
      <div className="grid grid-cols-2 2xl:grid-cols-1 gap-5">
        {/* Active Clients */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Active Clients
              </h2>
  
              <p className="text-emerald-600 text-sm font-medium mt-1">
                ↑ 0% compared to last week
              </p>
            </div>
  
            <select className="h-11 px-4 pr-8 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none">
              <option>This Week</option>
            </select>
          </div>
  
          <div className="h-72 flex items-end justify-between gap-3">
            {clientsData.map((value, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-xl bg-gradient-to-t from-cyan-500 to-sky-400 hover:opacity-90 transition-all"
                style={{ height: `${value / 4}%` }}
              ></div>
            ))}
          </div>
        </div>
  
        {/* Sales Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Sales Overview
              </h2>
  
              <p className="text-emerald-600 text-sm font-medium mt-1">
                ↑ 0% growth this year
              </p>
            </div>
  
            <select className="h-11 px-4 pr-8 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none">
              <option>This Year</option>
            </select>
          </div>
  
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
  
                <linearGradient id="silverGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
  
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
  
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
  
              <Tooltip
                contentStyle={{
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                }}
              />
  
              <Area
                type="monotone"
                dataKey="Gold"
                stroke="#0ea5e9"
                fillOpacity={1}
                fill="url(#goldGradient)"
                strokeWidth={3}
              />
  
              <Area
                type="monotone"
                dataKey="Silver"
                stroke="#7c3aed"
                fillOpacity={1}
                fill="url(#silverGradient)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
