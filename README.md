# 🏥 SkinHeal - AI Skin Care Consultant

SkinHeal is a modern, professional web application designed to provide homeopathic skin care guidance. Powered by the expertise of **Dr. Yumna Nasir**, the platform features a state-of-the-art AI Consultant that assists users with common skin conditions through personalized advice and treatment recommendations.

---

## 🚀 Key Features

### 🤖 AI Skin Consultant
*   **Streaming Responses:** Real-time AI interactions using OpenRouter for low-latency, empathetic guidance.
*   **Homeopathic Expertise:** Specialized knowledge in treating Acne, Eczema, Psoriasis, Vitiligo, and more.
*   **Visual Analysis:** Support for skin photo uploads to provide context-aware consultation.
*   **Voice Integration:** Built-in Text-to-Speech (TTS) to listen to AI recommendations.
*   **Session Management:** Persistent chat history with the ability to create, rename, and delete sessions.

### 📅 Appointment System
*   **Seamless Booking:** Integrated appointment scheduling for professional consultations.
*   **Patient Dashboard:** View and manage upcoming appointments and status updates.

### 🔐 Secure Authentication
*   **Dual-Provider Auth:** Support for both Google OAuth and traditional Email/Password credentials via NextAuth.js.
*   **Secure Storage:** Password hashing with Bcrypt and JWT session management.

### 🎨 Modern UI/UX
*   **Responsive Design:** Fully optimized for mobile, tablet, and desktop.
*   **Accessibility:** Built with Radix UI primitives for high accessibility standards.
*   **Dark Mode Support:** Seamless theme switching for user comfort.

---

## 🛠️ Tech Stack

*   **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
*   **Database:** [Neon (Serverless PostgreSQL)](https://neon.tech/)
*   **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
*   **AI Engine:** [OpenRouter API](https://openrouter.ai/)
*   **Authentication:** [NextAuth.js v4](https://next-auth.js.org/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@hostname/dbname?sslmode=require

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional for Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Configuration (OpenRouter)
OPENROUTER_API_KEY=your_openrouter_api_key
```

---

## 🏁 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/skin-care.git
cd skin-care
npm install
```

### 2. Database Migration
Initialize your database tables by running the migration scripts:
```bash
# Run core schema migration
npm run migrate-db

# Run AI chat feature migration
npm run migrate-chat-features
```

### 3. Start Development
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

*   `app/` - Next.js App Router routes and API endpoints.
*   `components/` - Reusable UI components (Shadcn UI, Chat, Appointments).
*   `lib/` - Database configurations, schema definitions, and utility functions.
*   `hooks/` - Custom React hooks for mobile detection and state management.
*   `public/` - Static assets and skin condition reference images.

---

## 📝 License

This project is private and intended for the internal use of SkinHeal.

---

**Disclaimer:** *The AI Consultant provides educational information and homeopathic suggestions. It is not a substitute for professional medical advice, diagnosis, or treatment.*
