import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import logo from "../../assets/logo.png";
import axiosInstance from "../../axios/axiosInstance";
import {
  Home as HomeIcon,
  ShowChart as ShowChartIcon,
  Image as ImageIcon,
  Support as SupportIcon,
  Newspaper as NewspaperIcon,
  Person as PersonIcon,
  AccountBalance as AccountBalanceIcon,
  Chat as ChatIcon,
  Campaign as CampaignIcon,
  Storefront as StorefrontIcon,
  Group as GroupIcon,
  MonetizationOn as MonetizationOnIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import toast, { Toaster } from "react-hot-toast";
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
    localStorage.removeItem("reminderModalClosedDate");
    localStorage.removeItem("rememberMe"); 
    navigate("/");
    window.location.reload();
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
  const getFeatureIcon = (featureName) => {
    switch (featureName.toLowerCase()) {
      case 'chatbot': return ChatIcon;
      case 'digital marketing': return CampaignIcon;
      case '24x7 chat': return ChatIcon;
      case 'shop': return StorefrontIcon;
      case 'users': return GroupIcon;
      case 'market closing': return MonetizationOnIcon;
      default: return PersonIcon;
    }
  };
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
                icon={getFeatureIcon(feature.name)}
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
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);


  const getFeatureIcon = (featureName) => {
    switch (featureName.toLowerCase()) {
      case 'chatbot': return ChatIcon;
      case 'digital marketing': return CampaignIcon;
      case '24x7 chat': return ChatIcon;
      case 'shop': return StorefrontIcon;
      case 'users': return GroupIcon;
      case 'market closing': return MonetizationOnIcon;
      default: return PersonIcon;
    }
  };

  const handleRequestFeature = (feature) => {
    setSelectedFeature(feature);
    setIsRequestModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsRequestModalOpen(false);
    setSelectedFeature(null);
  };

  const showSuccessToast = (feature) => {
    toast.success(
      (t) => (
        <div className="flex items-center">
          <span className="text-green-500 mr-2">✓</span>
          <span>Successfully requested: {feature}</span>
        </div>
      ),
      {
        style: {
          background: "#10B981",
          color: "#FFFFFF",
        },
        iconTheme: {
          primary: "#FFFFFF",
          secondary: "#10B981",
        },
      }
    );
  };

  const confirmRequest = async () => {
    closeRequestModal();
    const userEmail = localStorage.getItem("userEmail");
    setRequestStatus({ type: "loading", message: "Submitting request..." });

    try {
      const response = await axiosInstance.post("/request-feature", {
        email: userEmail,
        feature: selectedFeature,
        reason: "Requested via dropdown",
        requestType: "featureRequest",
      });

      if (response.data.success) {
        showSuccessToast(selectedFeature);
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
        {isOpen ? <ExpandLessIcon size={16} /> : <ExpandMoreIcon size={16} />}
      </div>
      {isOpen && (
        <ul className="space-y-1 mt-2">
          {features.map((feature, index) => {
            const Icon = getFeatureIcon(feature);
            return (
              <li
                key={index}
                className="relative flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                onMouseEnter={() => setHoveredFeature(feature)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="p-2 rounded-lg mr-3 bg-purple-100">
                  <Icon className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-600 mr-20">
                  {feature}
                </span>
                {hoveredFeature === feature && (
                  <div className="absolute right-0 top-0 bottom-0 flex items-center">
                    <Button
                      size="sm"
                      auto
                      className="bg-purple-600 text-white ml-4"
                      onClick={() => handleRequestFeature(feature)}
                    >
                      Request
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
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
      <Modal
        isOpen={isRequestModalOpen}
        onClose={closeRequestModal}
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
             Feature Request
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to request the "{selectedFeature}" feature ?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              className="bg-purple-600 text-white"
              variant="flat"
              onPress={confirmRequest}
            >
              Request
            </Button>
            <Button color="primary" onPress={closeRequestModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

const Sidebar = () => {
  const routes = [
    { name: "Dashboard", icon: HomeIcon, path: "dashboard" },
    { name: "Spot Rate", icon: ShowChartIcon, path: "spot-rate" },
    { name: "Media", icon: ImageIcon, path: "media" },
    { name: "Support", icon: SettingsIcon, path: "support" },
    { name: "News", icon: NewspaperIcon, path: "news" },
  ];

  const accountRoutes = [
    { name: "Profile", icon: PersonIcon, path: "profile" },
    { name: "Bank Details", icon: AccountBalanceIcon, path: "bank-details" },
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
      <Toaster position="top-center" />
    </nav>
  );
};

export default Sidebar;
