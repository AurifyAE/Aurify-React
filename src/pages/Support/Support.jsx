import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../axios/axiosInstance";
import FAQ from "./Faq";
import { Link } from "lucide-react";
import aurifyLogo from "../../assets/logo.png";
const ContactForm = () => {
  const [activeTab, setActiveTab] = useState("contact");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    message: "",
    privacyChecked: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/contact", formData);
      toast.success("Message sent successfully!", {
        position: "top-right",
        duration: 3000,
      });
      setFormData({
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        phoneNumber: "",
        message: "",
        privacyChecked: false,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error sending message. Please try again.", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col p-8 rounded-lg shadow-lg h-full">
      <Toaster />

      {/* Tab switching buttons */}
      <div className="flex justify-center mb-4">
        <div className="flex space-x-8">
          <button
            className={`text-lg font-medium transition-colors duration-300 ease-in-out ${
              activeTab === "contact"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            Contact Us
          </button>
          <button
            className={`text-lg font-medium transition-colors duration-300 ease-in-out ${
              activeTab === "faq"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("faq")}
          >
            FAQs
          </button>
        </div>
      </div>

      {/* Get in touch section with dark purple linear gradient */}
      {activeTab === "contact" ? (
        <div className="flex">
          <div className="w-1/3 pr-4 bg-gradient-to-b from-purple-600 to-purple-700 text-white p-6 rounded-lg mt-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Get in touch</h2>
              <img src={aurifyLogo} alt="Aurify Logo" className="h-12 object-contain" />
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">Chat with us</h3>
              <p>Our friendly team is here to help.</p>
              <p>Email: aurifycontact@gmail.com</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">Call us</h3>
              <p>Available Mon-Sat from 10am to 10pm</p>
              <p>Phone: (+91) 971585023411</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">Meet our team</h3>
              <p>Muhammed Ajmal TK</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Stay connected</h3>
              <a 
                href="https://www.aurify.ae/" 
                className="text-purple-200 hover:text-white flex items-center transition-all duration-300 ease-in-out"
              >
                <Link className="mr-2" size={16} />
                <span className="border-b border-purple-200 hover:border-white">www.aurify.ae</span>
              </a>
            </div>
          </div>

          {/* Form section */}
          <div className="w-2/3 bg-white p-6 rounded-lg mt-4">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  placeholder="First Name"
                  required
                  className="w-full p-2 border-b-2 border-gray-300 bg-transparent text-black focus:outline-none focus:border-purple-600"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  placeholder="Last Name"
                  required
                  className="w-full p-2 border-b-2 border-gray-300 bg-transparent text-black focus:outline-none focus:border-purple-600"
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  placeholder="Company Name"
                  required
                  className="w-full p-2 border-b-2 border-gray-300 bg-transparent text-black focus:outline-none focus:border-purple-600"
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Email"
                  required
                  className="w-full p-2 border-b-2 border-gray-300 bg-transparent text-black focus:outline-none focus:border-purple-600"
                  onChange={handleChange}
                />
              </div>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                placeholder="Phone Number"
                required
                className="w-1/2 p-2 border-b-2 border-gray-300 bg-transparent text-black focus:outline-none focus:border-purple-600 mb-4"
                onChange={handleChange}
              />
              <textarea
                name="message"
                value={formData.message}
                placeholder="Tell us what we can help you with"
                required
                className="w-full p-2 border-b-2 border-gray-300 bg-transparent text-black focus:outline-none focus:border-purple-600 mb-4 h-32"
                onChange={handleChange}
              ></textarea>
              <button
                type="submit"
                className="w-3/4 bg-purple-600 text-white p-2 rounded hover:bg-purple-700 mt-20 mx-auto block transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      ) : (
        <FAQ />
      )}
    </div>
  );
};

export default ContactForm;