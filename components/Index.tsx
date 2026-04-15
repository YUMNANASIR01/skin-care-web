"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ConditionCards from "@/components/ConditionCards";
import QuickContactSection from "@/components/QuickContactSection";
import Footer from "@/components/Footer";
import { Leaf, BookOpen, MessageCircle, Shield } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Step-by-Step Guides",
    description: "Detailed treatment plans with remedies, dosages, and timelines for each skin condition.",
  },
  {
    icon: Leaf,
    title: "100% Natural",
    description: "All treatments use homeopathic remedies — safe, gentle, and without side effects.",
  },
  {
    icon: MessageCircle,
    title: "AI Consultant",
    description: "Get instant answers about skin conditions and personalized treatment advice.",
  },
  {
    icon: Shield,
    title: "Expert Knowledge",
    description: "Information curated from established homeopathic treatment protocols.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Features */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="text-center p-6 bg-card rounded-xl border border-border shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConditionCards />
      <QuickContactSection />
      <Footer />
    </div>
  );
};

export default Index;
