"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Bot,
  User,
  X,
  Home,
  Sparkles,
  Volume2,
  VolumeX,
  Menu,
  Plus,
  Download,
  Settings,
  ThumbsUp,
  ThumbsDown,
  ImagePlus,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import ChatSidebar from "@/components/Chat/ChatSidebar";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
  id?: string;
  timestamp?: Date;
  feedback?: "up" | "down" | null;
};

const suggestedQuestions = [
  "What homeopathic remedy is best for acne?",
  "How to treat eczema naturally?",
  "What causes psoriasis flare-ups?",
  "Best diet for healthy skin?",
];

const ChatPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ALL HOOKS MUST BE AT THE TOP - React Rules of Hooks
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your AI Skin Care Consultant, powered by Dr. Yumna Nasir's expertise. I can help you with homeopathic treatments for skin conditions like acne, eczema, psoriasis, and fungal infections.

How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice output state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Settings state
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [responseLength, setResponseLength] = useState<"short" | "medium" | "long">("short");
  const [showTimestamps, setShowTimestamps] = useState(true);

  // Image upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Response timing
  const [responseStartTime, setResponseStartTime] = useState<Date | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth?callbackUrl=/chat");
    }
  }, [status, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  const speakMessage = (text: string) => {
    if (!text || !("speechSynthesis" in window)) {
      toast.error("Text-to-speech not supported.");
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[#*_~`>\-\[\]()!]/g, "").replace(/\n+/g, ". ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    const preferredVoice =
      availableVoices.find((v: any) => v.lang.startsWith("en") && v.name.includes("Female")) ||
      availableVoices.find((v: any) => v.lang.startsWith("en-US")) ||
      availableVoices[0];
      
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("SpeechSynthesis error", event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      toast.success("Image uploaded successfully");
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() && !uploadedImage) return;
    if (isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);
    setResponseStartTime(new Date());
    setResponseTime(null);

    let assistantSoFar = "";

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, sessionId, responseLength }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      setMessages((prev) => [...prev, { role: "assistant", content: "", timestamp: new Date() }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);

            // Handle session ID from first message
            if (parsed.sessionId && !sessionId) {
              setSessionId(parsed.sessionId);
              continue;
            }

            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) =>
                prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m))
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) =>
                prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m))
              );
            }
          } catch {
            /* ignore */
          }
        }
      }

      // Calculate response time
      if (responseStartTime) {
        const endTime = new Date();
        const timeDiff = (endTime.getTime() - responseStartTime.getTime()) / 1000;
        setResponseTime(timeDiff);
      }

      // Save assistant message to database
      if (assistantSoFar.trim() && sessionId) {
        await fetch("/api/chat-messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, content: assistantSoFar }),
        });
      }

      // Auto-speak assistant response
      if (assistantSoFar.trim() && autoSpeak) {
        speakMessage(assistantSoFar);
      }
    } catch (e: any) {
      console.error("Chat error:", e);
      toast.error(e.message || "Failed to get response");
      setMessages((prev) => {
        if (prev[prev.length - 1]?.role === "assistant" && prev[prev.length - 1]?.content === "") {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
      setResponseStartTime(null);
    }
  };

  const handleFeedback = async (messageIndex: number, rating: "up" | "down") => {
    const message = messages[messageIndex];
    if (!message?.id) {
      // For demo, just show toast (in production, message would have ID from DB)
      toast.success(rating === "up" ? "Thanks for the positive feedback!" : "Thanks for your feedback!");
      setMessages((prev) =>
        prev.map((m, i) => (i === messageIndex ? { ...m, feedback: rating } : m))
      );
      return;
    }

    try {
      await fetch("/api/chat-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: message.id, rating }),
      });
      toast.success(rating === "up" ? "Thanks for the positive feedback!" : "Thanks for your feedback!");
      setMessages((prev) =>
        prev.map((m, i) => (i === messageIndex ? { ...m, feedback: rating } : m))
      );
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  const handleNewSession = () => {
    setMessages([
      {
        role: "assistant",
        content: `Hello! I'm your AI Skin Care Consultant, powered by Dr. Yumna Nasir's expertise. I can help you with homeopathic treatments for skin conditions like acne, eczema, psoriasis, and fungal infections. 

How can I help you today?`,
      },
    ]);
    setSessionId(null);
    setUploadedImage(null);
    setResponseTime(null);
    toast.success("Started new chat");
  };

  const handleSelectSession = async (selectedSessionId: string | null) => {
    if (!selectedSessionId) {
      handleNewSession();
      return;
    }

    try {
      const res = await fetch(`/api/chat-sessions/${selectedSessionId}`);
      if (!res.ok) throw new Error("Failed to load session");
      const data = await res.json();

      const loadedMessages: Message[] = data.messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        id: msg.id,
        timestamp: new Date(msg.createdAt),
        feedback: null,
      }));

      setMessages(loadedMessages);
      setSessionId(selectedSessionId);
      setSidebarOpen(false);
      toast.success("Chat loaded");
    } catch (error) {
      console.error("Error loading session:", error);
      toast.error("Failed to load chat");
    }
  };

  const handleExportChat = () => {
    const chatText = messages
      .map((msg) => {
        const timestamp = showTimestamps && msg.timestamp ? `[${msg.timestamp.toLocaleString()}] ` : "";
        const sender = msg.role === "user" ? "You" : "AI Consultant";
        return `${timestamp}${sender}:\n${msg.content}\n`;
      })
      .join("\n---\n\n");

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skinheal-chat-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Chat exported");
  };

  const userInitial = session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Chat Header */}
      <div className="sticky top-0 z-20 bg-card border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-semibold text-foreground">AI Skin Consultant</h2>
              <p className="text-xs text-muted-foreground">Powered by Dr. Yumna's expertise</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="hidden sm:inline-flex"
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* Export */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExportChat}
              className="hidden sm:inline-flex"
            >
              <Download className="h-5 w-5" />
            </Button>

            {/* New Chat */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewSession}
              className="gap-2 hidden sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session?.user?.image || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session?.user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportChat}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <ChatSidebar
          currentSessionId={sessionId}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div 
            className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div className="max-w-[80%] flex flex-col gap-1">
                  <div
                    className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card card-shadow text-card-foreground"
                    }`}
                  >
                    {showTimestamps && msg.timestamp && (
                      <div className="flex items-center gap-1 text-xs opacity-60 mb-2">
                        <Clock className="h-3 w-3" />
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>

                  {/* Assistant message actions */}
                  {msg.role === "assistant" && msg.content && !isLoading && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => (isSpeaking ? stopSpeaking() : speakMessage(msg.content))}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
                          isSpeaking
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-accent"
                        }`}
                      >
                        {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                        {isSpeaking ? "Stop" : "Listen"}
                      </button>

                      {/* Feedback buttons */}
                      <button
                        onClick={() => handleFeedback(i, "up")}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
                          msg.feedback === "up"
                            ? "bg-green-500 text-white"
                            : "bg-secondary text-secondary-foreground hover:bg-accent"
                        }`}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleFeedback(i, "down")}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
                          msg.feedback === "down"
                            ? "bg-red-500 text-white"
                            : "bg-secondary text-secondary-foreground hover:bg-accent"
                        }`}
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-card card-shadow rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Response time indicator */}
            {responseTime && !isLoading && (
              <div className="text-center text-xs text-muted-foreground">
                Response time: {responseTime.toFixed(1)}s
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs bg-secondary text-secondary-foreground rounded-full px-3 py-1.5 hover:bg-accent transition-colors hover:scale-105 transform"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="border-t bg-card p-4">
            {uploadedImage && (
              <div className="mb-3 relative inline-block">
                <img src={uploadedImage} alt="Uploaded" className="h-20 rounded-lg object-cover" />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (uploadedImage) {
                  sendMessage(
                    `${input}\n\n[Image uploaded: Please analyze this skin condition and provide homeopathic treatment recommendations]`
                  );
                } else {
                  sendMessage(input);
                }
              }}
              className="flex items-end gap-2"
            >
              <label className="cursor-pointer mb-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  asChild
                >
                  <span>
                    <ImagePlus className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isLoading}
                    />
                  </span>
                </Button>
              </label>
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Auto-expand textarea
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim() || uploadedImage) {
                        const form = e.currentTarget.form;
                        if (form) form.requestSubmit();
                      }
                    }
                  }}
                  placeholder="Ask about skin conditions..."
                  className="w-full bg-background border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none min-h-[44px] max-h-[150px] overflow-y-auto block"
                  disabled={isLoading}
                  rows={1}
                />
              </div>
              <Button 
                type="submit" 
                size="icon" 
                className="mb-1 flex-shrink-0"
                disabled={isLoading || (!input.trim() && !uploadedImage)}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-speak">Auto-speak responses</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically read assistant responses aloud
                </p>
              </div>
              <Switch id="auto-speak" checked={autoSpeak} onCheckedChange={setAutoSpeak} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="timestamps">Show timestamps</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Display time for each message
                </p>
              </div>
              <Switch id="timestamps" checked={showTimestamps} onCheckedChange={setShowTimestamps} />
            </div>

            <div className="space-y-2">
              <Label>Response length</Label>
              <div className="flex gap-2">
                {(["short", "medium", "long"] as const).map((length) => (
                  <Button
                    key={length}
                    variant={responseLength === length ? "default" : "outline"}
                    size="sm"
                    className="flex-1 capitalize"
                    onClick={() => setResponseLength(length)}
                  >
                    {length}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatPage;
