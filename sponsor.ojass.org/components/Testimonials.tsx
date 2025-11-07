"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      company: "Microsoft India",
      logo: "https://img.logos-world.net/wp-content/uploads/2020/09/Microsoft-Logo.png",
      quote: "Partnering with OJASS gave us unparalleled access to India's brightest tech talent. The student engagement and brand recall we achieved was exceptional.",
      author: "Rajesh Kumar",
      position: "Head of Campus Relations",
      rating: 5,
    },
    {
      company: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      quote: "OJASS provided the perfect platform to showcase our products and connect with passionate students. The ROI exceeded our expectations significantly.",
      author: "Priya Sharma",
      position: "Marketing Lead - Education",
      rating: 5,
    },
    {
      company: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      quote: "The recruitment opportunities through OJASS were outstanding. We identified and hired top talent from the event, making it one of our most successful campus initiatives.",
      author: "Amit Patel",
      position: "Talent Acquisition Manager",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="text-blue-600">Sponsors Say</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from brands who've experienced the OJASS impact firsthand
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* Company Logo */}
              <div className="mb-4 h-12 flex items-center">
                <img
                  src={testimonial.logo}
                  alt={testimonial.company}
                  className="h-8 w-auto object-contain"
                />
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-gray-100">
                <p className="font-bold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.position}</p>
                <p className="text-sm text-blue-600 font-semibold">{testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <p className="text-gray-600">Brands Partnered</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4.8/5</div>
              <p className="text-gray-600">Average Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <p className="text-gray-600">Return Sponsors</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

