import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// POST - Save assistant message to database
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = String((session.user as any).id || session.user.email || 'unknown');
    const { sessionId, content } = await req.json();

    if (!sessionId || !content) {
      return NextResponse.json(
        { error: "sessionId and content are required" },
        { status: 400 }
      );
    }

    const messageId = crypto.randomUUID();
    const saved = await sql`
      INSERT INTO chat_messages (id, "sessionId", role, content)
      VALUES (${messageId}, ${sessionId}, 'assistant', ${content})
      RETURNING id, role, content, "createdAt"
    `;

    return NextResponse.json({ message: saved[0] });
  } catch (error: any) {
    console.error("Error saving assistant message:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
