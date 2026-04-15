"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Leaf, GraduationCap, Heart, Award, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const doctorImages = [
  "/assets/dr yumna1.jpg",
  "/assets/dr yumna2.jpg",
  "/assets/dr yumna3.jpg",
];

const AboutPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % doctorImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero with Background Swiper */}
      <section className="relative py-31 overflow-hidden">
        {/* Background Swiper */}
        <div className="absolute inset-0">
          {doctorImages.map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img src={img} alt={`Dr. Yumna Nasir - Slide ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-foreground/70" />
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {doctorImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-primary w-8" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border-2 border-primary/30">
            <Leaf className="h-12 w-12 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Dr. Yumna Nasir
          </h1>
          <p className="text-lg text-primary-foreground/90 font-semibold mb-2">DHMS (Diploma in Homeopathic Medicine & Surgery)</p>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Dedicated homeopathic physician specializing in dermatological conditions,
            committed to healing skin naturally through time-tested homeopathic principles.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">About Dr. Yumna Nasir</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Dr. Yumna Nasir is a qualified homeopathic physician holding a DHMS 
                  (Diploma in Homeopathic Medicine & Surgery). She has dedicated her practice 
                  to treating skin conditions through the gentle yet powerful science of homeopathy.
                </p>
                <p>
                  With a deep understanding of constitutional treatment and miasmatic theory, 
                  Dr. Yumna takes a holistic approach to skin care — addressing the root cause 
                  rather than just suppressing symptoms. Her treatment plans combine carefully 
                  selected homeopathic remedies with dietary guidance and lifestyle modifications.
                </p>
                <p>
                  SkinHeal was founded by Dr. Yumna to make homeopathic skin care knowledge 
                  accessible to everyone. Through this platform, she shares step-by-step treatment 
                  guides and an AI-powered consultant to help patients understand their conditions 
                  and explore natural treatment options.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 card-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">Qualifications</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• DHMS (Diploma in Homeopathic Medicine & Surgery)</li>
                  <li>• Specialized in Homeopathic Dermatology</li>
                  <li>• Constitutional & Miasmatic Treatment Expert</li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 card-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">Specializations</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Acne & Hormonal Skin Issues</li>
                  <li>• Eczema & Dermatitis</li>
                  <li>• Psoriasis Management</li>
                  <li>• Fungal Infections</li>
                  <li>• Chronic Skin Conditions</li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 card-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">Approach</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Holistic treatment focusing on root cause analysis, individualized remedy 
                  selection, and long-term healing without side effects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
            Have a Skin Concern?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Chat with our AI Consultant powered by Dr. Yumna's expertise for personalized guidance.
          </p>
          <Link href="/chat">
            <Button size="lg">Talk to AI Consultant</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
