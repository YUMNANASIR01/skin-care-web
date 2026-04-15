import Link from "next/link";
import { Leaf, Menu, X, CalendarDays, LogIn, Lock, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useGoogleTokenExpiry } from "@/hooks/useGoogleTokenExpiry";

const NavbarClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === "loading";

  // Check for Google token expiry
  useGoogleTokenExpiry();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
    toast.success("Signed out");
  };

  const showAuthUI = isMounted && !isLoading;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl font-bold text-foreground">SkinHeal</span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/" className="text-base font-semibold text-foreground/70 hover:text-foreground transition-colors px-3 py-1.5">Home</Link>
          <Link href="/conditions" className="text-base font-semibold text-foreground/70 hover:text-foreground transition-colors px-3 py-1.5">Conditions</Link>
          <Link href="/about" className="text-base font-semibold text-foreground/70 hover:text-foreground transition-colors px-3 py-1.5">About</Link>
          <Link href="/appointment">
            <Button size="sm" className="rounded-full gap-2 bg-secondary hover:text-white text-secondary-foreground font-semibold border border-border">
              <CalendarDays className="h-4 w-4" /> Appointment
            </Button>
          </Link>
          <Link href="/chat">
            <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2">
              <Sparkles className="h-4 w-4" />
              AI Consultant
              {!user && <Lock className="h-3 w-3 opacity-70" />}
            </Button>
          </Link>
          {showAuthUI ? (
            user ? (
              <Button size="sm" variant="ghost" onClick={handleSignOut} className="gap-2 font-semibold text-foreground/70 hover:text-foreground">
                <LogIn className="h-4 w-4" /> Sign Out
              </Button>
            ) : (
              <Link href="/auth">
                <Button size="sm" variant="ghost" className="gap-2 font-semibold text-foreground/70 hover:text-foreground">
                  <LogIn className="h-4 w-4" /> Sign In
                </Button>
              </Link>
            )
          ) : (
            <div className="w-20 h-8 rounded-full bg-muted animate-pulse" />
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-3">
          <Link href="/" className="text-sm font-semibold text-foreground/70" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/conditions" className="text-sm font-semibold text-foreground/70" onClick={() => setIsOpen(false)}>Conditions</Link>
          <Link href="/about" className="text-sm font-semibold text-foreground/70" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/appointment" onClick={() => setIsOpen(false)}>
            <Button size="sm" variant="outline" className="w-full rounded-full gap-2 font-semibold"><CalendarDays className="h-4 w-4" /> Appointment</Button>
          </Link>
          <Link href="/chat" onClick={() => setIsOpen(false)}>
            <Button size="sm" className="w-full rounded-full font-semibold gap-2">
              <Sparkles className="h-4 w-4" />
              AI Consultant
              {!user && <Lock className="h-3 w-3 opacity-70" />}
            </Button>
          </Link>
          {showAuthUI ? (
            user ? (
              <Button size="sm" variant="ghost" className="w-full font-semibold" onClick={() => { handleSignOut(); setIsOpen(false); }}>Sign Out</Button>
            ) : (
              <Link href="/auth" onClick={() => setIsOpen(false)}>
                <Button size="sm" variant="ghost" className="w-full gap-2 font-semibold"><LogIn className="h-4 w-4" /> Sign In</Button>
              </Link>
            )
          ) : (
            <div className="w-full h-8 rounded-full bg-muted animate-pulse" />
          )}
        </div>
      )}
    </nav>
  );
};

export default NavbarClient;
