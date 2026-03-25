"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import type { ChatMessage } from "@/types/analysis";

const QUICK_CHIPS = [
  "Explain this simply",
  "Is this safe to proceed?",
  "What should I negotiate?",
  "What are my obligations?",
];

interface ChatAreaProps {
  documentText: string;
}

export default function ChatArea({ documentText }: ChatAreaProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          documentText,
          history: messages,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...updated,
        { role: "assistant", content: "Sorry, I couldn't get a response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">

      {/* Message thread — only shown once chat starts */}
      {messages.length > 0 && (
        <div className="flex flex-col gap-3 max-h-[240px] overflow-y-auto pb-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={[
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  "font-ui text-[15px] leading-[1.6]",
                  msg.role === "user"
                    ? "bg-accent text-white rounded-br-sm"
                    : "bg-surface border border-border text-secondary rounded-bl-sm",
                ].join(" ")}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Quick chips — shown before first message */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="font-ui text-[14px] text-secondary border border-border rounded-[10px] px-3 py-2 hover:text-primary hover:border-secondary bg-surface transition-colors duration-150"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3 focus-within:border-secondary transition-colors duration-150">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
          placeholder="Ask anything about this document..."
          className="flex-1 bg-transparent font-ui text-[15px] text-primary placeholder:text-muted outline-none leading-[1.21]"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className={[
            "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150",
            input.trim() && !loading
              ? "bg-accent text-white hover:bg-accent-dark"
              : "bg-surface-elevated text-muted cursor-not-allowed",
          ].join(" ")}
        >
          <Send className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

    </div>
  );
}
