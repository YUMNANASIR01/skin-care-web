import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET - Fetch a specific chat session with all messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract user ID - handle different session formats
    let userId = (session.user as any).id;
    
    // Fallback: If ID is missing from session, try to look it up by email
    if (!userId && session.user?.email) {
      const users = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
      if (users && users.length > 0) {
        userId = users[0].id;
      }
    }

    if (!userId) {
      userId = session.user?.email || 'unknown';
    }
    
    userId = String(userId);
    const { id } = await params;

    // Verify the session belongs to the user
    const chatSession = await sql`
      SELECT * FROM chat_sessions
      WHERE id = ${id} AND "userId" = ${userId}
    `;

    if (chatSession.length === 0) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    // Fetch all messages for this session
    const messages = await sql`
      SELECT id, role, content, "createdAt"
      FROM chat_messages
      WHERE "sessionId" = ${id}
      ORDER BY "createdAt" ASC
    `;

    return NextResponse.json({
      session: chatSession[0],
      messages,
    });
  } catch (error: any) {
    console.error("Error fetching chat session:", error);
    return NextResponse.json({ error: "Failed to fetch chat session" }, { status: 500 });
  }
}

// PATCH - Update chat session title
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract user ID - handle different session formats
    let userId = (session.user as any).id;
    
    // Fallback: If ID is missing from session, try to look it up by email
    if (!userId && session.user?.email) {
      const users = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
      if (users && users.length > 0) {
        userId = users[0].id;
      }
    }

    if (!userId) {
      userId = session.user?.email || 'unknown';
    }
    
    userId = String(userId);
    const { id } = await params;
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const updated = await sql`
      UPDATE chat_sessions
      SET title = ${title}, "updatedAt" = NOW()
      WHERE id = ${id} AND "userId" = ${userId}
      RETURNING id, title, "createdAt", "updatedAt"
    `;

    if (updated.length === 0) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    return NextResponse.json({ session: updated[0] });
  } catch (error: any) {
    console.error("Error updating chat session:", error);
    return NextResponse.json({ error: "Failed to update chat session" }, { status: 500 });
  }
}

// DELETE - Delete a chat session
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract user ID - handle different session formats
    let userId = (session.user as any).id;
    
    // Fallback: If ID is missing from session, try to look it up by email
    if (!userId && session.user?.email) {
      const users = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
      if (users && users.length > 0) {
        userId = users[0].id;
      }
    }

    if (!userId) {
      userId = session.user?.email || 'unknown';
    }
    
    userId = String(userId);
    const { id } = await params;

    const deleted = await sql`
      DELETE FROM chat_sessions
      WHERE id = ${id} AND "userId" = ${userId}
      RETURNING id
    `;

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting chat session:", error);
    return NextResponse.json({ error: "Failed to delete chat session" }, { status: 500 });
  }
}
