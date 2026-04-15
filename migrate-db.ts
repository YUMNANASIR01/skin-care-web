import { sql } from "@/lib/db";
import fs from "fs";
import path from "path";

async function runMigrations() {
  console.log("🚀 Starting database migrations...");

  const schemaPath = path.join(process.cwd(), "lib", "db", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");

  // Split SQL into individual statements
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  let completed = 0;
  for (const statement of statements) {
    try {
      await sql`${sql.unsafe(statement)}`;
      completed++;
      console.log(`✅ ${statement.substring(0, 60)}...`);
    } catch (err: any) {
      console.error(`❌ Failed: ${statement.substring(0, 60)}...`);
      console.error(`   Error: ${err.message}`);
    }
  }

  console.log(`\n✨ Migration complete! ${completed}/${statements.length} statements executed.`);
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error("💥 Migration failed:", err);
  process.exit(1);
});
