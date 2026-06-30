import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Star, ShieldCheck } from "lucide-react";
import { AVAILABILITY_META, formatGHS, type Hostel } from "@/lib/hostels";
import { cn } from "@/lib/utils";

export function HostelCard({ hostel, eager }: { hostel: Hostel; eager?: boolean }) {
  const avail = AVAILABILITY_META[hostel.availability];
  const full = hostel.availability === "full";
  return (
    <Link
      to="/hostel/$id"
      params={{ id: hostel.id }}
      className="group block overflow-hidden rounded-2xl bg-card shadow-card transition-all active:scale-[0.99]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={hostel.photos[0]}
          alt={hostel.name}
          loading={eager ? "eager" : "lazy"}
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md", avail.className)}>
            {avail.label}
          </span>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); }}
            className="grid h-9 w-9 place-items-center rounded-full bg-card/85 text-foreground backdrop-blur transition-colors hover:bg-card"
            aria-label="Save"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
        {hostel.verified && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground backdrop-blur">
            <ShieldCheck className="h-3 w-3" /> Verified
          </span>
        )}
      </div>
      <div className="space-y-1.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight">{hostel.name}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            {hostel.rating}
          </span>
        </div>
        <p className="line-clamp-1 text-sm text-muted-foreground">{hostel.tagline}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {hostel.area} · {hostel.distanceKm} km from UCC
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <span className="font-display text-xl font-bold text-foreground">{formatGHS(hostel.pricePerSemester)}</span>
            <span className="text-xs text-muted-foreground"> / semester</span>
          </div>
          <span className="text-xs text-muted-foreground">{hostel.reviewsCount} reviews</span>
        </div>
        <Link
          to="/booking/$id"
          params={{ id: hostel.id }}
          onClick={(e) => {
            e.stopPropagation();
            if (full) e.preventDefault();
          }}
          aria-disabled={full}
          className={cn(
            "mt-3 block rounded-2xl py-2.5 text-center text-xs font-bold transition-transform active:scale-[0.98]",
            full
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground shadow-gold",
          )}
        >
          {full ? "Fully booked" : "Reserve now"}
        </Link>
      </div>
    </Link>
  );
}
