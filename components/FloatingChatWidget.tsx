"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
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

const FloatingChatWidget = () => {
  const [isMounted, setIsMounted] = useState(false);
  const sessionHook = useSession();
  const session = sessionHook?.data || null;
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your AI Skin Care Consultant, powered by Dr. Yumna Nasir's expertise. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice output state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakMessage = (text: string) => {
    if (!text || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[#*_~`>\-\[\]()!]/g, "").replace(/\n+/g, ". ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v: any) => v.lang.startsWith("en") && v.name.includes("Female")) ||
      voices.find((v: any) => v.lang.startsWith("en-US")) ||
      voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, sessionId }),
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

      if (assistantSoFar.trim() && sessionId) {
        await fetch("/api/chat-messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, content: assistantSoFar }),
        });
      }

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
    }
  };

  const handleFeedback = (messageIndex: number, rating: "up" | "down") => {
    toast.success(rating === "up" ? "Thanks for the positive feedback!" : "Thanks for your feedback!");
    setMessages((prev) =>
      prev.map((m, i) => (i === messageIndex ? { ...m, feedback: rating } : m))
    );
  };

  const handleNewSession = () => {
    setMessages([
      {
        role: "assistant",
        content: `Hello! I'm your AI Skin Care Consultant. How can I help you today?`,
      },
    ]);
    setSessionId(null);
    toast.success("Started new chat");
  };

  const userInitial = session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "U";

  // Don't render during SSR or before mount
  if (!isMounted || !session?.user) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className={`fixed z-50 bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
      >
        <Sparkles className="h-6 w-6" />
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed z-50 bottom-6 right-6 w-[380px] h-[600px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
          isOpen && !isMinimized
            ? "scale-100 opacity-100 translate-y-0"
            : isOpen && isMinimized
            ? "scale-100 opacity-100 h-14"
            : "scale-0 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground rounded-t-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Skin Consultant</h3>
              <p className="text-xs opacity-80">Powered by Dr. Yumna's expertise</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-7 h-7 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        {!isMinimized && (
          <>
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className="max-w-[75%] flex flex-col gap-1">
                    <div
                      className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {msg.timestamp && (
                        <div className="flex items-center gap-1 text-[10px] opacity-60 mb-1">
                          <Clock className="h-2 w-2" />
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                      {msg.role === "assistant" ? (
                        <div className="prose prose-xs max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>

                    {msg.role === "assistant" && msg.content && !isLoading && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => (isSpeaking ? stopSpeaking() : speakMessage(msg.content))}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground hover:bg-accent"
                        >
                          {isSpeaking ? <VolumeX className="h-2 w-2" /> : <Volume2 className="h-2 w-2" />}
                          {isSpeaking ? "Stop" : "Listen"}
                        </button>

                        <button
                          onClick={() => handleFeedback(i, "up")}
                          className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-full ${
                            msg.feedback === "up"
                              ? "bg-green-500 text-white"
                              : "bg-secondary text-secondary-foreground hover:bg-accent"
                          }`}
                        >
                          <ThumbsUp className="h-2 w-2" />
                        </button>
                        <button
                          onClick={() => handleFeedback(i, "down")}
                          className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-full ${
                            msg.feedback === "down"
                              ? "bg-red-500 text-white"
                              : "bg-secondary text-secondary-foreground hover:bg-accent"
                          }`}
                        >
                          <ThumbsDown className="h-2 w-2" />
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="h-3 w-3 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-secondary rounded-xl px-3 py-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.slice(0, 2).map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-[10px] bg-secondary text-secondary-foreground rounded-full px-2 py-1 hover:bg-accent transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="border-t border-border p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about skin care..."
                  className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !input.trim()}
                  className="h-9 w-9 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FloatingChatWidget;
