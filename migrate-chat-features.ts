import { neon } from "@neondatabase/serverless";
import { loadEnvConfig } from "@next/env";

// Load environment variables from .env.local
const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  Warning: DATABASE_URL environment variable is not set.");
    console.warn("Skipping migration. If this is a production environment, please set the DATABASE_URL.");
    return;
  }

  const sql = neon(process.env.DATABASE_URL);
  
  console.log("🚀 Running migration: AI Chat Features...");
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
    // Don't exit with 1 during build process to avoid crashing the build
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
}

// Only run if this script is executed directly
runMigration().catch((err) => {
  console.error("💥 Unexpected error during migration:", err);
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
});
