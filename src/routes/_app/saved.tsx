import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { HOSTELS } from "@/lib/hostels";
import { HostelCard } from "@/components/HostelCard";

export const Route = createFileRoute("/_app/saved")({
  head: () => ({ meta: [{ title: "Saved — HostelEase" }] }),
  component: Saved,
});

function Saved() {
  const saved = HOSTELS.slice(0, 2);
  return (
    <div className="space-y-5 pb-6">
      <header className="px-5 pb-2 pt-12">
        <h1 className="font-display text-2xl font-semibold">Saved hostels</h1>
        <p className="text-sm text-muted-foreground">Tap the heart on any hostel to keep it here.</p>
      </header>
      {saved.length === 0 ? (
        <div className="mx-5 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-accent">
            <Heart className="h-6 w-6 text-gold" />
          </div>
          <p className="font-display text-lg font-semibold">No saves yet</p>
          <p className="mt-1 text-sm text-muted-foreground">When you spot one you like, tap the heart.</p>
          <Link to="/search" className="mt-4 inline-block rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
            Browse hostels
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 px-5">
          {saved.map((h) => <HostelCard key={h.id} hostel={h} />)}
          <Link to="/compare" className="rounded-2xl border border-primary bg-primary/5 px-4 py-3 text-center text-sm font-semibold text-primary">
            Compare saved hostels →
          </Link>
        </div>
      )}
    </div>
  );
}
