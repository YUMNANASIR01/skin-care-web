import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import { sql } from "@/lib/db";

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
    const session = await getServerSession(authConfig);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be signed in to book an appointment" },
        { status: 401 }
      );
    }

    // Extract user ID - handle different session formats
    const userId = (session.user as any).id || session.user?.email || 'unknown';

    const { date, time, notes, patientName, phone } = await req.json();

    if (!date || !time) {
      return NextResponse.json(
        { error: "Date and time are required" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    await sql`
      INSERT INTO appointments (id, "userId", "patientName", phone, "appointmentDate", "appointmentTime", notes)
      VALUES (${id}, ${userId}, ${patientName}, ${phone}, ${date}, ${time}, ${notes || null})
    `;

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
      console.log("  Service ID:", process.env.EMAILJS_SERVICE_ID);
      console.log("  Template ID:", process.env.EMAILJS_TEMPLATE_ID);
      console.log("  Has Public Key:", !!process.env.EMAILJS_PUBLIC_KEY);
      console.log("  Has Private Key:", !!process.env.EMAILJS_PRIVATE_KEY);

      if (!process.env.EMAILJS_PUBLIC_KEY || !process.env.EMAILJS_PRIVATE_KEY) {
        console.warn("⚠️ EmailJS keys not found - skipping email notifications");
      } else {

      // 1. Send notification email to admin
      const adminEmailPayload = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
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

      console.log("📧 Admin payload:", JSON.stringify(adminEmailPayload, null, 2));

      const adminResponse = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.EMAILJS_PRIVATE_KEY}`,
          },
          body: JSON.stringify(adminEmailPayload),
        }
      );

      const adminResponseText = await adminResponse.text();
      console.log("📧 Admin response status:", adminResponse.status);
      console.log("📧 Admin response body:", adminResponseText);

      if (!adminResponse.ok) {
        console.error("❌ EmailJS admin API error:", adminResponseText);
      } else {
        console.log("✅ Admin notification email sent successfully");
      }

      // 2. Send confirmation email to patient
      if (session.user.email) {
        const patientEmailPayload = {
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,
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

        console.log("📧 Patient payload:", JSON.stringify(patientEmailPayload, null, 2));

        const patientResponse = await fetch(
          "https://api.emailjs.com/api/v1.0/email/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.EMAILJS_PRIVATE_KEY}`,
            },
            body: JSON.stringify(patientEmailPayload),
          }
        );

        const patientResponseText = await patientResponse.text();
        console.log("📧 Patient response status:", patientResponse.status);
        console.log("📧 Patient response body:", patientResponseText);

        if (!patientResponse.ok) {
          console.error("❌ EmailJS patient API error:", patientResponseText);
        } else {
          console.log("✅ Patient confirmation email sent successfully");
        }
      }
      } // Close the EmailJS keys check
    } catch (emailErr) {
      console.error("❌ Email send failed (non-blocking):", emailErr);
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Appointment booking error:", error);
    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}
