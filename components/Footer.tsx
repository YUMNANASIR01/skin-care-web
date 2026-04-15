"use client";

import { Leaf } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="text-muted-foreground border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-heading text-lg font-bold text-foreground">SkinHeal</span>
          </div>
          <div className="flex gap-8">
            <Link href="/" className="text-base font-semibold text-foreground/70 hover:text-foreground transition-colors">Home</Link>
            <Link href="/conditions" className="text-base font-semibold text-foreground/70 hover:text-foreground transition-colors">Conditions</Link>
            <Link href="/chat" className="text-base font-semibold text-foreground/70 hover:text-foreground transition-colors">AI Consultant</Link>
          </div>
          <p className="text-sm font-medium text-foreground/60">
            © 2026 SkinHeal • Glow naturally.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
