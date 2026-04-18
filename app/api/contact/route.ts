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

    // 2. Send email notification via EmailJS REST API (Server-side)
    try {
      const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const privateKey = process.env.EMAILJS_PRIVATE_KEY;

      if (serviceId && templateId && publicKey && privateKey) {
        let dateStr = "Not specified";
        if (appointmentDate) {
          const dateObj = new Date(appointmentDate);
          dateStr = dateObj.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }

        const emailPayload = {
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          accessToken: privateKey,
          template_params: {
            name: name.trim(),
            email: email.trim(),
            phone: phone?.trim() || "Not provided",
            message: message.trim(),
            appointment_date: dateStr,
            appointment_time: appointmentTime || "Not specified",
            to_email: "yumna8178@gmail.com",
            to_name: "Dr. Yumna Nasir",
            from_name: "Skin Care Contact System",
          },
        };

        const emailResponse = await fetch(
          "https://api.emailjs.com/api/v1.0/email/send",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailPayload),
          }
        );

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error("❌ EmailJS API error:", errorText);
        } else {
          console.log("✅ Admin notification email sent successfully");
        }
      } else {
        console.warn("⚠️ EmailJS configuration missing for server-side sending");
      }
    } catch (emailErr) {
      console.error("❌ Email process failed (non-blocking):", emailErr);
    }

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
