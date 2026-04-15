"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[89vh] flex items-center overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/assets/hero-bg.jpg')"}}>
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-accent/20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl ml-0 md:ml-12 lg:ml-12">
          <div className="inline-flex items-center gap-2 bg-secondary/80 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up opacity-0">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">Natural Healing Solutions</span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up opacity-0 stagger-1">
            Heal Your Skin{" "}
            <span className="text-primary">Naturally</span>{" "}
            with Homeopathy
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-lg animate-fade-in-up opacity-0 stagger-2">
            Discover step-by-step homeopathic treatments for common skin conditions.
            Get personalized guidance from our AI-powered skin consultant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0 stagger-3">
            <Link href="/conditions">
              <Button size="lg" className="gap-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-semibold">
                Explore Conditions <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="lg" className="rounded-full px-8 border-border hover:bg-primary/90 font-semibold"> 
                Talk to AI Consultant
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
