import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: text("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: varchar("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  patientName: text("patientName").notNull(),
  phone: text("phone"),
  appointmentDate: text("appointmentDate").notNull(),
  appointmentTime: text("appointmentTime").notNull(),
  notes: text("notes"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  appointmentDate: text("appointment_date"),
  appointmentTime: text("appointment_time"),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const signups = pgTable("signups", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id"),
  userName: text("user_name"),
  userEmail: text("user_email").notNull(),
  loginMethod: text("login_method").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  status: text("status").default("success").notNull(),
  signedUpAt: timestamp("signed_up_at").defaultNow().notNull(),
});

export const signins = pgTable("signins", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id"),
  userName: text("user_name"),
  userEmail: text("user_email").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  status: text("status").default("success").notNull(),
  signedInAt: timestamp("signed_in_at").defaultNow().notNull(),
});

export const googleLogins = pgTable("google_logins", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id"),
  userName: text("user_name"),
  userEmail: text("user_email").notNull(),
  userImage: text("user_image"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  status: text("status").default("success").notNull(),
  loggedInAt: timestamp("logged_in_at").defaultNow().notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").default("New Chat Session"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionId: varchar("sessionId").notNull().references(() => chatSessions.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // "user" or "assistant"
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const messageFeedback = pgTable("message_feedback", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  messageId: varchar("messageId").notNull().references(() => chatMessages.id, { onDelete: "cascade" }),
  userId: varchar("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: text("rating").notNull(), // "up" or "down"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
