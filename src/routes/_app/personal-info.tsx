import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, Mail, MapPin, Phone, ShieldCheck, User } from "lucide-react";

export const Route = createFileRoute("/_app/personal-info")({
  head: () => ({ meta: [{ title: "Personal info — HostelEase" }] }),
  component: PersonalInfo,
});

const FIELDS = [
  { icon: User, label: "Full name", value: "Marlon Bilson" },
  { icon: GraduationCap, label: "Programme", value: "BSc Computer Science" },
  { icon: GraduationCap, label: "Level", value: "300" },
  { icon: MapPin, label: "University", value: "University of Cape Coast (UCC)" },
  { icon: Mail, label: "Email", value: "marlon.bilson@stu.ucc.edu.gh" },
  { icon: Phone, label: "Phone", value: "+233 24 123 4567" },
];

function PersonalInfo() {
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
            MB
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">Marlon Bilson</h1>
            <p className="text-xs text-white/80">BSc Computer Science · L300 · UCC</p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-gold">
              <ShieldCheck className="h-3 w-3" /> Verified student
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-2 px-5 pt-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Profile details
        </h2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          {FIELDS.map((f, i) => (
            <div
              key={f.label}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-primary">
                <f.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {f.label}
                </p>
                <p className="truncate text-sm font-semibold">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pt-5">
        <Link
          to="/profile"
          className="block rounded-2xl bg-primary py-3.5 text-center text-sm font-bold text-primary-foreground"
        >
          Done
        </Link>
      </section>
    </div>
  );
}
