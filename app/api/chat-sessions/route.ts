import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET - Fetch all chat sessions for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = String((session.user as any).id || session.user.email || 'unknown');

    const sessions = await sql`
      SELECT id, title, "createdAt", "updatedAt"
      FROM chat_sessions
      WHERE "userId" = ${userId}
      ORDER BY "updatedAt" DESC
    `;

    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json({ error: "Failed to fetch chat sessions" }, { status: 500 });
  }
}

// POST - Create a new chat session
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = String((session.user as any).id || session.user.email || 'unknown');
    const { title } = await req.json();

    const newSession = await sql`
      INSERT INTO chat_sessions ("userId", title)
      VALUES (${userId}, ${title || "New Chat Session"})
      RETURNING id, title, "createdAt", "updatedAt"
    `;

    return NextResponse.json({ session: newSession[0] });
  } catch (error: any) {
    console.error("Error creating chat session:", error);
    return NextResponse.json({ error: "Failed to create chat session" }, { status: 500 });
  }
}
