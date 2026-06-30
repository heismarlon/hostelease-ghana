import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, MapPin, ShieldCheck, User, Users } from "lucide-react";
import { formatGHS, HOSTELS, type Hostel } from "@/lib/hostels";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/roommates")({
  head: () => ({ meta: [{ title: "Roommate matching — HostelEase" }] }),
  component: Roommates,
});

type Occupancy = "single" | "shared";

const PROFILES = [
  { name: "Akosua M.", program: "BSc Nursing · L200", vibe: "Quiet · early riser" },
  { name: "Kojo A.", program: "BA Economics · L300", vibe: "Tidy · gym buddy" },
  { name: "Yaa B.", program: "BSc Biochem · L100", vibe: "Studious · weekend church" },
  { name: "Kwame O.", program: "BSc CS · L300", vibe: "Coder · night owl" },
  { name: "Esi K.", program: "LLB · L200", vibe: "Reads a lot · loves jollof" },
  { name: "Nana A.", program: "BSc Maths · L400", vibe: "Chill · plays FIFA" },
];

function Roommates() {
  const [occupancy, setOccupancy] = useState<Occupancy>("shared");

  const list = useMemo(() => {
    if (occupancy === "single") {
      return HOSTELS.filter((h) => h.roomTypes.includes("single") || h.roomTypes.includes("self-contained"));
    }
    return HOSTELS.filter((h) => h.roomTypes.includes("shared"));
  }, [occupancy]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="flex items-center gap-3 px-5 pt-12 pb-4">
        <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-card" aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold">Roommate matching</h1>
          <p className="text-xs text-muted-foreground">Pick how many people you want per room</p>
        </div>
      </header>

      <div className="space-y-5 px-5">
        {/* Occupancy switch */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-card p-2 shadow-card">
          <OptionTab active={occupancy === "single"} onClick={() => setOccupancy("single")} icon={User} title="One in a room" sub="Just you" />
          <OptionTab active={occupancy === "shared"} onClick={() => setOccupancy("shared")} icon={Users} title="Two in a room" sub="Find a roommate" />
        </div>

        {occupancy === "shared" && (
          <section>
            <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Students looking for a roommate</h2>
            <div className="mt-3 grid gap-2">
              {PROFILES.map((p, i) => (
                <article key={p.name} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gold font-display text-sm font-bold text-gold-foreground">
                    {p.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{p.program}</p>
                    <p className="mt-0.5 truncate text-[11px] text-primary">{p.vibe}</p>
                  </div>
                  <span className="rounded-full bg-success/15 px-2 py-1 text-[10px] font-bold text-success">
                    {i % 2 === 0 ? "1 spot" : "Open"}
                  </span>
                </article>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {occupancy === "single" ? "Single & self-contained rooms" : "Shared rooms with one spot left"}
          </h2>
          <div className="mt-3 grid gap-3">
            {list.map((h) => (
              <RoomCard key={h.id} hostel={h} occupancy={occupancy} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function OptionTab({
  active, onClick, icon: Icon, title, sub,
}: { active: boolean; onClick: () => void; icon: typeof User; title: string; sub: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 rounded-xl p-3 text-left transition-all",
        active ? "bg-primary text-primary-foreground shadow-gold" : "bg-transparent text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-bold">{title}</span>
      <span className={cn("text-[11px]", active ? "text-primary-foreground/80" : "text-muted-foreground")}>{sub}</span>
    </button>
  );
}

function RoomCard({ hostel, occupancy }: { hostel: Hostel; occupancy: Occupancy }) {
  return (
    <article className="flex gap-3 overflow-hidden rounded-2xl bg-card p-3 shadow-card">
      <img src={hostel.photos[0]} alt={hostel.name} className="h-24 w-24 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-display text-sm font-bold">{hostel.name}</p>
          {hostel.verified && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-primary">
              <ShieldCheck className="h-3 w-3" /> Verified
            </span>
          )}
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3" /> {hostel.area} · {hostel.distanceKm} km
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {occupancy === "single" ? "Private room" : "Shared room · 1 roommate needed"}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-display text-sm font-bold">{formatGHS(hostel.pricePerSemester)}<span className="text-[10px] font-normal text-muted-foreground"> /sem</span></span>
          <Link
            to="/booking/$id"
            params={{ id: hostel.id }}
            className="rounded-xl bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground"
          >
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}
