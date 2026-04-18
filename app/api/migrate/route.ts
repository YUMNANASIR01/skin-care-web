import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is missing" }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // SQL Schema definition
    const schema = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  "emailVerified" TIMESTAMP,
  image TEXT,
  password TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(255) PRIMARY KEY,
  "userId" VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "patientName" TEXT NOT NULL,
  phone TEXT,
  "appointmentDate" TEXT NOT NULL,
  "appointmentTime" TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id VARCHAR(255) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  appointment_date TEXT,
  appointment_time TEXT,
  status TEXT DEFAULT 'new' NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create signups table
CREATE TABLE IF NOT EXISTS signups (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  user_email TEXT NOT NULL,
  user_name TEXT,
  login_method TEXT NOT NULL,
  status TEXT DEFAULT 'success' NOT NULL,
  "signedUpAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id VARCHAR(255) PRIMARY KEY,
  "userId" VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Chat Session',
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id VARCHAR(255) PRIMARY KEY,
  "sessionId" VARCHAR(255) NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);
`;

    // Split and execute statements
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const results = [];
    for (const statement of statements) {
      try {
        await sql`${sql.unsafe(statement)}`;
        results.push({ statement: statement.substring(0, 50) + "...", status: "success" });
      } catch (err: any) {
        results.push({ statement: statement.substring(0, 50) + "...", status: "failed", error: err.message });
      }
    }

    return NextResponse.json({ 
      message: "Migration completed", 
      results 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
