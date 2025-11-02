"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Perks from "@/components/Perks";
import Responsibilities from "@/components/Responsibilities";
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
      <Responsibilities />
      <FAQ />
      <RegisterSection/>
      <Footer />
    </main>
  );
}
