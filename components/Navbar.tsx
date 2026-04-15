"use client";

import dynamic from "next/dynamic";

// Dynamically import Navbar with SSR disabled to prevent useSession errors during SSG
const Navbar = dynamic(() => import("@/components/NavbarClient"), {
  ssr: false,
  loading: () => (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b h-16" />
  ),
});

export default Navbar;
