import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// NextAuth v4 Pages Router handler - this is the correct format for v4
export default NextAuth(authConfig);
