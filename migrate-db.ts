import { neon } from "@neondatabase/serverless";
import { loadEnvConfig } from "@next/env";
import fs from "fs";
import path from "path";

// Load environment variables from .env.local
const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  Warning: DATABASE_URL environment variable is not set.");
    console.warn("Skipping migration. If this is a production environment, please set the DATABASE_URL.");
    return;
  }

  const sql = neon(process.env.DATABASE_URL);
  console.log("🚀 Starting database migrations...");

  const schemaPath = path.join(process.cwd(), "lib", "db", "schema.sql");
  
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file not found: ${schemaPath}`);
    return;
  }

  const schema = fs.readFileSync(schemaPath, "utf-8");

  // Split SQL into individual statements
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  let completed = 0;
  for (const statement of statements) {
    try {
      // Use raw SQL execution for migration
      await sql`${sql.unsafe(statement)}`;
      completed++;
      console.log(`✅ ${statement.substring(0, 60)}...`);
    } catch (err: any) {
      console.error(`❌ Failed: ${statement.substring(0, 60)}...`);
      console.error(`   Error: ${err.message}`);
    }
  }

  console.log(`\n✨ Migration complete! ${completed}/${statements.length} statements executed.`);
}

runMigrations().catch((err) => {
  console.error("💥 Migration failed:", err);
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
});
