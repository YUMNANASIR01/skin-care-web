import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import { sql } from "@/lib/db";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Fetch all appointments for the given date
    const appointments = await sql`
      SELECT "appointmentTime", "patientName", phone
      FROM appointments
      WHERE "appointmentDate" = ${date}
      ORDER BY "appointmentTime"
    `;

    const bookedSlots = appointments.map((a: any) => a.appointmentTime);

    return NextResponse.json({ bookedSlots, count: bookedSlots.length });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ bookedSlots: [], count: 0 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Check if DB is configured
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is missing");
      return NextResponse.json({ error: "Database configuration missing on server" }, { status: 500 });
    }

    const session = await getServerSession(authConfig);

    if (!session?.user) {
      console.warn("❌ Booking attempt without session");
      return NextResponse.json(
        { error: "Session not found. Please sign out and sign in again to refresh your session." },
        { status: 401 }
      );
    }

    // Extract user ID - handle different session formats
    let userId = (session.user as any).id;
    
    // Fallback: If ID is missing from session, try to look it up by email
    if (!userId && session.user?.email) {
      console.log("🔍 Session ID missing, looking up user by email:", session.user.email);
      try {
        const users = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
        if (users && users.length > 0) {
          userId = users[0].id;
          console.log("✅ Found user ID from database:", userId);
        } else {
          // If user not in database, we can't insert appointment due to foreign key
          console.error("❌ User not found in database for email:", session.user.email);
          return NextResponse.json(
            { error: "User profile not found in database. Please sign out and sign in again." },
            { status: 400 }
          );
        }
      } catch (dbLookupErr) {
        console.error("❌ Database lookup failed:", dbLookupErr);
        return NextResponse.json({ error: "Failed to verify user profile" }, { status: 500 });
      }
    }

    // Last resort fallback - if still no UUID-like ID, this will likely fail DB constraint
    if (!userId) {
      return NextResponse.json({ error: "User identity could not be verified" }, { status: 400 });
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { date, time, notes, patientName, phone } = body;

    if (!date || !time || !patientName || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: date, time, name, and phone are required" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    console.log("📝 Inserting appointment into database...");
    try {
      await sql`
        INSERT INTO appointments (id, "userId", "patientName", phone, "appointmentDate", "appointmentTime", notes)
        VALUES (${id}, ${userId}, ${patientName}, ${phone}, ${date}, ${time}, ${notes || null})
      `;
      console.log("✅ Appointment saved to database:", id);
    } catch (dbError: any) {
      console.error("❌ Database insertion failed:", dbError);
      return NextResponse.json(
        { error: "Database error: " + (dbError.message || "Failed to save appointment") },
        { status: 500 }
      );
    }

    // Send email notifications via EmailJS server API
    try {
      const dateObj = new Date(date);
      const dateStr = dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      console.log("📧 Attempting to send emails...");
      
      const hasPublicKey = !!process.env.EMAILJS_PUBLIC_KEY;
      const hasPrivateKey = !!process.env.EMAILJS_PRIVATE_KEY;
      const hasServiceId = !!process.env.EMAILJS_SERVICE_ID;
      const hasTemplateId = !!process.env.EMAILJS_TEMPLATE_ID;

      if (!hasPublicKey || !hasPrivateKey || !hasServiceId || !hasTemplateId) {
        console.warn("⚠️ EmailJS configuration missing:", {
          hasPublicKey, hasPrivateKey, hasServiceId, hasTemplateId
        });
      } else {

      // 1. Send notification email to admin
      const adminEmailPayload = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY, // Correct way for EmailJS server API
        template_params: {
          name: patientName,
          email: session.user.email || "",
          phone: phone,
          appointment_date: dateStr,
          appointment_time: time,
          message: notes || "No additional notes",
          to_email: "yumna8178@gmail.com",
          to_name: "Dr. Yumna Nasir",
          from_name: "Skin Care Appointment System",
        },
      };

      console.log("📧 Sending admin notification...");
      const adminResponse = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adminEmailPayload),
        }
      );

      if (!adminResponse.ok) {
        const errorText = await adminResponse.text();
        console.error("❌ EmailJS admin API error:", errorText);
      } else {
        console.log("✅ Admin notification email sent successfully");
      }

      // 2. Send confirmation email to patient
      if (session.user.email) {
        const patientEmailPayload = {
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,
          accessToken: process.env.EMAILJS_PRIVATE_KEY, // Correct way for EmailJS server API
          template_params: {
            name: patientName,
            email: session.user.email,
            phone: phone,
            appointment_date: dateStr,
            appointment_time: time,
            message: notes || "No additional notes",
            to_email: session.user.email,
            to_name: patientName,
            from_name: "Dr. Yumna Nasir - Skin Care Clinic",
          },
        };

        console.log("📧 Sending patient confirmation...");
        const patientResponse = await fetch(
          "https://api.emailjs.com/api/v1.0/email/send",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patientEmailPayload),
          }
        );

        if (!patientResponse.ok) {
          const errorText = await patientResponse.text();
          console.error("❌ EmailJS patient API error:", errorText);
        } else {
          console.log("✅ Patient confirmation email sent successfully");
        }
      }
      }
    } catch (emailErr) {
      console.error("❌ Email process failed (non-blocking):", emailErr);
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Appointment booking error details:", error);
    return NextResponse.json(
      { error: "Failed to book appointment: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}

