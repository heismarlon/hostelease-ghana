import { createFileRoute } from "@tanstack/react-router";
import { HOSTELS } from "@/lib/hostels";

export const Route = createFileRoute("/_app/messages")({
  head: () => ({ meta: [{ title: "Messages — HostelEase" }] }),
  component: Messages,
});

const THREADS = [
  { hostel: HOSTELS[0], last: "Yes, room 12 is still available 👍", time: "10:42", unread: 2 },
  { hostel: HOSTELS[1], last: "Sure, you can come tour tomorrow at 3pm.", time: "Yesterday", unread: 0 },
  { hostel: HOSTELS[3], last: "Deposit is GHS 1,200 non-refundable.", time: "Mon", unread: 0 },
];

function Messages() {
  return (
    <div className="space-y-4 pb-6">
      <header className="px-5 pb-2 pt-12">
        <h1 className="font-display text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground">Chat with hostel owners before you book.</p>
      </header>
      <ul className="divide-y divide-border border-y border-border bg-card">
        {THREADS.map((t) => (
          <li key={t.hostel.id} className="flex items-center gap-3 px-5 py-3">
            <img
              src={t.hostel.photos[0]}
              alt={t.hostel.name}
              loading="lazy"
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-2xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold">{t.hostel.owner.name}</p>
                <span className="shrink-0 text-[11px] text-muted-foreground">{t.time}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs text-muted-foreground">{t.last}</p>
                {t.unread > 0 && (
                  <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-gold px-1.5 text-[10px] font-bold text-gold-foreground">
                    {t.unread}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
