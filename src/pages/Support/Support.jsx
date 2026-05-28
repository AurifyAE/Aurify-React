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
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFF] via-[#F4F8FD] to-[#EEF4FF] px-6 py-10">
    <Toaster />
  
    {/* TOP TAB */}
    <div className="flex justify-center mb-10">
      <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(37,99,235,0.08)] rounded-[22px] p-1.5 flex items-center gap-2">
        
        <button
          onClick={() => setActiveTab("contact")}
          className={`h-[50px] px-8 rounded-[16px] text-sm font-semibold transition-all duration-300 ${
            activeTab === "contact"
              ? "bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white shadow-[0_8px_20px_rgba(59,130,246,0.35)]"
              : "text-[#64748B] hover:bg-[#F4F7FB]"
          }`}
        >
          Contact Us
        </button>
  
        <button
          onClick={() => setActiveTab("faq")}
          className={`h-[50px] px-8 rounded-[16px] text-sm font-semibold transition-all duration-300 ${
            activeTab === "faq"
              ? "bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white shadow-[0_8px_20px_rgba(59,130,246,0.35)]"
              : "text-[#64748B] hover:bg-[#F4F7FB]"
          }`}
        >
          FAQs
        </button>
      </div>
    </div>
  
    {activeTab === "contact" ? (
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[500px_1fr] gap-6">
  
        {/* LEFT PANEL */}
        <div className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#EAF3FF_0%,#DCEBFF_45%,#F7FBFF_100%)] backdrop-blur-xl border-2 border-white shadow-[0_20px_60px_rgba(37,99,235,0.12)] p-10">
  
          {/* PREMIUM EFFECTS */}
          <div className="absolute inset-0 overflow-hidden">
  
            <div className="absolute top-[-120px] right-[-100px] w-[300px] h-[300px] rounded-full bg-[#60A5FA]/20 blur-3xl" />
  
            <div className="absolute bottom-[-100px] left-[-80px] w-[260px] h-[260px] rounded-full bg-[#93C5FD]/20 blur-3xl" />
  
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(37,99,235,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.15) 1px, transparent 1px)",
                backgroundSize: "55px 55px",
              }}
            />
          </div>
  
          {/* CONTENT */}
          <div className="relative z-10 flex flex-col h-full">
  
            {/* LOGO */}
            <div className="w-[82px] h-[82px] rounded-[28px] bg-white/70 backdrop-blur-xl border border-white shadow-[0_10px_30px_rgba(37,99,235,0.08)] flex items-center justify-center mb-14">
              <img
                src={aurifyLogo}
                alt="Aurify"
                className="h-10 object-contain"
              />
            </div>
  
            {/* TITLE */}
            <div>
              <p className="text-[#60A5FA] uppercase tracking-[3px] text-[11px] mb-5 font-semibold">
                Contact Aurify
              </p>
  
              <h1 className="text-[45px] leading-[56px] font-bold text-[#0F172A] tracking-[-2px]">
                Let’s build
                something
                amazing.
              </h1>
  
              <p className="text-[#475569] text-[15px] leading-8 mt-8 max-w-[320px] font-medium">
                Connect with our team for digital products, branding and
                business growth solutions.
              </p>
            </div>
  
            {/* CONTACT */}
            <div className="mt-14 space-y-8">
  
              <div>
                <p className="text-[#60A5FA] text-[11px] uppercase tracking-[3px] mb-2 font-semibold">
                  Email
                </p>
  
                <p className="text-[#0F172A] text-[17px] font-semibold">
                  aurifycontact@gmail.com
                </p>
              </div>
  
              <div>
                <p className="text-[#60A5FA] text-[11px] uppercase tracking-[3px] mb-2 font-semibold">
                  Phone
                </p>
  
                <p className="text-[#0F172A] text-[17px] font-semibold">
                  (+91) 971585023411
                </p>
              </div>
  
              <div>
                <p className="text-[#60A5FA] text-[11px] uppercase tracking-[3px] mb-2 font-semibold">
                  Website
                </p>
  
                <a
                  href="https://www.aurify.ae/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-[#2563EB] text-[17px] font-semibold hover:opacity-80 transition-all"
                >
                  <Link size={17} />
                  www.aurify.ae
                </a>
              </div>
            </div>
  
            {/* FOOTER */}
            <div className="mt-auto pt-14">
  
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#CBDCF8] to-transparent mb-7" />
  
              <div className="flex items-center justify-between">
  
                <div>
                  <p className="text-[#7B8AA0] text-xs uppercase tracking-[2px]">
                    Availability
                  </p>
  
                  <p className="text-[#0F172A] text-sm font-medium mt-2">
                    Mon - Sat / 10AM - 10PM
                  </p>
                </div>
  
                <div className="w-14 h-14 rounded-full bg-white border border-[#DCE8FF] shadow-[0_8px_24px_rgba(37,99,235,0.08)] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* RIGHT FORM */}
        <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[36px] p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
  
          {/* HEADER */}
          <div className="mb-10">
            <p className="uppercase tracking-[3px] text-xs text-[#7B8AA0] mb-4">
              Get Started
            </p>
  
            <h2 className="text-[42px] font-bold text-[#0F172A] leading-tight tracking-[-1px]">
              Send a message
            </h2>
  
            <p className="text-[#64748B] text-[15px] mt-5 leading-7 max-w-[520px]">
              Fill out the form below and our team will contact you shortly.
            </p>
          </div>
  
          {/* FORM */}
          <form onSubmit={handleSubmit}>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <InputField
                type="text"
                name="firstName"
                value={formData.firstName}
                placeholder="First Name"
                onChange={handleChange}
              />
  
              <InputField
                type="text"
                name="lastName"
                value={formData.lastName}
                placeholder="Last Name"
                onChange={handleChange}
              />
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <InputField
                type="text"
                name="companyName"
                value={formData.companyName}
                placeholder="Company Name"
                onChange={handleChange}
              />
  
              <InputField
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email Address"
                onChange={handleChange}
              />
            </div>
  
            <div className="mb-5">
              <InputField
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                placeholder="Phone Number"
                onChange={handleChange}
              />
            </div>
  
            {/* TEXTAREA */}
            <div className="mb-7">
              <textarea
                name="message"
                value={formData.message}
                placeholder="Tell us about your project or requirement..."
                required
                onChange={handleChange}
                className="w-full h-[180px] rounded-[24px] border border-[#E2E8F0] bg-white/80 backdrop-blur-sm px-6 py-5 text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#60A5FA] focus:ring-4 focus:ring-[#DBEAFE] transition-all resize-none"
              />
            </div>
  
            {/* CHECKBOX */}
            <div className="flex items-center gap-3 mb-8">
              <input
                type="checkbox"
                name="privacyChecked"
                checked={formData.privacyChecked}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 accent-[#3B82F6]"
              />
  
              <p className="text-sm text-[#64748B]">
                I agree to the privacy policy and terms.
              </p>
            </div>
  
            {/* BUTTON */}
            <button
              type="submit"
              className="w-full h-[52px] sm:h-[58px] lg:h-[66px] text-large primary-btn"
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
const InputField = ({ type, name, value, placeholder, onChange }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      required
      onChange={onChange}
      className="w-full h-[64px] rounded-[22px] border border-[#E5E7EB] bg-white px-6 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#111827] transition-all shadow-sm"
    />
  );
};

export default ContactForm;
