import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export function useGoogleTokenExpiry() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user && (session.user as any).googleTokenExpired) {
      // Google token has expired after 2 days
      const loginDate = (session.user as any).googleLoginDate;
      const daysSinceLogin = loginDate 
        ? Math.floor((Date.now() - loginDate) / (1000 * 60 * 60 * 24))
        : 0;

      toast.warning(
        `Your Google session expired after ${daysSinceLogin} days. Please sign in with Google again to continue.`,
        {
          duration: 10000,
          action: {
            label: "Sign In",
            onClick: () => signIn("google"),
          },
        }
      );
    }
  }, [session]);
}
