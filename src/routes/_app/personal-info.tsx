import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, Mail, MapPin, Phone, ShieldCheck, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/personal-info")({
  head: () => ({ meta: [{ title: "Personal info — HostelEase" }] }),
  component: PersonalInfo,
});

function PersonalInfo() {
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
      // profiles has no email column — email lives on the auth user record.
      return { ...data, email: user.email ?? "" };
    },
  });

  const FIELDS = [
    { icon: User, label: "Full name", value: profile?.full_name ?? "" },
    { icon: GraduationCap, label: "Programme", value: profile?.programme ?? "" },
    { icon: GraduationCap, label: "Level", value: profile?.level ?? "" },
    { icon: MapPin, label: "University", value: profile?.university ?? "" },
    { icon: Mail, label: "Email", value: profile?.email ?? "" },
    { icon: Phone, label: "Phone", value: profile?.phone ?? "" },
  ];

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="bg-hero-gradient px-5 pb-8 pt-12 text-white">
        <Link
          to="/profile"
          className="mb-4 inline-grid h-10 w-10 place-items-center rounded-full bg-white/15"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gold font-display text-2xl font-bold text-gold-foreground">
            {initials}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">{profile?.full_name ?? ""}</h1>
            <p className="text-xs text-white/80">
              {profile?.programme ?? ""} · {profile?.level ? `L${profile.level}` : ""} ·{" "}
              {profile?.university ?? ""}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-gold">
              <ShieldCheck className="h-3 w-3" /> Verified student
            </p>
          </div>
        </div>
      </header>

      <section className="mt-5 space-y-2 px-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Details
        </h2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          {FIELDS.map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="truncate text-sm font-medium">{value || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
