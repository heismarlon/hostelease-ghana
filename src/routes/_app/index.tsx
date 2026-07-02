import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, MapPin, SlidersHorizontal, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { HOSTELS } from "@/lib/hostels";
import { HostelCard } from "@/components/HostelCard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "HostelEase — Find verified UCC hostels" },
      {
        name: "description",
        content:
          "Discover, compare and book verified off-campus hostels near the University of Cape Coast. Pay with Mobile Money.",
      },
    ],
  }),
  component: Discover,
});

function Discover() {
  const popular = HOSTELS;
  const nearby = [...HOSTELS].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return { ...data, email: user.email ?? "" };
    },
  });

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="rounded-b-3xl bg-hero-gradient px-5 pb-6 pt-12 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-white/75">
              <MapPin className="h-3 w-3" />
              University of Cape Coast
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold leading-tight">
              Hi {firstName}, find your
              <br />
              next home <span className="text-gold">near campus</span>
            </h1>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute mt-[-18px] ml-5 h-2 w-2 rounded-full bg-gold" />
          </button>
        </div>

        <Link
          to="/search"
          className="mt-5 flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-foreground shadow-float"
        >
          <span className="text-sm text-muted-foreground">Try "self-contained near Science"</span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-gold-foreground">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
        </Link>
      </header>

      {/* Promo */}
      <section className="mx-5 rounded-2xl border border-gold/30 bg-gold/10 p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-gold-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Refer a friend, earn GHS 20</p>
            <p className="text-xs text-muted-foreground">When they complete their first booking.</p>
          </div>
        </div>
      </section>

      {/* Nearby */}
      <section className="space-y-3">
        <div className="flex items-end justify-between px-5">
          <div>
            <h2 className="font-display text-xl font-semibold">Closest to you</h2>
            <p className="text-xs text-muted-foreground">Sorted by walking distance</p>
          </div>
          <Link to="/search" className="text-xs font-semibold text-primary">
            See all
          </Link>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
          {nearby.map((h) => (
            <div key={h.id} className="w-[78%] shrink-0">
              <HostelCard hostel={h} eager />
            </div>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="space-y-3 px-5">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold">Popular this week</h2>
          <Link to="/search" className="text-xs font-semibold text-primary">
            See all
          </Link>
        </div>
        <div className="grid gap-4">
          {popular.map((h) => (
            <HostelCard key={h.id} hostel={h} />
          ))}
        </div>
      </section>
    </div>
  );
}
