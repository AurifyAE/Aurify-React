import React, { useState } from 'react';

const ProfilePage = () => {
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

  return (
    <div className="relative bg-gray-100 mt-24 mr-6">
      <div className="bg-gray-100 p-6 relative">
        <div className="bg-purple-600 h-[158px] rounded-lg shadow-lg p-6 absolute inset-x-0 z-10 top-[-6rem]">
          {/* Content of the first div */}
        </div>
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-300 to-purple-300 rounded-lg p-4 mb-6 relative  -mt-6 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-red-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold mr-3">
              <span className="transform -rotate-45">T</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Tecnavis</h2>
              <p className="text-sm text-gray-600">Aurify Solutions</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-600">App</button>
            <button className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-600">appointments</button>
            <button className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-600">Settings</button>
          </div>
        </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-3 gap-6 bg-gray-100 -mx-6">
          {/* Platform Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
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
          </div>
          
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <p className="text-sm text-gray-600 mb-4">Hi, I'm Tecnavis. Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).</p>
            <div className="space-y-4">
              <InputField label="Company Name" value="Tecnavis" />
              <InputField label="Full Name" value="Aurify Solutions" />
              <InputField label="Mobile" value="9876543210" />
              <InputField label="Email" value="info@tecnavis.com" />
              <InputField label="Location" value="Dubai" />
              <div className="flex space-x-4 mt-2">
                <SocialIcon icon="facebook" />
                <SocialIcon icon="twitter" />
                <SocialIcon icon="instagram" />
              </div>
              <button className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition duration-300 mt-4">
                SAVE CHANGES
              </button>
            </div>
          </div>

          {/* Company Logo */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Company Logo</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-300 text-sm">
                Upload Logo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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



const InputField = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input type="text" value={value} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" readOnly />
  </div>
);

const SocialIcon = ({ icon }) => (
  <button className={`text-gray-400 hover:text-gray-600`}>
    <i className={`fab fa-${icon} text-lg`}></i>
  </button>
);

export default ProfilePage;