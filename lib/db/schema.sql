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

-- Create accounts table (for OAuth providers)
CREATE TABLE IF NOT EXISTS accounts (
  id VARCHAR(255) PRIMARY KEY,
  "userId" VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at TEXT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL
);

-- Create verification tokens table
CREATE TABLE IF NOT EXISTS "verificationToken" (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMP NOT NULL
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

-- Create indexes
CREATE INDEX IF NOT EXISTS accounts_userId_idx ON accounts("userId");
CREATE INDEX IF NOT EXISTS sessions_userId_idx ON sessions("userId");
CREATE INDEX IF NOT EXISTS appointments_userId_idx ON appointments("userId");

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
  user_name TEXT,
  user_email TEXT NOT NULL,
  login_method TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'success' NOT NULL,
  "signedUpAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create signins table
CREATE TABLE IF NOT EXISTS signins (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  user_name TEXT,
  user_email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'success' NOT NULL,
  "signedInAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create google_logins table
CREATE TABLE IF NOT EXISTS google_logins (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  user_name TEXT,
  user_email TEXT NOT NULL,
  user_image TEXT,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'success' NOT NULL,
  "logged_in_at" TIMESTAMP DEFAULT NOW() NOT NULL
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

-- Create message_feedback table
CREATE TABLE IF NOT EXISTS message_feedback (
  id VARCHAR(255) PRIMARY KEY,
  "messageId" VARCHAR(255) NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  "userId" VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);
