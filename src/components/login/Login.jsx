import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginImage from "../../assets/GoldBar.jpg";
import { loginUser, verifyToken } from "../../api/adminAPi";
import { requestFCMToken } from "../../utils/firebaseUtils";
import { registerServiceWorker } from "../../utils/serviceWorkerRegistration";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fcmToken, setFcmToken] = useState("");
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const maxAttempts = 3;
    let attempts = 0;

    const fetchFcmToken = async () => {
      setIsTokenLoading(true);
      try {
        await registerServiceWorker();
        const token = await requestFCMToken();
        if (token) {
          setFcmToken(token);
          setIsTokenLoading(false);
        } else {
          throw new Error('FCM token not received');
        }
      } catch (error) {
        console.log('Error in getting FCM token:', error);
        attempts++;
        if (attempts < maxAttempts) {
          console.log(`Retrying... Attempt ${attempts} of ${maxAttempts}`);
          setTimeout(fetchFcmToken, 2000);
        } else {
          console.log('Max attempts reached. Refreshing page...');
          toast.info('Having trouble securing your login. Refreshing the page...', {
            position: "top-center",
            autoClose: 3000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      }
    };

    fetchFcmToken();
    const checkExistingToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Verify the token with the backend
          const response = await verifyToken(token);
          if (response.serviceExpired) {
            toast.error(
              "Your service has expired. Please renew your subscription."
            );
          } else {
            navigate("/dashboard");
          }
        } catch (error) {
          // Token is invalid or expired, clear it
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("rememberMe");
        }
      }
    };
    checkExistingToken();
  }, [navigate]);
  

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isTokenLoading) {
      toast.warning('Please wait while we secure your login...', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const values = {
      email,
      password,
      fcmToken,
      rememberMe,
    };
    setEmailError("");
    setPasswordError("");

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must contain at least 1 capital letter, 1 small letter, 1 number, and 1 symbol"
      );
      return;
    }

    try {
      const response = await loginUser(email, password, fcmToken, rememberMe);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userEmail", email);
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }
        toast.success("Login Successful", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setPasswordError(response.data.message || "Login failed");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setPasswordError(err.response.data.message);
      } else {
        setPasswordError("Login failed. Please try again.");
      }
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      <ToastContainer />
      <div
        style={{
          width: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: "8rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "20rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              background: "linear-gradient(310deg, #2152ff 0%, #21d4fd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome back
          </h2>
          <p style={{ color: "#718096", marginBottom: "2rem" }}>
            Enter your email and password to sign in
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d2d6dc",
                  borderRadius: "0.375rem",
                  fontSize: "1rem",
                  color: "#2d3748",
                }}
                placeholder="test@gmail.com"
              />
              {emailError && (
                <p
                  style={{
                    color: "red",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {emailError}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    paddingRight: "2.5rem",
                    border: "1px solid #d2d6dc",
                    borderRadius: "0.375rem",
                    fontSize: "1rem",
                    color: "#2d3748",
                  }}
                  placeholder="••••••"
                />
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "0.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </div>
              {passwordError && (
                <p
                  style={{
                    color: "red",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {passwordError}
                </p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <Switch
                checked={rememberMe}
                onChange={handleRememberMeChange}
                inputProps={{ "aria-label": "controlled" }}
                style={{ color: "#2152ff" }}
              />
              <label
                htmlFor="rememberMe"
                style={{ fontSize: "0.875rem", color: "#718096" }}
              >
                Trust the device
              </label>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "0.375rem",
                background: "linear-gradient(310deg, #2152ff 0%, #21d4fd 100%)",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              SIGN IN
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Gold Image */}
      <div
        style={{
          position: "relative",
          width: "50%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0",
            height: "110%",
            width: "100%",
            right: "-10rem",
            left: "auto",
            transform: "skewX(-10deg)",
            overflow: "hidden",
            borderBottomLeftRadius: "1rem",
            backgroundImage: `url(${loginImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    </div>
  );
};

export default LoginPage;
