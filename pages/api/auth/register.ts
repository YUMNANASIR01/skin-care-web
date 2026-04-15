import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().min(1, "Name is required"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = registerSchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ error: body.error.issues[0].message });
    }

    const { email, password, displayName } = body.data;

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in users table
    const userId = crypto.randomUUID();
    await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${userId}, ${displayName}, ${email}, ${hashedPassword})
    `;

    // Log signup to signups table
    try {
      await sql`
        INSERT INTO signups (user_id, user_email, user_name, login_method, ip_address, user_agent, status)
        VALUES (${userId}, ${email}, ${displayName}, 'credentials', ${String(req.headers['x-forwarded-for'] || '').split(',')[0]?.trim() || null}, ${req.headers['user-agent'] || null}, 'success')
      `;
      console.log(`[REGISTER] Signup logged for: ${email}`);
    } catch (logErr) {
      console.error("[REGISTER] Failed to log signup:", logErr);
      // Don't fail registration if logging fails
    }

    return res.status(200).json({ 
      success: true, 
      message: "Account created successfully",
      user: { id: userId, email, name: displayName }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Failed to create account" });
  }
}
