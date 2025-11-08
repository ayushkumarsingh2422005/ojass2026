"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Perks from "@/components/Perks";
import TitleSponsor from "@/components/TitleSponsor";
import SponsorshipPackages from "@/components/SponsorshipPackages";
import PastSponsors from "@/components/PastSponsors";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import RegisterSection from "@/components/RegisterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Perks />
      <TitleSponsor />
      <SponsorshipPackages />
      <PastSponsors />
      <Testimonials />
      <FAQ />
      <RegisterSection />
      <Footer />
    </main>
  );
}
