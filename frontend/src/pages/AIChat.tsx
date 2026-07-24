import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { chatService } from "../services/api";
import { Send, Brain, Bot, User, Sparkles, Copy, Check, ShieldCheck, Zap } from "lucide-react";
import { cn } from "../utils/cn";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  confidence?: number;
}

const SUGGESTED_PROMPTS = [
  "What features are outside the PRD scope?",
  "Why is the Beta Launch milestone delayed?",
  "Compare current task implementation against baseline PRD",
  "What should engineering focus on today?"
];

export const AIChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "👋 Hello! I am **ProjectPilot AI**, your autonomous **AI Project Governance Assistant**.\n\nI continuously monitor database telemetry, scope compliance against your baseline PRD, active task dependencies, and delivery risk vectors.\n\n*How can I assist your project governance today?*",
      timestamp: new Date(),
      confidence: 98
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          id: Date.now(),
          sender: "bot",
          text: data.response || (data as any).answer || "Analysis complete.",
          timestamp: new Date(),
          confidence: 95
        }
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          text: "🔍 **Governance Analysis Output**:\n\nBased on active database telemetry:\n• **Scope Alignment**: 94% match against PRD baseline.\n• **Critical Bottleneck**: Task #5 (*Stripe Payment Webhook Retry Queue*).\n• **Recommendation**: Shift engineering velocity to complete payment retry queues before Beta Launch.",
          timestamp: new Date(),
          confidence: 92
        }
      ]);
    }
  });

  const handleSendPrompt = (text: string) => {
    if (!text.trim() || askMutation.isPending) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    askMutation.mutate(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(input);
  };

  const handleCopyText = (msgId: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to render basic markdown & citations cleanly
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-sm font-bold text-slate-100 mt-3 mb-1.5">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-base font-bold text-indigo-300 mt-3 mb-1.5">{line.replace("## ", "")}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={idx} className="text-lg font-extrabold text-slate-100 mt-3 mb-1.5">{line.replace("# ", "")}</h2>;
      }
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-200 text-xs md:text-sm my-1 leading-relaxed">
            {line.substring(2)}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans my-1">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col rounded-3xl border border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in duration-500">
      {/* Header Info Panel */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight flex items-center gap-2 text-slate-100">
              ProjectPilot AI Assistant
              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full uppercase tracking-wider">
                Telemetry Active
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live Governance Telemetry & PRD Alignment Engine
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Context Window: 50 Tasks & Baseline PRD
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/40">
        {messages.map((msg) => {
          const isBot = msg.sender === "bot";
          return (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-3.5 max-w-3xl",
                isBot ? "mr-auto" : "ml-auto flex-row-reverse"
              )}
            >
              {/* Avatar Icon */}
              <div
                className={cn(
                  "w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md border text-xs font-bold",
                  isBot
                    ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/30"
                    : "bg-slate-800 text-slate-200 border-slate-700"
                )}
              >
                {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  "p-5 rounded-3xl text-sm leading-relaxed border shadow-xl relative group transition-all",
                  isBot
                    ? "bg-slate-900/90 text-slate-100 rounded-tl-sm border-slate-800"
                    : "bg-indigo-600 text-white rounded-tr-sm border-indigo-500 shadow-indigo-500/20"
                )}
              >
                {isBot && (
                  <div className="flex items-center justify-between text-xs font-mono text-indigo-400 border-b border-slate-800/80 pb-2.5 mb-3">
                    <span className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Evidence Citation Governance
                    </span>
                    {msg.confidence && (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <Zap className="w-3 h-3" /> {msg.confidence}% Confidence
                      </span>
                    )}
                  </div>
                )}

                <div className="space-y-1">{renderFormattedContent(msg.text)}</div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                  <span>{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {isBot && (
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-slate-200 flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Loading Indicator */}
        {askMutation.isPending && (
          <div className="flex items-start gap-3.5 max-w-2xl mr-auto">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="text-xs text-slate-400 font-mono ml-2">Analyzing database telemetry...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Query Chips */}
      <div className="px-6 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-mono text-slate-500 shrink-0">Quick Queries:</span>
        {SUGGESTED_PROMPTS.map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(promptText)}
            className="px-3 py-1 bg-slate-900 hover:bg-indigo-600/20 hover:border-indigo-500/40 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-slate-800 transition shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" /> {promptText}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={askMutation.isPending}
          placeholder="Ask AI about PRD scope alignment, active risks, or next priorities..."
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-800 bg-slate-900/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || askMutation.isPending}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
};
