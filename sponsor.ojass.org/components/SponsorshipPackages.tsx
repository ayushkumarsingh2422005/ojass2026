"use client";

import { motion } from "framer-motion";
import { Check, Crown, Award, Star, Zap } from "lucide-react";

const SponsorshipPackages = () => {
  const packages = [
    {
      name: "Title Sponsor",
      icon: Crown,
      price: "Contact Us",
      color: "from-purple-500 to-purple-600",
      borderColor: "border-purple-500",
      popular: true,
      features: [
        "Festival naming rights (\"OJASS presented by [Brand]\")",
        "Exclusive title mention across all materials",
        "Prime stage branding & LED takeover",
        "VIP booth location & product demo zone",
        "Opening & closing ceremony presence",
        "Digital campaign co-branding (5M+ reach)",
        "Recruitment drive integration",
        "Exclusive media coverage & press releases",
        "Campus ambassador program integration",
        "Post-event engagement analytics",
      ],
    },
    {
      name: "Platinum",
      icon: Award,
      price: "₹15-20L",
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-500",
      popular: false,
      features: [
        "Premium logo placement on all materials",
        "Stage branding at flagship events",
        "Booth space in prime location",
        "Social media campaign integration",
        "Email campaign mention (50k+ students)",
        "Workshop/seminar hosting opportunity",
        "Branded merchandise distribution",
        "Product sampling at high-traffic zones",
        "Recruitment stall setup",
        "Event-specific sponsorship rights",
      ],
    },
    {
      name: "Gold",
      icon: Star,
      price: "₹8-12L",
      color: "from-yellow-500 to-yellow-600",
      borderColor: "border-yellow-500",
      popular: false,
      features: [
        "Logo on website & promotional materials",
        "Stage mention at selected events",
        "Standard booth space",
        "Social media shoutouts (5-7 posts)",
        "Email campaign inclusion",
        "Branded standees at venue",
        "Product demo opportunities",
        "Recruitment desk option",
        "Engagement analytics report",
      ],
    },
    {
      name: "Silver",
      icon: Zap,
      price: "₹4-6L",
      color: "from-gray-500 to-gray-600",
      borderColor: "border-gray-500",
      popular: false,
      features: [
        "Logo on website & selected materials",
        "Event-specific branding",
        "Booth space availability",
        "Social media mentions (3-4 posts)",
        "Branded giveaways distribution",
        "Brochure & flyer distribution rights",
        "Student engagement activities",
      ],
    },
  ];

  return (
    <section id="packages" className="py-20 bg-gradient-to-b from-blue-50 to-white">
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
            Sponsorship <span className="text-blue-600">Packages</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a package that aligns with your brand goals and budget. All packages are customizable.
          </p>
        </motion.div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl p-6 border-2 ${pkg.borderColor} hover:shadow-2xl transition-all duration-300 ${
                  pkg.popular ? "ring-4 ring-purple-200 scale-105" : ""
                }`}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Exclusive
                  </div>
                )}

                {/* Icon & Title */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${pkg.color} rounded-xl mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent`}>
                    {pkg.price}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 bg-gradient-to-r ${pkg.color} text-white rounded-full p-0.5`} />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.a
                  href="mailto:sponsorship@ojass.org"
                  className={`block w-full text-center bg-gradient-to-r ${pkg.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.a>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Package CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Need a Custom Package?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We understand every brand has unique objectives. Let's create a tailored sponsorship package that perfectly matches your goals.
          </p>
          <motion.a
            href="mailto:sponsorship@ojass.org?subject=Custom%20Sponsorship%20Package%20Inquiry"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us for Custom Package
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorshipPackages;

