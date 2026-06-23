import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/messages")({
  head: () => ({ meta: [{ title: "Messages — HostelEase" }] }),
  component: Messages,
});

type Msg = { id: string; from: "you" | "bot"; text: string; time: string };

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const SEED: Msg[] = [
  {
    id: "1",
    from: "bot",
    text: "Hi Marlon 👋 I'm your HostelEase assistant. I can help you find rooms, explain fees, or follow up on a booking. What do you need today?",
    time: "10:30",
  },
  {
    id: "2",
    from: "bot",
    text: "Tip: tap any hostel from Home to start a reservation — I'll walk you through payment.",
    time: "10:30",
  },
];

const CANNED = [
  "Thanks! A teammate will confirm shortly. In the meantime, you can browse verified hostels on the Home tab.",
  "Good question — our service fee is 5% of your semester rent + deposit, and it's shown before you pay.",
  "You can pay with Mobile Money (MTN, Telecel, AirtelTigo), a Ghanaian bank account, or a Visa/Mastercard.",
  "I've flagged this for the HostelEase team. We usually reply within a few minutes during the day.",
];

function Messages() {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const mine: Msg = { id: crypto.randomUUID(), from: "you", text, time: now() };
    setMessages((m) => [...m, mine]);
    setDraft("");
    setTimeout(() => {
      const reply: Msg = {
        id: crypto.randomUUID(),
        from: "bot",
        text: CANNED[Math.floor(Math.random() * CANNED.length)],
        time: now(),
      };
      setMessages((m) => [...m, reply]);
    }, 700);
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
            <ShieldCheck className="h-3 w-3 text-success" /> Official support · usually replies in minutes
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 pb-40">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                m.from === "you"
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md bg-card text-foreground"
              }`}
            >
              <p className="whitespace-pre-wrap leading-snug">{m.text}</p>
              <p
                className={`mt-1 text-[10px] ${
                  m.from === "you" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {m.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="fixed inset-x-0 bottom-24 z-30 mx-auto max-w-md border-t border-border bg-card/95 px-3 py-3 pb-4 backdrop-blur">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Message HostelEase…"
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={send}
            disabled={!draft.trim()}
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
