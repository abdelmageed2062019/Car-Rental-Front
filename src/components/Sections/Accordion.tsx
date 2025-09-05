"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What documents do I need to rent a car?",
      answer:
        "You'll need a valid driver's license, credit card, and proof of insurance. International drivers may also need an International Driving Permit (IDP) and passport.",
    },
    {
      question: "What is the minimum age to rent a car?",
      answer:
        "The minimum age to rent a car is typically 21 years old. Drivers under 25 may be subject to additional fees. Some luxury vehicles may require drivers to be 25 or older.",
    },
    {
      question: "Can I extend my rental period?",
      answer:
        "Yes, you can extend your rental period by contacting us at least 24 hours before your scheduled return time. Extensions are subject to vehicle availability and additional charges.",
    },
    {
      question: "What happens if I return the car late?",
      answer:
        "Late returns may incur additional charges. We provide a 29-minute grace period, after which you'll be charged for an additional day. Please contact us if you anticipate being late.",
    },
    {
      question: "Do you offer roadside assistance?",
      answer:
        "Yes, we provide 24/7 roadside assistance for all our rental vehicles. This includes towing, jump-starts, fuel delivery, and lockout assistance. Contact our emergency hotline for immediate help.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our car rental services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accordion;
