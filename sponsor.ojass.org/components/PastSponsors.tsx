"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const PastSponsors = () => {
  // Actual OJASS sponsor logos
  const sponsors = [
    { name: "Zoutons", logo: "/Sponser/zoutons.webp" },
    { name: "Yamaha", logo: "/Sponser/yamaha.webp" },
    { name: "Zebronics", logo: "/Sponser/zebronics.webp" },
    { name: "White Rose", logo: "/Sponser/whiteRose.webp" },
    { name: "Winkies", logo: "/Sponser/winkies.webp" },
    { name: "Vidyamandir Classes", logo: "/Sponser/vidyamandirclasses.webp" },
    { name: "VOH Campus", logo: "/Sponser/vohCampus.webp" },
    { name: "Time", logo: "/Sponser/time.webp" },
    { name: "Turtle", logo: "/Sponser/turtle.webp" },
    { name: "Vadilal", logo: "/Sponser/vadilal.webp" },
    { name: "Tata Steel", logo: "/Sponser/tataSteel.webp" },
    { name: "The College Fever", logo: "/Sponser/theCollegeFever.webp" },
    { name: "Think India", logo: "/Sponser/thinkindia.webp" },
    { name: "Subway", logo: "/Sponser/subway.webp" },
    { name: "Sun Spa", logo: "/Sponser/sunspa.webp" },
    { name: "Tata Gluco Plus", logo: "/Sponser/tataGlucoPlus.webp" },
    { name: "Rapido", logo: "/Sponser/rapido.webp" },
    { name: "Shudh Jal", logo: "/Sponser/shudhJal.webp" },
    { name: "Radio Dhoom", logo: "/Sponser/radioDhoom.webp" },
    { name: "Pipal Tree", logo: "/Sponser/pipalTree.webp" },
    { name: "Pizza Hut", logo: "/Sponser/pizzahut.webp" },
    { name: "Portronics", logo: "/Sponser/portronics.webp" },
    { name: "Notice Bard", logo: "/Sponser/noticeBard.webp" },
    { name: "Peora", logo: "/Sponser/peora.webp" },
    { name: "Pind Balluchi", logo: "/Sponser/pindBalluchi.webp" },
    { name: "News Paper", logo: "/Sponser/newsPaper.webp" },
    { name: "Maggi", logo: "/Sponser/maggi.webp" },
    { name: "Monte Carlo", logo: "/Sponser/monteCarlo.webp" },
    { name: "Le Bon", logo: "/Sponser/leBon.webp" },
    { name: "L'Oreal", logo: "/Sponser/loreal.webp" },
    { name: "KFC", logo: "/Sponser/kfc.webp" },
    { name: "Knowafest", logo: "/Sponser/knowafest.webp" },
    { name: "Kwality Walls", logo: "/Sponser/kwalityWalls.webp" },
    { name: "Lakme", logo: "/Sponser/lakme.webp" },
    { name: "Juice", logo: "/Sponser/juice.webp" },
    { name: "Kawctopus", logo: "/Sponser/kawctopus.webp" },
    { name: "Indian Oil", logo: "/Sponser/indiaOil.webp" },
    { name: "Internshala", logo: "/Sponser/Internshala.webp" },
    { name: "Honda", logo: "/Sponser/honda.webp" },
    { name: "IBM", logo: "/Sponser/ibm.webp" },
    { name: "ICICI Bank", logo: "/Sponser/iciciBank.webp" },
    { name: "Himalaya", logo: "/Sponser/himalaya.webp" },
    { name: "Hoffman", logo: "/Sponser/hoffman.webp" },
    { name: "Ford", logo: "/Sponser/ford.webp" },
    { name: "GeeksforGeeks", logo: "/Sponser/gfg.webp" },
    { name: "Grill Inn", logo: "/Sponser/grillInn.webp" },
    { name: "Food Junction", logo: "/Sponser/foodJunction.webp" },
    { name: "Dipsters", logo: "/Sponser/dipsters.webp" },
    { name: "Domino's Pizza", logo: "/Sponser/domainoPizza.webp" },
    { name: "Eten IAS", logo: "/Sponser/etenIas.webp" },
    { name: "Coca Cola", logo: "/Sponser/cocaCola.webp" },
    { name: "CodeChef", logo: "/Sponser/codeChef.webp" },
    { name: "Dalchini", logo: "/Sponser/dalchini.webp" },
    { name: "Chhaganlal Dayaljee", logo: "/Sponser/chhaganlalDayaljee.webp" },
    { name: "CARHP", logo: "/Sponser/carhp.webp" },
    { name: "Cetra", logo: "/Sponser/cetra.webp" },
    { name: "Career Launcher", logo: "/Sponser/careerLauncher.webp" },
    { name: "BuyHatke", logo: "/Sponser/buyHatke.webp" },
    { name: "Cafe Regal", logo: "/Sponser/cafeRegal.webp" },
    { name: "Blue Sapphire", logo: "/Sponser/blueSapphire.webp" },
    { name: "Brunch", logo: "/Sponser/brunch.webp" },
    { name: "Big Cola", logo: "/Sponser/bigCola.webp" },
    { name: "Blue Diamond", logo: "/Sponser/blueDiamond.webp" },
    { name: "Bank of Baroda", logo: "/Sponser/bankofbaroda.webp" },
    { name: "Allevents", logo: "/Sponser/allevents.webp" },
    { name: "Aptrion", logo: "/Sponser/aptrion.webp" },
    { name: "Aptron", logo: "/Sponser/aptron.webp" },
    { name: "OYO", logo: "/Sponser/OYO.webp" },
    { name: "Pioneer Enviro", logo: "/Sponser/PioneerEnviro.webp" },
    { name: "Kadam", logo: "/Sponser/Kadam.webp" },
    { name: "DU Beat", logo: "/Sponser/DUbeat.webp" },
    { name: "IDFC", logo: "/Sponser/IDFC.webp" },
    { name: "DEDU Express", logo: "/Sponser/DEDUexpress.webp" },
  ];

  return (
    <section id="past-sponsors" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            Our <span className="text-blue-600">Past Sponsors</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mb-3 md:mb-4"></div>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by leading brands across industries
          </p>
        </motion.div>

        {/* All Sponsors Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-gray-100 hover:border-blue-600/30 group"
              >
                <div className="relative w-full h-10 sm:h-12 grayscale group-hover:grayscale-0 transition-all duration-300">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PastSponsors;

