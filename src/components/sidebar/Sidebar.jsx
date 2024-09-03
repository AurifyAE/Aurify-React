import logo from "../../assets/logo.png";
import axiosInstance from "../../axios/axiosInstance";
import { Button } from "@nextui-org/react";
import {
  BarChart2,
  ChevronDown,
  ChevronUp,
  Home,
  Image,
  MessageSquare,
  Newspaper,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const SidenavItem = ({ icon: Icon, name, isActive }) => (
  <li
    className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
      isActive ? "bg-white shadow-lg" : "hover:bg-gray-100"
    }`}
  >
    <div
      className={`p-2 rounded-lg mr-3 ${
        isActive
          ? "bg-gradient-to-r from-purple-600 to-pink-500"
          : "bg-purple-100"
      }`}
    >
      <Icon
        className={`w-5 h-5 ${isActive ? "text-white" : "text-purple-600"}`}
      />
    </div>
    <span
      className={`text-sm font-medium ${
        isActive ? "text-purple-600" : "text-gray-600"
      }`}
    >
      {name}
    </span>
  </li>
);

const SignOutButton = () => {
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("rememberMe");
    navigate("/");
  };
  return (
    <Button
      onClick={handleSignOut}
      className="w-full mt-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center shadow-lg mb-8"
    >
      Sign Out
    </Button>
  );
};

const FeatureDropdown = ({ features }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
        FEATURES
      </h3>
      <ul className="space-y-1">
        {features.map((feature, index) => (
          <NavLink
            to={`/feature/${feature.name.toLowerCase().replace(/\s+/g, "-")}`}
            key={index}
            className={({ isActive }) =>
              isActive ? "text-purple-600" : "text-gray-600"
            }
          >
            {({ isActive }) => (
              <SidenavItem
                name={feature.name}
                icon={User}
                isActive={isActive}
              />
            )}
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

const AdditionalFeaturesDropdown = ({ features }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);

  const handleRequestFeature = async (feature) => {
    const userEmail = localStorage.getItem("userEmail");
    setRequestStatus({ type: "loading", message: "Submitting request..." });

    try {
      const response = await axiosInstance.post("/request-feature", {
        email: userEmail,
        feature,
        reason: "Requested via dropdown",
        requestType: "featureRequest",
      });

      if (response.data.success) {
        setRequestStatus({
          type: "success",
          message: "Feature request submitted successfully",
        });
      } else {
        setRequestStatus({
          type: "error",
          message: response.data.message || "Failed to submit feature request",
        });
      }
    } catch (err) {
      console.error("Error details:", err);
      setRequestStatus({
        type: "error",
        message: `Failed to submit feature request: ${
          err.response?.data?.message || err.message
        }`,
      });
    }

    // Clear status after 5 seconds
    setTimeout(() => setRequestStatus(null), 5000);
  };

  return (
    <div className="mt-8">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
          ADDITIONAL FEATURES
        </h3>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {isOpen && (
        <ul className="space-y-1 mt-2">
          {features.map((feature, index) => (
            <li
              key={index}
              className="relative flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100"
              onMouseEnter={() => setHoveredFeature(feature)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <User className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-sm font-medium text-gray-600">
                {feature}
              </span>
              {hoveredFeature === feature && (
                <div className="absolute right-0 top-0 bottom-0 flex items-center">
                  <Button
                    size="sm"
                    auto
                    className="bg-purple-600 text-white"
                    onClick={() => handleRequestFeature(feature)}
                  >
                    Request
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {requestStatus && (
        <div
          className={`mt-2 p-2 rounded ${
            requestStatus.type === "success"
              ? "bg-green-100 text-green-800"
              : requestStatus.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {requestStatus.message}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const routes = [
    { name: "Dashboard", icon: Home, path: "dashboard" },
    { name: "Spot Rate", icon: BarChart2, path: "spot-rate" },
    { name: "Media", icon: Image, path: "media" },
    { name: "Support", icon: MessageSquare, path: "support" },
    { name: "News", icon: Newspaper, path: "news" },
  ];

  const accountRoutes = [
    { name: "Profile", icon: User, path: "profile" },
    { name: "Bank Details", icon: User, path: "bank-details" },
  ];

  const allFeatures = [
    "Chatbot",
    "Digital Marketing",
    "24x7 Chat",
    "Shop",
    "Users",
    "Market Closing",
  ];

  const [features, setFeatures] = useState([]);
  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [error, setError] = useState(null);

  const fetchFeatures = async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      setError("Admin not logged in");
      return;
    }

    try {
      const response = await axiosInstance.get("/features", {
        params: { email: userEmail },
      });

      if (response.data.success) {
        setFeatures(response.data.data);
        setAdditionalFeatures(
          allFeatures.filter(
            (f) => !response.data.data.some((rf) => rf.name === f)
          )
        );
      } else {
        setError(response.data.message || "Failed to fetch features");
      }
    } catch (err) {
      setError("Failed to fetch admin features: " + err.message);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  return (
    <nav className="w-64 bg-gray-100 h-screen p-4 overflow-y-auto hide-scrollbar">
      <div className="flex items-center mb-8">
        <img src={logo} alt="Logo" className="w-14 h-14 mr-1" />
        <span className="text-xl font-bold text-gray-800">Dashboard</span>
      </div>

      <ul className="space-y-1">
        {routes.map((route) => (
          <NavLink
            to={`/${route.path}`}
            key={route.path}
            className={({ isActive }) =>
              isActive ? "text-purple-600" : "text-gray-600"
            }
          >
            {({ isActive }) => (
              <SidenavItem
                name={route.name}
                icon={route.icon}
                isActive={isActive}
              />
            )}
          </NavLink>
        ))}
      </ul>

      {features.length > 0 && <FeatureDropdown features={features} />}

      <div className="mt-8">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
          ACCOUNT PAGES
        </h3>
        <ul className="space-y-1">
          {accountRoutes.map((route) => (
            <NavLink
              to={`/${route.path}`}
              key={route.path}
              className={({ isActive }) =>
                isActive ? "text-purple-600" : "text-gray-600"
              }
            >
              {({ isActive }) => (
                <SidenavItem
                  name={route.name}
                  icon={route.icon}
                  isActive={isActive}
                />
              )}
            </NavLink>
          ))}
        </ul>
      </div>

      <AdditionalFeaturesDropdown features={additionalFeatures} />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <div className="mt-8">
        <SignOutButton />
      </div>
    </nav>
  );
};

export default Sidebar;
