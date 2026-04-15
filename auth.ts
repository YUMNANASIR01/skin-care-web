import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";

// Use getServerSession for server-side auth in NextAuth v4
export const auth = () => getServerSession(authConfig);
