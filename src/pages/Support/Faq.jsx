import React, { useState } from "react";
import faqImg from "../../assets/faqImg.png";
import { MessageCircle, Shield } from "lucide-react";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div
      className={`group rounded-[24px] border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-[#CFE0FF] bg-[#F8FBFF] shadow-[0_10px_30px_rgba(37,99,235,0.08)]"
          : "border-[#E7EEF7] bg-white hover:border-[#D6E4FF] hover:shadow-sm"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-start sm:items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 py-5 sm:py-6 text-left transition-all duration-300"
      >
        {/* QUESTION */}
        <div>
          <h3
            className={`text-[15px] sm:text-[16px] leading-6 sm:leading-7 font-semibold transition-all duration-300 ${
              isOpen ? "text-[#2563EB]" : "text-[#0F172A]"
            }`}
          >
            {question}
          </h3>
        </div>

        {/* ICON */}
        <div
          className={`min-w-[38px] sm:min-w-[42px] h-[38px] sm:h-[42px] rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-[#2563EB] text-white rotate-45"
              : "bg-[#F1F5F9] text-[#64748B] group-hover:bg-[#E8F0FF]"
          }`}
        >
          <span className="text-[24px]  leading-none mt-[-5px]">+</span>
        </div>
      </button>

      {/* ANSWER */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 sm:px-6 pb-5 sm:pb-6">
            <div className="h-[1px] bg-[#E7EEF7] mb-5" />

            <p className="text-[14px] sm:text-[15px] leading-7 sm:leading-8 text-[#64748B]">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
const FAQ = () => {
  const technicalFAQs = [
    {
      question: "What technologies power the trading dashboard?",
      answer:
        "The dashboard is built using a combination of modern web technologies, including React, and a robust backend framework like Node.js. For live rate updates, we use WebSocket connections to ensure real-time data delivery.",
    },
    {
      question: "How accurate are the live rates displayed on the dashboard?",
      answer:
        "The live rates for gold and silver are sourced from reputable financial data providers and global market feeds. Rates are updated every second to reflect the latest market conditions.",
    },
    {
      question: "Can I customize the dashboard?",
      answer:
        "Yes, users can customize their dashboard by selecting preferred commodities, adjusting data refresh intervals, and setting alerts for specific price thresholds.",
    },
    {
      question: "What browsers are supported?",
      answer:
        "The dashboard supports all major browsers, including Google Chrome, Mozilla Firefox, Safari, and Microsoft Edge. For the best experience, we recommend using the latest version of your preferred browser.",
    },
    {
      question: "Is the platform mobile-friendly?",
      answer:
        "Yes, the dashboard is fully responsive and optimized for use on mobile devices, tablets, and desktops.",
    },
    {
      question: "How do I troubleshoot display issues?",
      answer:
        "If you experience any display issues, please try refreshing the page or clearing your browser cache. If the problem persists, contact our support team with details of the issue and your browser version.",
    },
    {
      question: "Can I export data from the dashboard?",
      answer:
        "Yes, you can export data in various formats, including CSV and Excel, for offline analysis and record-keeping.",
    },
  ];

  const securityFAQs = [
    {
      question: "How secure is the trading dashboard?",
      answer:
        "Security is a top priority. Our platform uses industry-standard encryption protocols (SSL/TLS) to protect data transmissions and ensure secure connections.",
    },
    {
      question: "What measures are in place to protect my account?",
      answer:
        "We implement multi-factor authentication (MFA) for account access, strong password policies, and account lockout mechanisms after multiple failed login attempts to prevent unauthorized access.",
    },
    {
      question: "How is my personal data protected?",
      answer:
        "Personal data is stored in encrypted form on secure servers. We comply with data protection regulations like GDPR to ensure your personal information is handled with the highest level of security and privacy.",
    },
    {
      question: "Is the platform monitored for security threats?",
      answer:
        "Yes, our platform is continuously monitored for potential security threats. We use advanced intrusion detection and prevention systems to safeguard against malicious activity.",
    },
    {
      question:
        "What should I do if I suspect unauthorized activity on my account?",
      answer:
        "If you suspect unauthorized activity, please contact our support team immediately. We will assist you in securing your account and investigating the issue.",
    },
    {
      question: "Does the platform offer secure payment options?",
      answer:
        "Yes, all transactions are processed through secure, PCI-compliant payment gateways, ensuring your financial data is protected.",
    },
    {
      question: "How can I report a security vulnerability?",
      answer: (
        <span>
          If you discover a security vulnerability, please report it to our
          security team via{" "}
          <a
            href="https://www.aurify.ae"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            www.aurify.ae
          </a>
          . We take all reports seriously and will address them promptly.
        </span>
      ),
    },
    {
      question: "Are there backups in case of data loss?",
      answer:
        "We perform regular data backups and have disaster recovery plans in place to ensure that your data is safe and can be restored in the event of any data loss.",
    },
  ];

  const [openTechnical, setOpenTechnical] = useState(null);
  const [openSecurity, setOpenSecurity] = useState(null);

  return (
    <div className="min-h-screen bg-[#F6F8FC] px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {" "}
      <div className="mw-full mx-auto">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-[40px] border border-[#E7EEF7] bg-white mb-8">
          {/* SOFT BACKGROUND */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-180px] right-[-120px] w-[500px] h-[500px] rounded-full bg-[#EAF2FF] blur-3xl opacity-80" />

            <div className="absolute bottom-[-180px] left-[-100px] w-[420px] h-[420px] rounded-full bg-[#F2F7FF] blur-3xl opacity-90" />

            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(37,99,235,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.25) 1px, transparent 1px)",
                backgroundSize: "70px 70px",
              }}
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center px-5 sm:px-8 lg:px-16 py-10 sm:py-14 lg:py-16 gap-10">
            {/* LEFT CONTENT */}
            <div>
              {/* BADGE */}
              <div className="inline-flex items-center gap-3 h-[46px] px-5 rounded-full bg-[#F4F8FF] border border-[#DCE8FF] mb-8">
                <div className="w-2 h-2 rounded-full bg-[#2563EB]" />

                <span className="text-[13px] font-semibold tracking-[1px] text-[#2563EB] uppercase">
                  Support Center
                </span>
              </div>

              {/* TITLE */}
              <h1 className="text-[34px] sm:text-[46px] lg:text-[50px] 2xl:text-[58px] leading-[42px] sm:leading-[54px] lg:leading-[64px] font-semibold tracking-[-1px] sm:tracking-[-2px] text-[#0F172A]">
                {" "}
                Frequently
                <br />
                Asked Questions
              </h1>

              {/* DESCRIPTION */}
              <p className="text-[#64748B] text-[15px] sm:text-[15px] sm:text-[16px] leading-6 sm:leading-7 sm:leading-8 mt-6 sm:mt-8 max-w-[620px]">
                {" "}
                Find answers about platform features, real-time market data,
                account security, dashboard customization and technical support.
              </p>

              {/* TAGS */}
              <div className="flex flex-wrap gap-4 mt-10">
                <div className="h-[46px] sm:h-[52px] px-4 sm:px-6 rounded-2xl bg-white border border-[#E2E8F0] flex items-center text-[13px] sm:text-sm font-medium text-[#334155] shadow-sm">
                  {" "}
                  Live Market Data
                </div>

                <div className="h-[46px] sm:h-[52px] px-4 sm:px-6 rounded-2xl bg-white border border-[#E2E8F0] flex items-center text-[13px] sm:text-sm font-medium text-[#334155] shadow-sm">
                  {" "}
                  Enterprise Security
                </div>

                <div className="h-[46px] sm:h-[52px] px-4 sm:px-6 rounded-2xl bg-white border border-[#E2E8F0] flex items-center text-[13px] sm:text-sm font-medium text-[#334155] shadow-sm">
                  {" "}
                  24/7 Assistance
                </div>
              </div>
            </div>
            {/* RIGHT IMAGE */}
            <div className="relative flex justify-center lg:justify-end">
              {/* CARD */}
              <div className="relative w-full max-w-[500px] rounded-[36px] bg-gradient-to-br from-[#F8FBFF] to-[#EEF4FF] border border-[#E4ECF8] p-6 shadow-[0_20px_60px_rgba(37,99,235,0.08)]">
                {/* IMAGE */}
                <div className="relative rounded-[28px] overflow-hidden bg-white border border-[#E8EEF7] p-4">
                  <img
                    src={faqImg}
                    alt="FAQ"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ GRID */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 lg:gap-8">
          {" "}
          {/* TECHNICAL */}
          <div className="bg-white rounded-[24px] sm:rounded-[34px] border border-[#E7EEF7] p-5 sm:p-8 shadow-sm">
            {" "}
            {/* HEADER */}
            <div className="flex items-start gap-5 mb-8">
              <div className="w-16 h-16 rounded-[22px] bg-[#EEF4FF] flex items-center justify-center border border-[#DCE8FF]">
                <MessageCircle size={25} className="text-blue-500" />
              </div>

              <div>
                <h2 className="text-[24px] sm:text-[32px] font-semibold text-[#0F172A]">
                  Technical FAQs
                </h2>

                <p className="text-[#64748B] text-[15px] leading-7 mt-3 max-w-[480px]">
                  Learn more about live rates, dashboard features, supported
                  platforms and customization options.
                </p>
              </div>
            </div>
            {/* FAQ ITEMS */}
            <div className="space-y-4">
              {technicalFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openTechnical === index}
                  onClick={() =>
                    setOpenTechnical(openTechnical === index ? null : index)
                  }
                />
              ))}
            </div>
          </div>
          {/* SECURITY */}
          <div className="bg-white rounded-[24px] sm:rounded-[34px] border border-[#E7EEF7] p-5 sm:p-8 shadow-sm">
            {" "}
            {/* HEADER */}
            <div className="flex items-start gap-5 mb-8">
              <div className="w-16 h-16 rounded-[22px] bg-[#EEF4FF] flex items-center justify-center border border-[#DCE8FF]">
                <Shield size={25} className="text-blue-500" />{" "}
              </div>
              <div>
                <h2 className="text-[24px] sm:text-[32px] font-semibold text-[#0F172A]">
                  Security FAQs
                </h2>

                <p className="text-[#64748B] text-[15px] leading-7 mt-3 max-w-[480px]">
                  Understand how we protect your account, transactions and
                  personal data security.
                </p>
              </div>
            </div>
            {/* FAQ ITEMS */}
            <div className="space-y-4">
              {securityFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openSecurity === index}
                  onClick={() =>
                    setOpenSecurity(openSecurity === index ? null : index)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
