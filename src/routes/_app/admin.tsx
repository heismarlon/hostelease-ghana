import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Plus, ShieldCheck, Trash2 } from "lucide-react";
import {
  addHostel,
  getAddedHostels,
  getHiddenIds,
  removeAdded,
  toggleHidden,
  useHostels,
  useIsAdmin,
} from "@/lib/use-hostels";
import type { Hostel } from "@/lib/hostels";
import { HOSTELS as BASE } from "@/lib/hostels";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin — HostelEase" }] }),
  component: AdminPage,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function AdminPage() {
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const hostels = useHostels();
  const hidden = getHiddenIds();
  const added = new Set(getAddedHostels().map((h) => h.id));
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [area, setArea] = useState("Amamoma");
  const [price, setPrice] = useState("3500");
  const [tagline, setTagline] = useState("");
  const [photo, setPhoto] = useState("");

  if (!isAdmin) {
    return (
      <div className="mx-5 mt-20 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-primary" />
        <p className="font-display text-lg font-semibold">Admins only</p>
        <p className="mt-1 text-sm text-muted-foreground">Sign in as an admin to manage hostels.</p>
        <button
          onClick={() => navigate({ to: "/auth" })}
          className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          Go to sign in
        </button>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = `custom-${slugify(name)}-${Date.now().toString(36)}`;
    const p = Number(price) || 3000;
    const img = photo.trim() || BASE[0].photos[0];
    const h: Hostel = {
      id,
      name: name.trim(),
      tagline: tagline || `New listing in ${area}`,
      area,
      distanceKm: 1.2,
      pricePerSemester: p,
      deposit: Math.round(p * 0.15),
      rating: 4.5,
      reviewsCount: 0,
      verified: true,
      availability: "available",
      roomTypes: ["single", "shared"],
      amenities: ["Wi-Fi", "24/7 Water", "Security"],
      photos: [img, img, img],
      description: `${name} — added by admin.`,
      owner: { name: "HostelEase", responseRate: 100 },
      reviews: [],
    };
    addHostel(h);
    setName("");
    setTagline("");
    setPhoto("");
    setShowForm(false);
  };

  return (
    <div className="pb-24">
      <header className="bg-hero-gradient px-5 pb-6 pt-12 text-white">
        <Link to="/profile" className="inline-flex items-center gap-2 text-xs text-primary-foreground/90">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold">Admin dashboard</h1>
            <p className="text-xs text-primary-foreground/80">Add, hide or remove hostel listings.</p>
          </div>
        </div>
      </header>

      <section className="mt-4 px-5">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Add new hostel"}
        </button>

        {showForm && (
          <form onSubmit={submit} className="mt-3 space-y-3 rounded-2xl bg-card p-4 shadow-card">
            <label className="block">
              <span className="text-xs font-semibold">Hostel name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold">Tagline</span>
              <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-xs font-semibold">Area</span>
                <input value={area} onChange={(e) => setArea(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold">Price / semester (GHS)</span>
                <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-semibold">Photo URL (optional)</span>
              <input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://…" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
            </label>
            <button type="submit" className="w-full rounded-xl bg-gold py-2.5 text-sm font-semibold text-gold-foreground">
              Create listing
            </button>
          </form>
        )}
      </section>

      <section className="mt-6 px-5">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Listings ({BASE.length + getAddedHostels().length})
        </h2>
        <div className="space-y-2">
          {[...BASE, ...getAddedHostels()].map((h) => {
            const isHidden = hidden.includes(h.id);
            const isAdded = added.has(h.id);
            const active = hostels.find((x) => x.id === h.id);
            return (
              <div key={h.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card">
                <img src={h.photos[0]} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{h.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {h.area} · GHS {h.pricePerSemester} / sem
                    {isAdded && <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">CUSTOM</span>}
                    {!active && <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold">HIDDEN</span>}
                  </p>
                </div>
                <button
                  onClick={() => toggleHidden(h.id)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-foreground"
                  aria-label={isHidden ? "Show" : "Hide"}
                >
                  {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {isAdded && (
                  <button
                    onClick={() => removeAdded(h.id)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-destructive/10 text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
