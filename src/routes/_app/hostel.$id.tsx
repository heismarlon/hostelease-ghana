import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Heart, Share2, ShieldCheck, Star, MapPin, MessageCircle, Check, Flag } from "lucide-react";
import { AVAILABILITY_META, formatGHS, getHostel } from "@/lib/hostels";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/hostel/$id")({
  loader: ({ params }) => {
    const hostel = getHostel(params.id);
    if (!hostel) throw notFound();
    return { hostel };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.hostel.name} — HostelEase` },
          { name: "description", content: loaderData.hostel.tagline },
          { property: "og:title", content: loaderData.hostel.name },
          { property: "og:description", content: loaderData.hostel.tagline },
          { property: "og:image", content: loaderData.hostel.photos[0] },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <p className="font-display text-xl font-semibold">Hostel not found</p>
      <Link to="/" className="mt-3 inline-block text-sm text-primary">Back home</Link>
    </div>
  ),
  errorComponent: () => <div className="p-10 text-center text-sm text-muted-foreground">Something went wrong.</div>,
  component: HostelDetail,
});

function HostelDetail() {
  const { hostel } = Route.useLoaderData();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(0);
  const [saved, setSaved] = useState(false);
  const avail = AVAILABILITY_META[hostel.availability];

  return (
    <div className="pb-32">
      {/* Gallery */}
      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={hostel.photos[photo]}
            alt={hostel.name}
            width={1024}
            height={768}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 pt-12">
          <button
            onClick={() => navigate({ to: "/" })}
            className="grid h-10 w-10 place-items-center rounded-full bg-card/90 text-foreground backdrop-blur"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-card/90 backdrop-blur" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className="grid h-10 w-10 place-items-center rounded-full bg-card/90 backdrop-blur"
              aria-label="Save"
            >
              <Heart className={cn("h-4 w-4", saved && "fill-destructive text-destructive")} />
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {hostel.photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setPhoto(i)}
              className={cn("h-1.5 rounded-full transition-all", i === photo ? "w-6 bg-card" : "w-1.5 bg-card/60")}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6 px-5 pt-5">
        {/* Title block */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-semibold leading-tight">{hostel.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {hostel.area} · {hostel.distanceKm} km from UCC
              </p>
            </div>
            <div className="shrink-0 text-right">
              <div className="inline-flex items-center gap-1 text-sm font-semibold">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                {hostel.rating}
              </div>
              <p className="text-[11px] text-muted-foreground">{hostel.reviewsCount} reviews</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {hostel.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                <ShieldCheck className="h-3 w-3" /> Verified by HostelEase
              </span>
            )}
            <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", avail.className)}>{avail.label}</span>
            {hostel.roomTypes.map((rt) => (
              <span key={rt} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold capitalize text-secondary-foreground">
                {rt}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground">{hostel.description}</p>

        {/* Price card */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold">{formatGHS(hostel.pricePerSemester)}</span>
            <span className="text-xs text-muted-foreground">per semester</span>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-accent px-3 py-2 text-xs">
            <span className="text-muted-foreground">Refundable deposit</span>
            <span className="font-semibold">{formatGHS(hostel.deposit)}</span>
          </div>
        </div>

        {/* Amenities */}
        <section>
          <h2 className="font-display text-lg font-semibold">What's included</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {hostel.amenities.map((a) => (
              <li key={a} className="flex items-center gap-2 rounded-xl bg-card px-3 py-2.5 text-sm shadow-card">
                <Check className="h-4 w-4 text-success" />
                {a}
              </li>
            ))}
          </ul>
        </section>

        {/* Owner */}
        <section className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
              {hostel.owner.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{hostel.owner.name}</p>
              <p className="text-xs text-muted-foreground">Replies to {hostel.owner.responseRate}% of messages</p>
            </div>
            <Link to="/messages" className="grid h-10 w-10 place-items-center rounded-full bg-gold text-gold-foreground" aria-label="Message">
              <MessageCircle className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Map placeholder */}
        <section>
          <h2 className="font-display text-lg font-semibold">Location</h2>
          <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-accent to-gold/20">
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0 24px, oklch(0.27 0.07 260 / 0.08) 24px 25px), repeating-linear-gradient(90deg, transparent 0 24px, oklch(0.27 0.07 260 / 0.08) 24px 25px)",
              }}
            />
            <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-float">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="absolute bottom-3 left-3 rounded-full bg-card/90 px-3 py-1 text-[11px] font-semibold backdrop-blur">
              {hostel.distanceKm} km from main gate
            </span>
          </div>
        </section>

        {/* Reviews */}
        <section>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-lg font-semibold">Verified reviews</h2>
            <span className="inline-flex items-center gap-1 text-sm font-semibold">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              {hostel.rating} · {hostel.reviewsCount}
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {hostel.reviews.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
                No reviews yet — be the first after you book.
              </p>
            ) : (
              hostel.reviews.map((r) => (
                <article key={r.id} className="rounded-2xl bg-card p-4 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{r.author}</p>
                      <p className="text-[11px] text-muted-foreground">{r.program}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      {r.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.comment}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground">{r.date}</p>
                </article>
              ))
            )}
          </div>
        </section>

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3 text-xs font-semibold text-muted-foreground">
          <Flag className="h-3.5 w-3.5" /> Report this listing
        </button>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-border bg-card/95 px-5 py-3 backdrop-blur safe-bottom">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-bold">{formatGHS(hostel.pricePerSemester)}</p>
            <p className="text-[11px] text-muted-foreground">per semester · deposit {formatGHS(hostel.deposit)}</p>
          </div>
          {hostel.availability === "full" ? (
            <button className="rounded-2xl border border-primary px-5 py-3.5 text-sm font-semibold text-primary">
              Join waitlist
            </button>
          ) : (
            <Link
              to="/booking/$id"
              params={{ id: hostel.id }}
              className="rounded-2xl bg-gold px-6 py-3.5 text-sm font-bold text-gold-foreground shadow-gold transition-transform active:scale-95"
            >
              Reserve
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
