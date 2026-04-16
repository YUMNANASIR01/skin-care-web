import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract user ID as plain string
    const userId = String((session.user as any).id || session.user.email || 'unknown');

    console.log("Chat API - User ID:", userId);

    const { messages, sessionId, responseLength = "short" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Create a new session if one wasn't provided
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const title = messages[0]?.content?.slice(0, 50) || "New Chat Session";
      currentSessionId = crypto.randomUUID();
      // Use raw table names instead of Drizzle table objects to avoid circular references
      await sql`
        INSERT INTO chat_sessions (id, "userId", title)
        VALUES (${currentSessionId}, ${userId}, ${title})
      `;
    }

    // Save the last user message to database
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      // Use raw table names instead of Drizzle table objects
      const messageId = crypto.randomUUID();
      await sql`
        INSERT INTO chat_messages (id, "sessionId", role, content)
        VALUES (${messageId}, ${currentSessionId}, 'user', ${lastMessage.content})
      `;
    }

    // Always enforce short responses to keep context small
    const lengthInstruction = "Keep your response EXTREMELY short and concise. Provide ONLY the most essential information in 1-2 sentences. Avoid long explanations.";
    const maxTokens = 250;

    const systemPrompt = `You are Dr. Yumna Nasir's AI Skin Care Consultant at SkinHeal. You are a professional, empathetic, and knowledgeable AI assistant specializing in homeopathic treatments for skin conditions.

Your expertise includes:
- Acne, Eczema, Psoriasis, Fungal Infections, Vitiligo, Rosacea, Urticaria
- Contact Dermatitis, Scabies, Melasma, Warts, Alopecia, Lichen Planus
- Seborrheic Dermatitis and other common skin conditions

Guidelines:
1. ${lengthInstruction}
2. Provide helpful responses about homeopathic remedies, dosages, dietary tips, and lifestyle advice.
3. If a user asks for a professional consultation or has a complex condition, encourage them to contact Dr. Yumna Nasir on WhatsApp (+92 312 3359106) for a personalized assessment.
4. Mention that sharing clear photos of the affected skin area on WhatsApp is crucial for an accurate diagnosis by the doctor.
5. Always be professional and empathetic in your tone.
6. Include a disclaimer that this is educational information and not medical advice.
7. Suggest consulting with a qualified healthcare provider for serious conditions.
8. Use markdown formatting for better readability.`;

    const openrouterMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "SkinHeal AI Consultant",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: openrouterMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      console.error("OpenRouter error:", resp.status, errBody);
      return NextResponse.json(
        { error: `OpenRouter error ${resp.status}: ${errBody}` },
        { status: 500 }
      );
    }

    // Return the session ID along with the stream
    const stream = new ReadableStream({
      async start(controller) {
        const reader = resp.body!.getReader();
        
        // Send session ID as first message
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ sessionId: currentSessionId })}\n\n`));

        async function push() {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
          push();
        }
        push();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat error:", error);

    // Safely serialize the error message without circular references
    let safeError = "Failed to get response";
    try {
      if (error?.message) {
        safeError = typeof error.message === 'string' ? error.message : String(error.message);
      }
    } catch {
      safeError = "An unexpected error occurred";
    }

    return NextResponse.json(
      { error: safeError },
      { status: 500 }
    );
  }
}
