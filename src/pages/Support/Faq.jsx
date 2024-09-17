import React, { useState } from "react";
import faqImg from "../../assets/faqImg.png";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{question}</span>
        <span>{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && <p className="mt-2 text-gray-600">{answer}</p>}
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

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="lg:w-full p-4">
        <div className="bg-purple-600 text-white p-8 rounded-lg mb-8 flex flex-col lg:flex-row items-center justify-between w-full min-h-[400px]">
          {/* Left section: Text */}
          <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="mb-4">
              Need help with something? Here are our most frequently asked
              questions.
            </p>
          </div>

          {/* Right section: Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <img
              src={faqImg}
              alt="Dashboard mockup"
              className="max-w-full h-auto object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Technical FAQs</h2>
          <p className="mb-4">
            Everything you need to know about the technical aspects of our
            trading dashboard.
          </p>
          {technicalFAQs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="bg-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Security FAQs</h2>
          <p className="mb-4">
            Learn about the security measures we have in place to protect your
            account and data.
          </p>
          {securityFAQs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
