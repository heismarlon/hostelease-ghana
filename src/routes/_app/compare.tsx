import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Heart, X } from "lucide-react";
import { AMENITIES, formatGHS } from "@/lib/hostels";
import { useSavedHostels } from "@/lib/use-saved";
import { useHostels } from "@/lib/use-hostels";

export const Route = createFileRoute("/_app/compare")({
  head: () => ({ meta: [{ title: "Compare hostels — HostelEase" }] }),
  component: Compare,
});

function Compare() {
  const { ids } = useSavedHostels();
  const hostels = useHostels();
  const items = hostels.filter((h) => ids.includes(h.id));

  return (
    <div className="pb-6">
      <header className="px-5 pb-3 pt-12">
        <Link to="/saved" className="text-xs font-semibold text-primary">← Back to saved</Link>
        <h1 className="mt-2 font-display text-2xl font-semibold">Compare</h1>
        <p className="text-sm text-muted-foreground">Side-by-side view of your saved hostels.</p>
      </header>
      {items.length === 0 ? (
        <div className="mx-5 mt-6 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-accent">
            <Heart className="h-6 w-6 text-gold" />
          </div>
          <p className="font-display text-lg font-semibold">Nothing to compare yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Save at least two hostels to see them side by side.</p>
          <Link to="/search" className="mt-4 inline-block rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
            Browse hostels
          </Link>
        </div>
      ) : (
      <div className="no-scrollbar overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-x-2 px-3">
          <thead>
            <tr>
              <th className="w-32" />
              {items.map((h) => (
                <th key={h.id} className="min-w-40 align-bottom">
                  <Link to="/hostel/$id" params={{ id: h.id }} className="block">
                    <img src={h.photos[0]} alt={h.name} loading="lazy" width={200} height={140} className="aspect-[4/3] w-full rounded-xl object-cover" />
                    <p className="mt-2 truncate text-left text-sm font-semibold">{h.name}</p>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            <Section label="Academic year">
              {items.map((h) => <Cell key={h.id}><span className="font-display font-bold">{formatGHS(h.pricePerSemester * 2)}</span></Cell>)}
            </Section>
            <Section label="Per semester">
              {items.map((h) => <Cell key={h.id}>{formatGHS(h.pricePerSemester)}</Cell>)}
            </Section>
            <Section label="Deposit">{items.map((h) => <Cell key={h.id}>{formatGHS(h.deposit)}</Cell>)}</Section>
            <Section label="Rating">{items.map((h) => <Cell key={h.id}>★ {h.rating}</Cell>)}</Section>
            <Section label="Distance">{items.map((h) => <Cell key={h.id}>{h.distanceKm} km</Cell>)}</Section>
            <Section label="Room types">{items.map((h) => <Cell key={h.id}>{h.roomTypes.join(", ")}</Cell>)}</Section>
            {AMENITIES.map((a) => (
              <Section key={a} label={a}>
                {items.map((h) => (
                  <Cell key={h.id}>
                    {h.amenities.includes(a) ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-muted-foreground/40" />}
                  </Cell>
                ))}
              </Section>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="align-top">
      <th className="sticky left-0 bg-background py-2 pr-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</th>
      {children}
    </tr>
  );
}
function Cell({ children }: { children: React.ReactNode }) {
  return <td className="py-2 align-middle"><div className="rounded-xl bg-card px-3 py-2 shadow-card">{children}</div></td>;
}
