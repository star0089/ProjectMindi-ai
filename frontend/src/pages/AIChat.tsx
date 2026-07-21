import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { chatService } from "../services/api";
import { Send, Brain, Bot, User, Sparkles } from "lucide-react";
import { cn } from "../utils/cn";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export const AIChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I am ProjectPilot AI, your autonomous project manager assistant. I can help audit project scope, assess active risks, review milestones, and suggest optimizations. Ask me anything about this repository!",
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const askMutation = useMutation({
    mutationFn: (question: string) => chatService.askAssistant(1, question),
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          sender: "bot",
          text: data.response,
          timestamp: new Date()
        }
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          sender: "bot",
          text: "Sorry, I couldn't reach the AI model. Please verify that the backend API server is running locally.",
          timestamp: new Date()
        }
      ]);
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || askMutation.isPending) return;

    const userText = input;
    setInput("");

    // Append user message
    setMessages((prev) => [
      ...prev,
      {
        id: messages.length + 1,
        sender: "user",
        text: userText,
        timestamp: new Date()
      }
    ]);

    // Query backend api
    askMutation.mutate(userText);
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col rounded-2xl border bg-card text-card-foreground shadow-premium overflow-hidden animate-page-fade">
      {/* AI Bot Top header info panel */}
      <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm leading-tight flex items-center gap-1.5">
              ProjectPilot PM Agent
              <span className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 rounded-full uppercase tracking-wider">
                Online
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Analyzing scope compliance, risks, and milestone schedules
            </p>
          </div>
        </div>

        <span className="hidden sm:flex items-center gap-1.5 text-xs text-primary font-bold">
          <Sparkles className="w-4 h-4" />
          Gemini v1.5 Mock Enabled
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-secondary/5">
        {messages.map((msg) => {
          const isBot = msg.sender === "bot";
          return (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-3 max-w-2xl",
                isBot ? "mr-auto" : "ml-auto flex-row-reverse"
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border text-xs font-bold",
                isBot 
                  ? "bg-primary/10 text-primary border-primary/20" 
                  : "bg-secondary text-foreground"
              )}>
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message bubble */}
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed border shadow-sm",
                isBot 
                  ? "bg-card text-foreground rounded-tl-none border-border" 
                  : "bg-primary text-primary-foreground rounded-tr-none border-primary/20"
              )}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className={cn(
                  "text-[9px] block text-right mt-2",
                  isBot ? "text-muted-foreground" : "text-primary-foreground/75"
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing loading indicators */}
        {askMutation.isPending && (
          <div className="flex items-start gap-3 max-w-2xl mr-auto">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-card border text-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls form */}
      <form onSubmit={handleSend} className="p-4 border-t bg-card flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={askMutation.isPending}
          placeholder="Ask AI about project status, creep audits, risk statuses..."
          className="flex-1 px-4 py-2.5 rounded-xl border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background disabled:opacity-50 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || askMutation.isPending}
          className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 shadow transition-all disabled:opacity-55 flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
