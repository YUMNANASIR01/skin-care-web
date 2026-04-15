# AI Skin Consultant - Professional Features

## Overview
The AI Skin Consultant is a professional chatbot feature that provides homeopathic skin care consultation powered by Dr. Yumna Nasir's expertise. Users must sign in to access this feature.

## Features Implemented

### 🔐 1. Authentication Protection
- **Route Protection**: The `/chat` route is protected using middleware
- **Auto-Redirect**: Unauthenticated users are redirected to sign-in page
- **Callback URL**: After signing in, users are automatically redirected back to the chat
- **Lock Icon**: Visual indicator on navbar shows the feature requires sign-in

### 💬 2. Professional Chat Interface
- **Streaming Responses**: Real-time streaming of AI responses (no waiting for full response)
- **Markdown Support**: AI responses are formatted with headings, lists, bold text, etc.
- **Message Timestamps**: Each message shows when it was sent
- **Typing Indicators**: Animated dots show when AI is generating a response
- **Response Time Display**: Shows how long the AI took to respond

### 👤 3. User Profile Integration
- **Avatar Display**: User's profile picture shown in chat header
- **User Initials**: Fallback initials when no profile picture available
- **Quick Actions Menu**: Dropdown menu with user profile and quick links

### 📁 4. Chat Session Management
- **Conversation History**: All chats are saved to database per user
- **Sidebar Navigation**: Browse all previous conversations
- **Multiple Sessions**: Create unlimited chat sessions
- **Rename Chats**: Edit session titles for better organization
- **Delete Chats**: Remove old conversations
- **Auto-Save**: Messages are automatically saved to database

### 📸 5. Image Upload
- **Skin Photo Analysis**: Upload images of skin conditions for AI analysis
- **File Validation**: Checks file type and size (max 5MB)
- **Image Preview**: Preview uploaded image before sending
- **Context-Aware**: AI provides homeopathic treatment recommendations based on uploaded images

### 👍 6. Message Feedback System
- **Thumbs Up/Down**: Rate AI responses for quality tracking
- **Visual Feedback**: Selected rating is highlighted
- **Database Storage**: All feedback is saved for analytics

### ⚙️ 7. Chat Settings Panel
- **Auto-Speak Toggle**: Enable/disable automatic text-to-speech
- **Timestamp Toggle**: Show/hide message timestamps
- **Response Length**: Choose between short, medium, or long responses
- **Settings Dialog**: Professional modal interface

### 🔊 8. Text-to-Speech
- **Voice Responses**: AI responses are read aloud automatically
- **Voice Selection**: Prefers female English voices
- **Manual Control**: Stop/start speech for any message
- **Listen Button**: Each message has individual play/pause control

### 📥 9. Chat Export
- **Text Export**: Download entire conversation as `.txt` file
- **Formatted Output**: Includes timestamps and sender names
- **Date Stamped**: Files are named with current date
- **One-Click Export**: Simple export from header or user menu

### ✨ 10. Professional Animations
- **Smooth Transitions**: Messages animate in with fade and slide
- **Hover Effects**: Interactive elements have hover states
- **Loading States**: Skeleton loaders and spinners
- **Micro-interactions**: Buttons scale and change on hover

## Database Schema

### New Tables Added:

1. **chat_sessions** - Stores individual chat sessions
   - `id`: Unique identifier
   - `userId`: Reference to user
   - `title`: Session title
   - `createdAt`, `updatedAt`: Timestamps

2. **chat_messages** - Stores all messages
   - `id`: Unique identifier
   - `sessionId`: Reference to chat session
   - `role`: "user" or "assistant"
   - `content`: Message content
   - `createdAt`: Timestamp

3. **message_feedback** - Stores user ratings
   - `id`: Unique identifier
   - `messageId`: Reference to message
   - `userId`: Reference to user
   - `rating`: "up" or "down"
   - `createdAt`: Timestamp

## API Endpoints

### `/api/chat` (POST)
- **Purpose**: Send messages to AI and receive streaming response
- **Auth Required**: Yes
- **Body**: `{ messages: Message[], sessionId?: string }`
- **Returns**: Server-sent events stream

### `/api/chat-sessions` (GET, POST)
- **GET**: Fetch all chat sessions for current user
- **POST**: Create new chat session
- **Auth Required**: Yes

### `/api/chat-sessions/[id]` (GET, PATCH, DELETE)
- **GET**: Fetch specific session with all messages
- **PATCH**: Update session title
- **DELETE**: Delete session and all messages
- **Auth Required**: Yes

### `/api/chat-messages` (POST)
- **Purpose**: Save assistant messages to database
- **Auth Required**: Yes
- **Body**: `{ sessionId: string, content: string }`

### `/api/chat-feedback` (POST)
- **Purpose**: Submit feedback for AI responses
- **Auth Required**: Yes
- **Body**: `{ messageId: string, rating: "up" | "down" }`

## User Flow

1. **User clicks "AI Consultant" in navbar**
2. **If not signed in**: Redirected to `/auth` with callback URL
3. **User signs in**: Automatically redirected to `/chat`
4. **Chat opens**: Welcome message displayed
5. **User types question**: Message sent to AI
6. **AI responds**: Streaming response with typing indicator
7. **Response saved**: Auto-saved to database with session
8. **User can**: 
   - Upload skin images
   - Rate response (thumbs up/down)
   - Listen to response (text-to-speech)
   - Export entire chat
   - Start new session
   - Load previous sessions from sidebar

## Technical Stack

- **Authentication**: NextAuth.js with JWT
- **Database**: Neon (PostgreSQL) with Drizzle ORM
- **AI Provider**: OpenRouter API
- **Streaming**: Server-Sent Events (SSE)
- **Text-to-Speech**: Web Speech API
- **Markdown**: react-markdown
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Tailwind CSS animate classes

## Security Features

- ✅ Route protection via middleware
- ✅ User-specific data isolation
- ✅ Cascade deletion (sessions → messages → feedback)
- ✅ Input validation
- ✅ File upload restrictions (type, size)
- ✅ Session-based authentication

## Future Enhancements (Optional)

- PDF export with formatting
- Real-time AI typing indicator
- Conversation search
- Appointment booking from chat
- Video consultation integration
- Multi-language support
- Advanced AI models (GPT-4, Claude)
- Response templates
- Chat sharing with doctors
- Emergency triage detection

## Usage Tips

1. **Be Specific**: Ask detailed questions for better responses
2. **Upload Images**: Include clear photos of skin conditions
3. **Rate Responses**: Help improve AI quality over time
4. **Organize Chats**: Rename sessions for easy reference
5. **Export Important Chats**: Save consultations for future reference
6. **Use Settings**: Customize response length and voice preferences

## Disclaimer

The AI Skin Consultant provides educational information only and is not a substitute for professional medical advice. Users should consult with qualified healthcare providers for serious skin conditions.
