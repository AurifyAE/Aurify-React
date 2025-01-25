import {
  AccountBalance as AccountBalanceIcon,
  Campaign as CampaignIcon,
  Chat as ChatIcon,
  Dataset as DatasetIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Group as GroupIcon,
  Home as HomeIcon,
  Image as ImageIcon,
  LocalOffer as LocalOfferIcon,
  MonetizationOn as MonetizationOnIcon,
  Newspaper as NewspaperIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ShowChart as ShowChartIcon,
  Storefront as StorefrontIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import axiosInstance from "../../axios/axiosInstance";

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
    localStorage.removeItem("userName");
    localStorage.removeItem("adminId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("reminderModalClosedDate");
    localStorage.removeItem("rememberMe");
    navigate("/");
    // window.location.reload();
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

const FeatureDropdown = ({ features, isLoading }) => {
  const getFeatureIcon = (featureName) => {
    switch (featureName.toLowerCase()) {
      case "chatbot":
        return ChatIcon;
      case "digital marketing":
        return CampaignIcon;
      case "24x7 chat":
        return ChatIcon;
      case "shop":
        return StorefrontIcon;
      case "users":
        return GroupIcon;
      case "market closing":
        return MonetizationOnIcon;
      case "premium discount":
        return LocalOfferIcon;
      case "orders":
        return ShoppingCartIcon;
      case "users db":
        return DatasetIcon;
      default:
        return PersonIcon;
    }
  };
  if (isLoading) {
    return (
      <div className="mt-8">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
          FEATURES
        </h3>
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="h-10 w-full mb-2 rounded-lg" />
        ))}
      </div>
    );
  }
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

const AdditionalFeaturesDropdown = ({ features, isLoading, userEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const getFeatureIcon = (featureName) => {
    switch (featureName.toLowerCase()) {
      case "chatbot":
        return ChatIcon;
      case "digital marketing":
        return CampaignIcon;
      case "24x7 chat":
        return ChatIcon;
      case "shop":
        return StorefrontIcon;
      case "users":
        return GroupIcon;
      case "market closing":
        return MonetizationOnIcon;
      case "orders":
        return ShoppingCartIcon;
      default:
        return PersonIcon;
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
        setRequestStatus(null);
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

    if (requestStatus && requestStatus.type === "error") {
      setTimeout(() => setRequestStatus(null), 5000);
    }
  };
  if (isLoading) {
    return (
      <div className="mt-8">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
          ADDITIONAL FEATURES
        </h3>
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="h-10 w-full mb-2 rounded-lg" />
        ))}
      </div>
    );
  }
  if (features.length === 0) {
    return null;
  }

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
    "Premium Discount",
    "Users DB",
  ];

  const [features, setFeatures] = useState([]);
  const [additionalFeatures, setAdditionalFeatures] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  const fetchFeatures = async () => {
    const userName = localStorage.getItem("userName");

    if (!userName) {
      setError("Admin not logged in");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get("/features", {
        params: { userName: userName },
      });
      if (response.data.success) {
        setFeatures(response.data.data.features);
        setUserEmail(response.data.data.email);
        setAdditionalFeatures(
          allFeatures.filter(
            (f) => !response.data.data.features.some((rf) => rf.name === f)
          )
        );
      } else {
        setError(response.data.message || "Failed to fetch features");
      }
    } catch (err) {
      setError("Failed to fetch admin features: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  return (
    <nav className="w-64 bg-gray-100 h-screen flex flex-col">
      <div className="px-4 flex-shrink-0 mt-6">
        <div className="flex items-center mb-8">
          <img src={logo} alt="Logo" className="w-14 h-14 mr-1" />
          <span className="text-xl font-bold text-gray-800">Dashboard</span>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto hide-scrollbar px-4">
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

        <FeatureDropdown features={features} isLoading={isLoading} />

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

        <AdditionalFeaturesDropdown
          features={additionalFeatures}
          isLoading={isLoading}
          userEmail={userEmail}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="p-4 flex-shrink-0 mt-2">
        <SignOutButton />
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            zIndex: 9999,
          },
        }}
      />
    </nav>
  );
};

export default Sidebar;
