import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const ProfilePage = () => {
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isLogoSubmitted, setIsLogoSubmitted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [emailSettings, setEmailSettings] = useState({
    follows: true,
    answers: false,
    mentions: true,
  });
  const [appSettings, setAppSettings] = useState({
    launches: false,
    updates: true,
    newsletter: false,
  });

  const handleButtonClick = () => {
    document.getElementById('logoInput').click();
  };

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
        const formData = new FormData();
        formData.append('logo', logoFile);
        formData.append('email', profileInfo.email);
  
        const response = await axiosInstance.post('/update-logo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.data.success) {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          
          // Update the local state with the new logo URL
          setUserData(prevData => ({
            ...prevData,
            data: {
              ...prevData.data,
              logo: response.data.data.logo
            }
          }));
          setLogoFile(null);
          setLogo(null);
        }
      } catch (error) {
        console.error('Error uploading logo:', error);
        // setShowToast(true);
        // setToastMessage("Error uploading logo: " + (error.response?.data?.message || error.message));
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  const Toast = ({ message }) => (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
      {message}
    </div>
  );

  const [profileInfo, setProfileInfo] = useState({
    email: '',
    fullName: '',
    mobile: '',
    email: '',
    location: ''
  });
  
  useEffect(() => {
    if (userData?.data) {
      setProfileInfo({
        email: userData.data.email || '',
        fullName: userData.data.userName || '',
        mobile: userData.data.contact || '',
        email: userData.data.email || '',
        location: userData.data.address || ''
      });
    }
  }, [userData]);  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const saveChanges = async () => {
    try {
      const response = await axiosInstance.put(`/update-profile/${userData.data._id}`, {
        email: profileInfo.email,
        fullName: profileInfo.fullName,
        mobile: profileInfo.mobile,
        location: profileInfo.location
      });
      if (response.status === 200) {
        console.log('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  

  
  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem('userEmail');
      console.log(userEmail);
      
      if (!userEmail) {
        setError('User not logged in');
        return;
      }
  
      try {
        // Include the email directly in the URL
        const response = await axiosInstance.get(`/data/${userEmail}`);
        
        console.log('API Response:', response.data);
        setUserData(response.data);
      } catch (err) {
        setError('Failed to fetch user data: ' + err.message);
      }
    };
  
    fetchUserData();
  }, []);
  
  
  useEffect(() => {
    if (userData) {
      console.log('Updated userData:', userData); // Log state after it has been set
    }
  }, [userData]); // Dependency array contains userData
  

  return (
    <div className="relative bg-gray-100 mt-24 mr-6">
      <div className="bg-gray-100 p-6 relative">
        <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 h-[158px] rounded-lg shadow-lg p-6 absolute inset-x-0 z-10 top-[-6rem]">
          {/* Content of the first div */}
        </div>
        {/* Header */}
        <div className="bg-white bg-opacity-90 rounded-lg p-4 mb-6 relative  -mt-6 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center text-white text-2xl font-bold mr-3">
            <img src={userData?.data?.logo ? `http://localhost:8000/uploads/${userData.data.logo}` : ''} alt="Company Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Tecnavis</h2>
              <p className="text-sm text-gray-600">Aurify Solutions</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
              </svg>
              App
            </button>
            <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              appointments
            </button>
            <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
              </svg>
              Settings
            </button>
          </div>
        </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-3 gap-6 bg-gray-100 -mx-6">
          {/* Platform Settings */}
          {/* <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Platform Settings</h3>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 text-sm">ACCOUNT</h4>
              <ToggleItem
                label="Email me when someone follows me"
                checked={emailSettings.follows}
                onChange={() => setEmailSettings({...emailSettings, follows: !emailSettings.follows})}
              />
              <ToggleItem
                label="Email me when someone answers on my post"
                checked={emailSettings.answers}
                onChange={() => setEmailSettings({...emailSettings, answers: !emailSettings.answers})}
              />
              <ToggleItem
                label="Email me when someone mentions me"
                checked={emailSettings.mentions}
                onChange={() => setEmailSettings({...emailSettings, mentions: !emailSettings.mentions})}
              />
              <h4 className="font-medium text-gray-700 text-sm mt-6">APPLICATION</h4>
              <ToggleItem
                label="New launches and projects"
                checked={appSettings.launches}
                onChange={() => setAppSettings({...appSettings, launches: !appSettings.launches})}
              />
              <ToggleItem
                label="Monthly product updates"
                checked={appSettings.updates}
                onChange={() => setAppSettings({...appSettings, updates: !appSettings.updates})}
              />
              <ToggleItem
                label="Subscribe to newsletter"
                checked={appSettings.newsletter}
                onChange={() => setAppSettings({...appSettings, newsletter: !appSettings.newsletter})}
              />
            </div>
          </div> */}
          
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            {/* <p className="text-sm text-gray-600 mb-4">Hi, I'm Tecnavis. Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).</p> */}
            <div className="space-y-4">
            <InputField 
              label="Full Name" 
              name="fullName" 
              value={profileInfo.fullName} 
              onChange={handleInputChange} 
            />
            <InputField 
              label="Mobile" 
              name="mobile" 
              value={profileInfo.mobile} 
              onChange={handleInputChange} 
            />
            <InputField 
              label="Email" 
              name="email" 
              value={profileInfo.email} 
              onChange={handleInputChange} 
            />
            <InputField 
              label="Location" 
              name="location" 
              value={profileInfo.location} 
              onChange={handleInputChange} 
            />
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Social Media</label>
                <div className="flex space-x-4">
                  <SocialIcon icon="facebook" />
                  <SocialIcon icon="twitter" />
                  <SocialIcon icon="instagram" />
                </div>
              </div>
              <button 
              className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition duration-300 mt-4"
              onClick={saveChanges}
              >
                SAVE CHANGES
              </button>
            </div>
          </div>

          {/* Company Logo */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Company Logo</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {logo ? (
                  <img src={logo} alt="Selected Logo" className="w-full h-full object-cover" />
                ) : userData?.data?.logo ? (
                  <img src={`http://localhost:8000/uploads/${userData.data.logo}`} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <button 
                className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-300 text-sm mb-2"
                onClick={() => document.getElementById('logoInput').click()}
              >
                Change Logo
              </button>
              <input
                id="logoInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {logo && !isLogoSubmitted && (
                <button 
                  className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition duration-300 text-sm mt-2"
                  onClick={handleLogoSubmit}
                >
                  Submit Logo
                </button>
              )}
            </div>
          </div>

          {/* Toast notification */}
          {showToast && <Toast message="Logo submitted successfully!" />}
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ icon }) => (
  <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
    <span className="sr-only">{icon}</span>
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      {icon === 'facebook' && (
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      )}
      {icon === 'twitter' && (
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      )}
      {icon === 'instagram' && (
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      )}
    </svg>
  </a>
);

const ToggleItem = ({ label, checked, onChange }) => (
  <div className="flex items-center space-x-4">
    <button
      className={`relative inline-flex items-center h-6 w-11 rounded-full focus:outline-none ${checked ? 'bg-pink-500' : 'bg-gray-300'}`}
      onClick={onChange}
    >
      <span
        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
          checked ? 'translate-x-5' : 'translate-x-1'
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