"use client";

import Navbar from "@/components/Navbar";
import ConditionCards from "@/components/ConditionCards";
import Footer from "@/components/Footer";

const ConditionsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative py-24 md:py-45 overflow-hidden">
        <div className="absolute inset-0 bg-muted">
          <img src="/assets/skin conditions.jpg" alt="Skin conditions background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Skin Conditions
          </h1>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg">
            Explore our comprehensive homeopathic treatment guides for common skin conditions.
          </p>
        </div>
      </section>
      <ConditionCards showAll />
      <Footer />
    </div>
  );
};

export default ConditionsPage;
