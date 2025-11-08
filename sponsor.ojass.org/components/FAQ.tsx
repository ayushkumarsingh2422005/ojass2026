"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What sponsorship packages are available?",
      answer: "We offer customized tiers covering on-ground branding, digital campaigns, stage integrations, booths, and recruitment add-ons. Share your goals and we’ll tailor a package.",
    },
    {
      question: "What audience size and profile can we expect?",
      answer: "25k+ on-ground attendees across 3-4 days, 5M+ digital impressions, and participation from 100+ campuses. Core audience: tech, design, management, and creator communities.",

    },
    {
      question: "Can we run product demos or sampling?",
      answer: "Yes. We facilitate booth placements, trials, demos, campus challenges, and giveaway activities during peak hours for high engagement.",
    },
    {
      question: "How do we get the sponsorship deck and pricing?",
      answer: "Email sponsorship@ojass.org to receive the deck, rate card, and available opportunities. We typically respond within 24 hours.",
    },
    {
      question: "Do you support recruitment or hiring use-cases?",
      answer: "Yes. We can structure hackathons, case competitions, or shortlisting workflows to help you identify and engage top talent.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">
            Got questions? We've got answers
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-600 transition-colors duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-gray-900 pr-8">
                  {faq.question}
                </span>
                <motion.div
                  animate={{
                    rotate: openIndex === index ? 180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-gray-50 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

