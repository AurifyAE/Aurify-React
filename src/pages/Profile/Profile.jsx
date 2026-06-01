import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import axiosInstance from "../../axios/axiosInstance";

const ProfilePage = () => {
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isLogoSubmitted, setIsLogoSubmitted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoSubmit = async () => {
    if (logoFile) {
      try {
        const userName = localStorage.getItem("userName");
        const formData = new FormData();
        formData.append("logo", logoFile);
        formData.append("userName", userName);

        const response = await axiosInstance.post("/update-logo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          toast.success("Logo updated successfully!");

          // Update the local state with the new logo URL
          setUserData((prevData) => ({
            ...prevData,
            data: {
              ...prevData.data,
              logo: response.data.data.logo,
            },
          }));
          setLogoFile(null);
          setLogo(null);
        }
      } catch (error) {
        console.error("Error uploading logo:", error);
        // setShowToast(true);
        toast.error(
          "Error uploading logo: " +
          (error.response?.data?.message || error.message),
        );
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  const [originalProfileInfo, setOriginalProfileInfo] = useState({
    companyName: "",
    email: "",
    mobile: "",
    whatsapp: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  const [profileInfo, setProfileInfo] = useState({
    comapanyName: "",
    email: "",
    mobile: "",
    whatsapp: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (userData?.data) {
      const newProfileInfo = {
        companyName: userData.data.companyName || "",
        email: userData.data.email || "",
        mobile: userData.data.contact || "",
        whatsapp: userData.data.whatsapp || "",
        location: userData.data.address || "",
        latitude: userData.data.latitude || "", // Set to empty if not present
        longitude: userData.data.longitude || "",
      };
      setProfileInfo(newProfileInfo);
      setOriginalProfileInfo(newProfileInfo);
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const hasChanges = () => {
    return Object.keys(profileInfo).some(
      (key) => profileInfo[key] !== originalProfileInfo[key],
    );
  };

  const saveChanges = async () => {
    if (!hasChanges()) {
      toast.info("No changes were made");
      return;
    }
    try {
      const response = await axiosInstance.put(
        `/update-profile/${userData.data._id}`,
        {
          companyName: profileInfo.companyName,
          email: profileInfo.email,
          mobile: profileInfo.mobile,
          whatsapp: profileInfo.whatsapp,
          location: profileInfo.location,
          latitude: profileInfo.latitude,
          longitude: profileInfo.longitude,
        },
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setOriginalProfileInfo({ ...profileInfo });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile: " + error.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userName = localStorage.getItem("userName");

      if (!userName) {
        setError("User not logged in");
        return;
      }
      try {
        // Include the email directly in the URL
        const response = await axiosInstance.get(`/data/${userName}`);
        setUserData(response.data);
      } catch (err) {
        setError("Failed to fetch user data: " + err.message);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => { }, [userData]); // Dependency array contains userData

  return (
    <div className="min-h-screen bg-[#f9f9f9] px-6 py-8">
      <Toaster position="top-center" />

      {/* TOP HERO */}
      <div
        className="relative w-[80%] mx-auto overflow-hidden rounded-[28px] border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
        style={{
          background:
            "linear-gradient(135deg, #f7f7f8 0%,rgb(255, 255, 255) 35%, #ececee 100%)",
        }}
      >
        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 overflow-hidden  flex justify-end items-center     w-auto
      h-full"
        >
          <img
            src="/images/profile-line.svg"
            alt="background-pattern"
            className="
      w-auto
      h-[180%]
      object-contain
      opacity-90
      pointer-events-none
      object-position-center
      select-none
    "
          />
        </div>

        <div className="relative z-10 flex items-center justify-between px-10 py-10">
          {/* LEFT */}
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden border border-white">
              <img
                src={userData?.data?.logo || ""}
                alt="logo"
                className="w-full h-full object-contain px-2"
              />
            </div>

            <div>
              <h1 className="text-[34px] font-semibold text-[#1d2433] leading-none">
                {userData?.data?.companyName || "Company"}
              </h1>

              <p className="text-[#6b7280] mt-2 text-sm font-medium">
                {userData?.data?.userName || "username"}
              </p>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            <button className="bg-white/90 backdrop-blur-md border border-white rounded-2xl px-6 py-4 flex items-center gap-3 shadow-md hover:scale-[1.02] transition-all duration-300">
              <svg
                className="w-5 h-5 text-[#1f2937]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>

              <span className="text-sm font-semibold text-[#1f2937]">Apps</span>
            </button>

            <button className="bg-white/90 backdrop-blur-md border border-white rounded-2xl px-6 py-4 flex items-center gap-3 shadow-md hover:scale-[1.02] transition-all duration-300">
              <svg
                className="w-5 h-5 text-[#1f2937]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z"
                />
              </svg>

              <span className="text-sm font-semibold text-[#1f2937]">
                Appointments
              </span>
            </button>

            <button className="bg-white/90 backdrop-blur-md border border-white rounded-2xl px-6 py-4 flex items-center gap-3 shadow-md hover:scale-[1.02] transition-all duration-300">
              <svg
                className="w-5 h-5 text-[#1f2937]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span className="text-sm font-semibold text-[#1f2937]">
                Settings
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-8 flex mx-auto w-[80%] gap-7">
        {/* LEFT SECTION */}
        <div className="space-y-7 flex-1">
          {/* PROFILE CARD */}
          <div className="relative overflow-hidden bg-white border border-[#ececec] rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
            {/* TOP STRIP */}
            <div className="h-[3px] w-full bg-gradient-to-r from-[#cbd5e1] via-[#6b7280] to-[#f8fafc]" />
            <div className="p-8">
              {/* HEADER */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f6f3ff] to-[#ebe7ff] flex items-center justify-center shadow-sm">
                    <svg
                      className="w-7 h-7 text-[#6d5dfc]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-[22px] font-semibold text-[#111827]">
                      Profile Information
                    </h2>

                    <p className="text-[#8a93a6] text-sm mt-1">
                      Manage company details & personal information
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 bg-[#f8f9fc] border border-[#eef0f4] rounded-2xl px-4 py-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />

                  <span className="text-xs font-semibold text-[#4b5563]">
                    Active Profile
                  </span>
                </div>
              </div>

              {/* FORM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Company Name"
                  name="companyName"
                  value={profileInfo.companyName}
                  onChange={handleInputChange}
                />

                <InputField
                  label="Email Address"
                  name="email"
                  value={profileInfo.email}
                  onChange={handleInputChange}
                />

                <InputField
                  label="Mobile Number"
                  name="mobile"
                  value={profileInfo.mobile}
                  onChange={handleInputChange}
                />

                <InputField
                  label="WhatsApp Number"
                  name="whatsapp"
                  value={profileInfo.whatsapp}
                  onChange={handleInputChange}
                />

                <div className="md:col-span-2">
                  <InputField
                    label="Location"
                    name="location"
                    value={profileInfo.location}
                    onChange={handleInputChange}
                  />
                </div>

                <InputField
                  label="Latitude"
                  name="latitude"
                  value={profileInfo.latitude}
                  onChange={handleInputChange}
                />

                <InputField
                  label="Longitude"
                  name="longitude"
                  value={profileInfo.longitude}
                  onChange={handleInputChange}
                />
              </div>

              {/* SOCIAL + ACTION */}
              <div className="mt-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* SOCIAL */}
                <div>
                  <p className="text-[13px] font-semibold text-[#374151] mb-3">
                    Social Media
                  </p>

                  <div className="flex items-center gap-3">
                    <SocialIcon icon="facebook" />
                    <SocialIcon icon="twitter" />
                    <SocialIcon icon="instagram" />
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={saveChanges}
                  disabled={!hasChanges()}
                  className={`primary-btn `}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LOGO CARD */}
        <div className="bg-white w-[40%]  rounded-[30px] border border-[#ececec] shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* TOP STRIP */}
          <div className="h-[3px] w-full bg-gradient-to-r from-[#cbd5e1] via-[#6b7280] to-[#f8fafc]" />{" "}
          <div className="p-8">
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f6f3ff] to-[#ebe7ff] flex items-center justify-center shadow-sm">
                <svg
                  className="w-7 h-7 text-[#6d5dfc]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-[22px] font-semibold text-[#111827]">
                  Company Logo
                </h2>

                <p className="text-[#8a93a6] text-sm mt-1">
                  Upload or update your company branding
                </p>
              </div>
            </div>

            {/* LOGO AREA */}
            <div className="relative overflow-hidden border border-dashed border-[#d9dce3] rounded-[28px] bg-[#fbfbfd] min-h-[400px] flex flex-col items-center justify-center">
              {/* BACK GLOW */}
              <div className="absolute w-[300px] h-[300px] rounded-full bg-[#ede9fe] blur-[90px] opacity-60" />

              <div className="relative z-10">
                <div className="w-44 h-44 p-2 rounded-[34px] bg-white border border-[#f3f4f6] shadow-[0_20px_40px_rgba(0,0,0,0.08)] flex items-center justify-center overflow-hidden">
                  {logo ? (
                    <img
                      src={logo}
                      alt="Selected Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : userData?.data?.logo ? (
                    <img
                      src={userData.data.logo}
                      alt="Company Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-[#9ca3af] text-sm">
                      No Logo Uploaded
                    </div>
                  )}
                </div>

                <div className="mt-10 flex flex-col items-center">
                  <button
                    onClick={() => document.getElementById("logoInput").click()}
                    className="rounded-2xl bg-white border border-[#d8dbe3] px-8 py-4 text-sm font-semibold text-[#374151] hover:bg-[#f8f8fb] transition-all duration-300 shadow-sm"
                  >
                    Upload New Logo
                  </button>

                  <input
                    id="logoInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <p className="text-xs text-[#9ca3af] mt-4">
                    PNG, JPG or SVG • Max 5MB
                  </p>

                  {logo && !isLogoSubmitted && (
                    <button
                      onClick={handleLogoSubmit}
                      className="mt-6 bg-gradient-to-r from-[#6d5dfc] to-[#8b7bff] text-white rounded-2xl px-8 py-3 font-semibold shadow-lg hover:scale-[1.02] transition-all duration-300"
                    >
                      Submit Logo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ icon }) => (
  <a
    href="#"
    className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
  >
    <span className="sr-only">{icon}</span>
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      {icon === "facebook" && (
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      )}
      {icon === "twitter" && (
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      )}
      {icon === "instagram" && (
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      )}
    </svg>
  </a>
);

const ToggleItem = ({ label, checked, onChange }) => (
  <div className="flex items-center space-x-4">
    <button
      className={`relative inline-flex items-center h-6 w-11 rounded-full focus:outline-none ${checked ? "bg-pink-500" : "bg-gray-300"
        }`}
      onClick={onChange}
    >
      <span
        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${checked ? "translate-x-5" : "translate-x-1"
          }`}
      />
    </button>
    <span className="text-sm text-gray-600 flex-1">{label}</span>
  </div>
);

const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
    />
  </div>
);

export default ProfilePage;
