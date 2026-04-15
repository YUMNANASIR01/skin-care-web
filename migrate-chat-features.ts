import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set");
  console.error("Please make sure you're running this script with the correct environment variables loaded from .env.local");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  console.log("Running migration: AI Chat Features...");
  console.log("Database URL:", process.env.DATABASE_URL.slice(0, 20) + "...");

  try {
    // Create chat_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT DEFAULT 'New Chat Session',
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log("✓ Created chat_sessions table");

    // Create chat_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        "sessionId" VARCHAR NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log("✓ Created chat_messages table");

    // Create message_feedback table
    await sql`
      CREATE TABLE IF NOT EXISTS message_feedback (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        "messageId" VARCHAR NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
        "userId" VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log("✓ Created message_feedback table");

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions("userId")`;
    console.log("✓ Created index on chat_sessions.userId");

    await sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages("sessionId")`;
    console.log("✓ Created index on chat_messages.sessionId");

    await sql`CREATE INDEX IF NOT EXISTS idx_message_feedback_message_id ON message_feedback("messageId")`;
    console.log("✓ Created index on message_feedback.messageId");

    await sql`CREATE INDEX IF NOT EXISTS idx_message_feedback_user_id ON message_feedback("userId")`;
    console.log("✓ Created index on message_feedback.userId");

    console.log("\n✅ Migration completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Restart your development server");
    console.log("2. Sign in to your account");
    console.log("3. Navigate to /chat to use the AI Consultant");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
