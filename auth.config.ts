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
  userId?: string
) {
  try {
    await sql`
      INSERT INTO signups (user_id, user_email, user_name, login_method, status)
      VALUES (${userId || null}, ${email}, ${name || null}, ${method}, 'success')
    `;
  } catch (err) {
    console.error("Failed to log signup:", err);
  }
}

async function logSignIn(
  email: string,
  name: string | null,
  status: string,
  userId?: string
) {
  try {
    await sql`
      INSERT INTO signins (user_id, user_email, user_name, status)
      VALUES (${userId || null}, ${email}, ${name || null}, ${status})
    `;
  } catch (err) {
    console.error("Failed to log signin:", err);
  }
}

async function logGoogleLogin(
  email: string,
  name: string | null,
  image: string | null,
  userId?: string
) {
  try {
    await sql`
      INSERT INTO google_logins (user_id, user_email, user_name, user_image, status)
      VALUES (${userId || null}, ${email}, ${name || null}, ${image || null}, 'success')
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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Zod validation for sign in
          const signInSchema = z.object({
            email: z.string().email("Invalid email address"),
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
            throw new Error("Account not found. Please create an account first.");
          }

          const user = users[0];

          if (!user.password) {
            throw new Error("This account is linked with Google. Please sign in with Google.");
          }

          const isValid = await bcrypt.compare(password, user.password as string);
          if (!isValid) {
            throw new Error("Incorrect password. Please try again.");
          }

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
          };
        } catch (error: any) {
          console.error(`[AUTH] Authorize error:`, error.message);
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
    error: "/auth",
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
      }
      if (account?.provider === "google") {
        token.googleAccessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        try {
          const existingUsers = await sql`
            SELECT id FROM users WHERE email = ${user.email}
          `;

          let userId;
          if (!existingUsers || existingUsers.length === 0) {
            userId = crypto.randomUUID();
            await sql`
              INSERT INTO users (id, name, email, image)
              VALUES (${userId}, ${user.name}, ${user.email}, ${user.image})
            `;
            await logSignUp(user.email, user.name, "google", userId);
          } else {
            userId = String(existingUsers[0].id);
          }
          
          await logGoogleLogin(user.email, user.name, user.image, userId);
          user.id = userId;
          return true;
        } catch (error) {
          console.error("[SIGNIN CALLBACK] Google sign-in error:", error);
          return true; // Still allow sign-in
        }
      }
      return true;
    },
  },
};

