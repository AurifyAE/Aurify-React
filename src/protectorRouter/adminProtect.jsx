
import { useEffect, useState } from "react";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import RenewalModal from "../components/RenewalModal";

function AdminProtect() {
  const [auth, setAuth] = useState(null);
  const [isServiceExpired, setIsServiceExpired] = useState(false);
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyTokenAndCheckService = async () => {
      try {
        const res = await axiosInstance.post("/verify-token", { token });

        if (res.data.serviceExpired) {
          setIsServiceExpired(true);
          setAuth(false); // Prevent access to protected routes
        } else if (res.data.admin) {
          setAuth(true);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error during verification:", error.message);
        if (error.response?.status === 403 && error.response?.data?.serviceExpired) {
          setIsServiceExpired(true);
          setAuth(false);
        } else if (error.response?.data?.tokenExpired || error.response?.data?.tokenInvalid) {
          setTokenInvalid(true);
        } else {
          navigate("/");
        }
      }
    };

    verifyTokenAndCheckService();
  }, [navigate, token]);

  if (auth === null) return null; // Show nothing while loading

  if (tokenInvalid) {
    return <Navigate to="/" />;
  }

  if (isServiceExpired) {
    return (
      <>
        <RenewalModal open={isServiceExpired} onClose={() => setIsServiceExpired(false)} />
      </>
    );
  }

  return auth ? <Outlet /> : <Navigate to="/" />;
}

export default AdminProtect;
