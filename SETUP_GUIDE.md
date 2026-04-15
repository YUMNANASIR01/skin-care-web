# Quick Setup Guide - AI Skin Consultant

## Step 1: Run Database Migration

Open your terminal in the project directory and run:

```bash
npm run migrate-chat-features
```

This will create the necessary database tables for:
- Chat sessions
- Chat messages
- Message feedback

## Step 2: Restart Development Server

After migration completes, restart your dev server:

```bash
npm run dev
```

## Step 3: Test the Feature

1. **Navigate to** `http://localhost:3000`
2. **Click "AI Consultant"** in the navbar
3. **Sign in** if you haven't already (Google or Email/Password)
4. **Start chatting** with the AI Skin Consultant!

## Step 4: Try the Features

### Core Features:
- ✅ Send messages and receive streaming AI responses
- ✅ Upload skin photos for analysis
- ✅ Rate responses with thumbs up/down
- ✅ Listen to responses (text-to-speech)
- ✅ Export chat conversations

### Session Management:
- ✅ Create new chat sessions
- ✅ View chat history in sidebar
- ✅ Rename session titles
- ✅ Delete old conversations

### Settings:
- ✅ Toggle auto-speak responses
- ✅ Show/hide timestamps
- ✅ Adjust response length preference

## Troubleshooting

### "DATABASE_URL is not set" Error
Make sure your `.env.local` file contains the DATABASE_URL variable:
```
DATABASE_URL=postgresql://...
```

### Authentication Not Working
Make sure your `.env.local` file contains:
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENROUTER_API_KEY=your-openrouter-api-key
```

### Tables Already Exist
If you get "table already exists" errors, that's fine! The migration uses `IF NOT EXISTS` and will skip existing tables.

## Environment Variables Required

Make sure these are set in your `.env.local`:

```env
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (for Google sign-in)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# OpenRouter API (for AI responses)
OPENROUTER_API_KEY=...
```

## What's New?

### For Users:
- Professional chat interface with AI skin consultant
- Must be signed in to access chat (security feature)
- Can have multiple chat sessions
- Can upload skin photos
- Can export conversations
- Full control over voice, timestamps, and response length

### For Developers:
- New database tables: `chat_sessions`, `chat_messages`, `message_feedback`
- New API routes in `/api/chat-sessions/`, `/api/chat-messages/`, `/api/chat-feedback/`
- Middleware protection for `/chat` and `/appointment` routes
- Enhanced chat component with full feature set

## Need Help?

Check the full documentation in `AI_CHAT_FEATURES.md` for:
- Complete feature list
- API endpoint documentation
- Database schema details
- User flow diagrams
- Future enhancement ideas

---

**Enjoy your professional AI Skin Consultant! 🎉**
