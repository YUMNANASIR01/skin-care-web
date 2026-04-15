import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// POST - Submit feedback for a message
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = String((session.user as any).id || session.user.email || 'unknown');
    const { messageId, rating } = await req.json();

    if (!messageId || !rating || !["up", "down"].includes(rating)) {
      return NextResponse.json(
        { error: "messageId and rating (up/down) are required" },
        { status: 400 }
      );
    }

    // Check if feedback already exists
    const existing = await sql`
      SELECT id FROM message_feedback
      WHERE "messageId" = ${messageId} AND "userId" = ${userId}
    `;

    if (existing.length > 0) {
      // Update existing feedback
      const updated = await sql`
        UPDATE message_feedback
        SET rating = ${rating}
        WHERE "messageId" = ${messageId} AND "userId" = ${userId}
        RETURNING id, rating
      `;
      return NextResponse.json({ feedback: updated[0] });
    }

    // Create new feedback
    const newFeedback = await sql`
      INSERT INTO message_feedback ("messageId", "userId", rating)
      VALUES (${messageId}, ${userId}, ${rating})
      RETURNING id, rating
    `;

    return NextResponse.json({ feedback: newFeedback[0] });
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
