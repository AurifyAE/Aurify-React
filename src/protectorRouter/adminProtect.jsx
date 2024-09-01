import { useEffect, useState } from "react";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import ReminderModal from "../components/RemainderModal";
import RenewalModal from "../components/RenewalModal";

function AdminProtect() {
  const [auth, setAuth] = useState(null);
  const [isServiceExpired, setIsServiceExpired] = useState(false);
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [reminderMessage, setReminderMessage] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyTokenAndCheckService = async () => {
      try {
        const res = await axiosInstance.post("/verify-token", { token });

        if (res.data.serviceExpired) {
          setIsServiceExpired(true);
          setAuth(false);
        } else if (res.data.admin) {
          setAuth(true);

          if (res.data.reminderMessage) {
            setReminderMessage(res.data.reminderMessage);
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error during verification:", error.message);
        if (
          error.response?.status === 403 &&
          error.response?.data?.serviceExpired
        ) {
          console.log("Service expired, showing renewal modal.");
          setIsServiceExpired(true);
          setAuth(false);
        } else if (
          error.response?.data?.tokenExpired ||
          error.response?.data?.tokenInvalid
        ) {
          setTokenInvalid(true);
        } else {
          navigate("/");
        }
      }
    };

    verifyTokenAndCheckService();
  }, [navigate, token]);

  useEffect(() => {
    if (reminderMessage) {
      const lastClosedDate = localStorage.getItem("reminderModalClosedDate");
      const now = new Date();

      if (lastClosedDate) {
        const closedDate = new Date(lastClosedDate);
        const daysSinceClosed = Math.floor(
          (now - closedDate) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceClosed >= 1) {
          console.log("first");
          setShowReminderModal(true);
        }
      } else {
        setShowReminderModal(true);
      }
    }
  }, [reminderMessage]);

  const handleReminderModalClose = () => {
    localStorage.setItem("reminderModalClosedDate", new Date().toISOString());
    setShowReminderModal(false);
    setReminderMessage(null);
  };

  if (auth === null) return null; // Show nothing while loading

  if (tokenInvalid) {
    console.log("Token is invalid or expired.");
    return <Navigate to="/" />;
  }

  if (isServiceExpired) {
    console.log("Displaying Renewal Modal");
    return (
      <>
        <RenewalModal
          open={isServiceExpired}
          onClose={() => setIsServiceExpired(false)}
        />
      </>
    );
  }

  if (showReminderModal && reminderMessage) {
    console.log("Displaying Reminder Modal");
    return (
      <>
        <ReminderModal
          open={showReminderModal}
          message={reminderMessage}
          onClose={handleReminderModalClose}
        />
      </>
    );
  }

  return auth ? <Outlet /> : <Navigate to="/" />;
}

export default AdminProtect;