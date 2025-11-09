"use client";

import { motion } from "framer-motion";
import { Check, Crown, Award, Star, Zap, Diamond, Sparkles } from "lucide-react";

const SponsorshipPackages = () => {
  const titleSponsor = {
    name: "Title Sponsor",
    icon: Crown,
    price: "₹5L",
    color: "from-purple-500 to-purple-600",
    borderColor: "border-purple-500",
    exclusivity: "Most Exclusive",
    features: [
      "Naming rights: \"OJASS presented by [Your Brand]\"",
      "Prominent title mention across all platforms",
      "Prime stage and LED branding visibility",
      "Exclusive VIP booth and product showcase zone",
      "Presence at opening, closing, and flagship events",
      "Co-branded digital campaign with 5M+ reach",
      "Integration with recruitment and ambassador programs",
      "Dedicated media coverage and post-event analytics",
    ],
  };

  const packages = [
    {
      name: "Diamond Sponsor",
      icon: Diamond,
      price: "₹4L",
      color: "from-cyan-500 to-cyan-600",
      borderColor: "border-cyan-500",
      exclusivity: "Premium",
      features: [
        "Prominent logo on all event materials & website",
        "Exclusive branding at flagship events",
        "Premium booth space in prime location",
        "Integration in social media & email campaigns",
        "Opportunity to host workshops or seminars",
        "Product sampling & merchandise distribution rights",
        "Branded standees and digital displays at venue",
        "Recruitment stall setup with student interaction",
        "Post-event engagement & analytics insights",
      ],
    },
    {
      name: "Platinum",
      icon: Award,
      price: "₹3L",
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-500",
      exclusivity: "Elite",
      features: [
        "Elite logo presence across all festival touchpoints",
        "Dynamic stage branding at headline events",
        "Prime showcase booth in high-footfall zones",
        "Engaging social media collaborations",
        "Feature mention in student email outreach (50K+ reach)",
        "Host exclusive workshops or seminars",
        "Custom-branded merchandise for audience giveaways",
        "Interactive product sampling at key locations",
        "On-site recruitment experience for top talent",
        "Exclusive event-specific sponsorship privileges",
      ],
    },
    {
      name: "Gold",
      icon: Star,
      price: "₹2L",
      color: "from-yellow-500 to-yellow-600",
      borderColor: "border-yellow-500",
      exclusivity: "Select",
      features: [
        "Logo featured on website & promotional assets",
        "Stage recognition at select events",
        "Standard booth for brand visibility",
        "Social media highlights (5–7 posts)",
        "Inclusion in email campaigns",
        "Branded standees across the venue",
        "Product demo opportunities",
        "On-site recruitment desk",
        "Post-event engagement analytics",
      ],
    },
    {
      name: "Silver",
      icon: Zap,
      price: "₹1L",
      color: "from-gray-500 to-gray-600",
      borderColor: "border-gray-500",
      exclusivity: "Featured",
      features: [
        "Logo featured on website & selected materials",
        "Event-specific branding opportunities",
        "Booth space for on-site presence",
        "Social media mentions (3–4 posts)",
        "Branded giveaways for attendees",
        "Brochure & flyer distribution rights",
        "Interactive student engagement activities",
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

        {/* Title Sponsor - Separately Displayed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className={`relative bg-gradient-to-br ${titleSponsor.color} rounded-3xl p-8 border-4 ${titleSponsor.borderColor} shadow-2xl overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Icon and Title Section */}
                <div className="flex-shrink-0 text-center lg:text-left">
                  {(() => {
                    const TitleIcon = titleSponsor.icon;
                    return (
                      <div className={`inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-4 shadow-2xl`}>
                        <TitleIcon className="w-14 h-14 text-white" />
                      </div>
                    );
                  })()}
                  <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="text-white font-bold text-sm uppercase tracking-wide">{titleSponsor.exclusivity}</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                    {titleSponsor.name}
                  </h3>
                  <div className="text-4xl font-bold text-white mb-4">
                    {titleSponsor.price}
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                    <Crown className="w-5 h-5 text-yellow-300" />
                    <span className="text-white font-semibold text-sm">Ultimate Exclusivity</span>
                  </div>
                </div>

                {/* Features Section */}
                <div className="flex-grow">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {titleSponsor.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                        <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-white bg-white/20 rounded-full p-0.5" />
                        <span className="text-sm text-white leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8 text-center">
                <motion.a
                  href="mailto:sponsorship@ojass.org?subject=Title%20Sponsorship%20Inquiry"
                  className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Crown className="w-5 h-5" />
                  Claim Title Sponsorship
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Packages Grid - 4 in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl p-5 border-2 ${pkg.borderColor} hover:shadow-2xl transition-all duration-300 flex flex-col`}
              >
                {/* Exclusivity Badge */}
                <div className="absolute -top-3 right-4">
                  <div className={`flex items-center gap-1 bg-gradient-to-r ${pkg.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                    <Sparkles className="w-3 h-3" />
                    <span>{pkg.exclusivity}</span>
                  </div>
                </div>

                {/* Icon - Prominent Display */}
                <div className="text-center mb-4 mt-2">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${pkg.color} rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Title with Exclusivity Styling */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    <span>{pkg.name}</span>
                  </h3>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent mb-3`}>
                    {pkg.price}
                  </div>
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r ${pkg.color} bg-opacity-10 border-2 ${pkg.borderColor} border-opacity-30`}>
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className={`text-xs font-semibold bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent`}>
                      Exclusive Access
                    </span>
                  </div>
                </div>

                {/* Features - Compact */}
                <ul className="space-y-2 mb-4 flex-grow">
                  {pkg.features.slice(0, 5).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 bg-gradient-to-r ${pkg.color} text-white rounded-full p-0.5`} />
                      <span className="text-xs text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                  {pkg.features.length > 5 && (
                    <li className="text-xs text-gray-500 italic">
                      +{pkg.features.length - 5} more benefits
                    </li>
                  )}
                </ul>

                {/* CTA Button */}
                <motion.a
                  href="mailto:sponsorship@ojass.org"
                  className={`block w-full text-center bg-gradient-to-r ${pkg.color} text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300 mt-auto`}
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
          Every brand is unique—let’s craft a sponsorship package that fits your goals
          perfectly!
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

