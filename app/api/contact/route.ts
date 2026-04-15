import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, appointmentDate, appointmentTime } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Insert into Neon database
    const result = await sql`
      INSERT INTO contact_submissions (name, email, phone, message, appointment_date, appointment_time)
      VALUES (${name.trim()}, ${email.trim()}, ${phone?.trim() || null}, ${message.trim()}, ${appointmentDate || null}, ${appointmentTime || null})
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      id: result[0]?.id,
    });
  } catch (error: any) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save message" },
      { status: 500 }
    );
  }
}
