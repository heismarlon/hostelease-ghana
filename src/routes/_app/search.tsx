import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, Search as SearchIcon, X } from "lucide-react";
import { AMENITIES, HOSTELS } from "@/lib/hostels";
import { HostelCard } from "@/components/HostelCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/search")({
  head: () => ({ meta: [{ title: "Search hostels — HostelEase" }] }),
  component: SearchPage,
});

const ROOM_TYPES = [
  { id: "single", label: "Single" },
  { id: "shared", label: "Shared" },
  { id: "self-contained", label: "Self-contained" },
] as const;

const SORTS = [
  { id: "price", label: "Price" },
  { id: "rating", label: "Rating" },
  { id: "distance", label: "Distance" },
] as const;

function SearchPage() {
  const [q, setQ] = useState("");
  const [maxPrice, setMaxPrice] = useState(7000);
  const [rooms, setRooms] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("rating");

  const results = useMemo(() => {
    const r = HOSTELS.filter((h) => {
      if (q && !`${h.name} ${h.area} ${h.tagline}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (h.pricePerSemester > maxPrice) return false;
      if (rooms.length && !rooms.some((rt) => h.roomTypes.includes(rt as never))) return false;
      if (amenities.length && !amenities.every((a) => h.amenities.includes(a))) return false;
      return true;
    });
    if (sort === "price") r.sort((a, b) => a.pricePerSemester - b.pricePerSemester);
    if (sort === "rating") r.sort((a, b) => b.rating - a.rating);
    if (sort === "distance") r.sort((a, b) => a.distanceKm - b.distanceKm);
    return r;
  }, [q, maxPrice, rooms, amenities, sort]);

  const toggle = (list: string[], set: (v: string[]) => void, val: string) =>
    set(list.includes(val) ? list.filter((v) => v !== val) : [...list, val]);

  return (
    <div className="space-y-5 pb-6">
      <header className="sticky top-0 z-30 space-y-3 border-b border-border bg-background/95 px-5 pb-3 pt-12 backdrop-blur">
        <h1 className="font-display text-2xl font-semibold">Search</h1>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Hostel name, area, vibe…"
            className="w-full rounded-2xl border border-input bg-card py-3 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {q && (
            <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Clear">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      <section className="space-y-4 px-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold">
            <span>Max price per semester</span>
            <span className="text-primary">GHS {maxPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={1500}
            max={7000}
            step={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[oklch(0.78_0.16_75)]"
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold">Room type</p>
          <div className="flex flex-wrap gap-2">
            {ROOM_TYPES.map((rt) => (
              <Chip key={rt.id} active={rooms.includes(rt.id)} onClick={() => toggle(rooms, setRooms, rt.id)}>
                {rt.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => (
              <Chip key={a} active={amenities.includes(a)} onClick={() => toggle(amenities, setAmenities, a)}>
                {a}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </div>
          <div className="flex gap-1.5">
            {SORTS.map((s) => (
              <Chip key={s.id} active={sort === s.id} onClick={() => setSort(s.id)}>
                {s.label}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3 px-5">
        <p className="text-xs text-muted-foreground">{results.length} hostel{results.length === 1 ? "" : "s"} found</p>
        {results.length === 0 ? (
          <EmptyResults />
        ) : (
          <div className="grid gap-4">
            {results.map((h) => <HostelCard key={h.id} hostel={h} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}

function EmptyResults() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
      <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-accent text-2xl">🔭</div>
      <p className="font-display text-lg font-semibold">No matches yet</p>
      <p className="mt-1 text-sm text-muted-foreground">Try loosening a filter or two — your perfect room is out there.</p>
    </div>
  );
}
