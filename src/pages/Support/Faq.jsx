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
  const faqData = [
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we have a free version available for you to try out! It's an incredibly powerful and large UI kit for Figma in its own right, but it doesn't use the latest component property features announced at Config 2022. You can duplicate this UI kit here and use it in as many projects as you'd like.",
    },
    {
      question: "What does the free version include?",
      answer:
        "The free version includes a subset of our components and features. For more details, please visit our pricing page.",
    },
    {
      question: "Do you have an affiliate program?",
      answer:
        "Yes, we do have an affiliate program. For more information, please contact our support team.",
    },
    {
      question: "Do I need to know how to use Figma?",
      answer:
        "While having some knowledge of Figma is beneficial, our UI kit is designed to be user-friendly for beginners as well. We provide documentation and tutorials to help you get started.",
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

        <div className="bg-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">General FAQs</h2>
          <p className="mb-4">
            Everything you need to know about the product and how it works.
            Can't find an answer?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Chat to our team
            </a>
            .
          </p>
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;