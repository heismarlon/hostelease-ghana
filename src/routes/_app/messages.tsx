import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Send, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/messages")({
  head: () => ({ meta: [{ title: "Messages — HostelEase" }] }),
  component: Messages,
});

const INITIAL: UIMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Hi Marlon 👋 I'm your HostelEase assistant. Ask me about hostels near UCC, payment options, our 5% service fee, or follow up on a booking — I'll read and help.",
      },
    ],
  },
];

function renderText(m: UIMessage) {
  return m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null));
}

function Messages() {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: INITIAL,
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const isLoading = status === "submitted" || status === "streaming";

  const send = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    void sendMessage({ text });
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border bg-card px-5 pb-3 pt-12">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-hero-gradient text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-bold">HostelEase Assistant</p>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-success" /> AI-powered · understands your messages
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 pb-40">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-snug shadow-sm ${
                m.role === "user"
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md bg-card text-foreground"
              }`}
            >
              {renderText(m)}
            </div>
          </div>
        ))}
        {status === "submitted" && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-card px-3.5 py-2.5 text-sm text-muted-foreground shadow-sm">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
              </span>
            </div>
          </div>
        )}
        {error && (
          <p className="text-center text-xs text-destructive">Couldn't reach the assistant. Try again.</p>
        )}
        <div ref={endRef} />
      </div>

      <div className="fixed inset-x-0 bottom-24 z-30 mx-auto max-w-md border-t border-border bg-card/95 px-3 py-3 pb-4 backdrop-blur">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Message HostelEase…"
            autoFocus
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={send}
            disabled={!input.trim() || isLoading}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
