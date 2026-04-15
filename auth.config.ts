import type { AuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

function getIP(req?: Request) {
  if (!req) return null;
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null
  );
}

async function logSignUp(
  email: string,
  name: string | null,
  method: string,
  userId?: string,
  req?: Request
) {
  try {
    await sql`
      INSERT INTO signups (user_id, user_email, user_name, login_method, ip_address, user_agent, status)
      VALUES (${userId || null}, ${email}, ${name || null}, ${method}, ${getIP(req)}, ${req?.headers.get("user-agent") || null}, 'success')
    `;
  } catch (err) {
    console.error("Failed to log signup:", err);
  }
}

async function logSignIn(
  email: string,
  name: string | null,
  status: string,
  userId?: string,
  req?: Request
) {
  try {
    await sql`
      INSERT INTO signins (user_id, user_email, user_name, ip_address, user_agent, status)
      VALUES (${userId || null}, ${email}, ${name || null}, ${getIP(req)}, ${req?.headers.get("user-agent") || null}, ${status})
    `;
  } catch (err) {
    console.error("Failed to log signin:", err);
  }
}

async function logGoogleLogin(
  email: string,
  name: string | null,
  image: string | null,
  userId?: string,
  req?: Request
) {
  try {
    await sql`
      INSERT INTO google_logins (user_id, user_email, user_name, user_image, ip_address, user_agent, status)
      VALUES (${userId || null}, ${email}, ${name || null}, ${image || null}, ${getIP(req)}, ${req?.headers.get("user-agent") || null}, 'success')
    `;
  } catch (err) {
    console.error("Failed to log google login:", err);
  }
}

export const authConfig: AuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        displayName: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        try {
          // Zod validation for sign in
          const signInSchema = z.object({
            email: z.string().email("Invalid email address").min(1, "Email is required"),
            password: z.string().min(1, "Password is required"),
          });

          const parsed = signInSchema.safeParse(credentials);
          if (!parsed.success) {
            throw new Error(parsed.error.issues[0].message);
          }

          const { email, password } = parsed.data;

          const users = await sql`
            SELECT id, name, email, password FROM users WHERE email = ${email}
          `;

          if (!users || users.length === 0) {
            console.log(`[AUTH] Account not found for email: ${email}`);
            throw new Error("Account not found. Please create an account first.");
          }

          const user = users[0];
          console.log(`[AUTH] Found user: ${user.email}, hasPassword: ${!!user.password}`);

          if (!user.password || typeof user.password !== "string") {
            console.log(`[AUTH] User ${email} has no password - Google user`);
            throw new Error("No password set. Sign in with Google instead.");
          }

          const isValid = await bcrypt.compare(password, user.password as string);
          console.log(`[AUTH] Password validation: ${isValid ? 'VALID' : 'INVALID'}`);
          if (!isValid) {
            throw new Error("Incorrect password. Please try again.");
          }

          const userId = typeof user.id === 'string' ? user.id : user.id?.value || String(user.id);
          console.log(`[AUTH] Sign-in SUCCESS for ${email}, userId: ${userId}`);

          return {
            id: userId,
            name: user.name,
            email: user.email,
            image: user.image || null,
          };
        } catch (error: any) {
          console.error(`[AUTH] ERROR in authorize:`, error.message);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        console.log(`[JWT CALLBACK] User received: ${user.email}, id: ${user.id}`);
        // Handle both Drizzle objects and plain strings
        if (user.id) {
          if (typeof user.id === 'string') {
            token.id = user.id;
          } else if (user.id.value) {
            token.id = user.id.value;
          } else {
            token.id = String(user.id);
          }
        }
        console.log(`[JWT CALLBACK] Token id set to: ${token.id}`);
      }

      // Handle Google OAuth tokens
      if (account?.provider === "google") {
        // Save Google tokens and expiry time (2 days from now)
        token.googleAccessToken = account.access_token;
        token.googleRefreshToken = account.refresh_token;
        token.googleExpiresAt = Date.now() + 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
        token.googleLoginDate = Date.now();
      }

      // Check if Google token has expired (2 days)
      if (token.googleExpiresAt && Date.now() > token.googleExpiresAt) {
        console.log("Google token expired, user needs to re-authenticate");
        // Clear expired tokens but keep refresh token
        token.googleAccessToken = null;
        token.googleRefreshTokenExpired = true;
        token.needsReauth = true;
      }

      return token;
    },
    async session({ session, token }: any) {
      console.log(`[SESSION CALLBACK] Token: ${JSON.stringify({ id: token.id, email: token.email })}`);
      (session.user as any).id = token.id as string;
      (session.user as any).googleTokenExpired = token.needsReauth || false;
      (session.user as any).googleLoginDate = token.googleLoginDate;
      console.log(`[SESSION CALLBACK] Session created for user: ${(session.user as any).id}`);
      return session;
    },
    async signIn({ user, account, req }: any) {
      try {
        // Handle Google sign-in
        if (account?.provider === "google") {
          const existingUsers = await sql`
            SELECT id FROM users WHERE email = ${user.email}
          `;

          if (!existingUsers || existingUsers.length === 0) {
            // Generate a proper UUID for the new user
            const newUserId = crypto.randomUUID();
            await sql`
              INSERT INTO users (id, name, email, image)
              VALUES (${newUserId}, ${user.name}, ${user.email}, ${user.image})
            `;
            await logSignUp(user.email, user.name, "google", newUserId, req);
            await logGoogleLogin(user.email, user.name, user.image, newUserId, req);
            // Ensure user.id is a plain string
            user.id = newUserId;
          } else {
            // Extract plain string from Drizzle object
            const existingUserId = existingUsers[0].id.value || String(existingUsers[0].id);
            await logGoogleLogin(user.email, user.name, user.image, existingUserId, req);
            user.id = existingUserId;
          }
        } else if (account?.provider === "credentials") {
          // Log credentials sign-in to signins table
          const userId = user.id || user.id?.value;
          console.log(`[SIGNIN CALLBACK] Logging credentials sign-in for: ${user.email}, userId: ${userId}`);
          try {
            await logSignIn(user.email, user.name, "success", userId);
          } catch (logError) {
            console.error("[SIGNIN CALLBACK] Failed to log sign-in:", logError);
            // Don't fail sign-in if logging fails
          }
        }
        
        console.log(`[SIGNIN CALLBACK] Returning true for ${account?.provider}`);
        return true;
      } catch (error) {
        console.error("[SIGNIN CALLBACK] Error in signIn callback:", error);
        // Return true anyway to allow sign-in even if logging fails
        return true;
      }
    },
  },
};
