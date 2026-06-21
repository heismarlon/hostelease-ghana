import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, CreditCard, Gift, Globe, Heart, LogOut, Moon, ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — HostelEase" }] }),
  component: Profile,
});

const BOOKINGS = [
  { hostel: "Amamoma Court", status: "Confirmed", color: "bg-success/15 text-success" },
  { hostel: "Apewosika Lodge", status: "Completed", color: "bg-muted text-muted-foreground" },
];

function Profile() {
  return (
    <div className="space-y-5 pb-6">
      <header className="bg-primary px-5 pb-6 pt-12 text-primary-foreground">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gold font-display text-2xl font-bold text-gold-foreground">
            AM
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-semibold">Akua Mensah</h1>
            <p className="truncate text-xs text-primary-foreground/70">BSc Nursing · L300 · UCC</p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-gold">
              <ShieldCheck className="h-3 w-3" /> Verified student
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-3 px-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bookings</h2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          {BOOKINGS.map((b, i) => (
            <div key={b.hostel} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
              <div>
                <p className="text-sm font-semibold">{b.hostel}</p>
                <p className="text-xs text-muted-foreground">2024/25 academic year</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${b.color}`}>{b.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2 px-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick actions</h2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          <Row icon={Heart} label="Saved hostels" to="/saved" />
          <Row icon={Users} label="Roommate matching" badge="New" />
          <Row icon={CreditCard} label="Payment methods" />
          <Row icon={Gift} label="Refer & earn GHS 50" />
          <Row icon={Globe} label="Language" value="English" />
          <Row icon={Moon} label="Dark mode" value="System" />
          <Row icon={LogOut} label="Sign out" danger />
        </div>
      </section>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  badge,
  danger,
  to,
}: {
  icon: typeof Heart;
  label: string;
  value?: string;
  badge?: string;
  danger?: boolean;
  to?: "/saved";
}) {
  const content = (
    <div className="flex items-center gap-3 px-4 py-3.5 [&+&]:border-t [&+&]:border-border">
      <span className={`grid h-9 w-9 place-items-center rounded-full ${danger ? "bg-destructive/10 text-destructive" : "bg-accent text-primary"}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className={`flex-1 text-sm font-medium ${danger ? "text-destructive" : ""}`}>{label}</span>
      {badge && <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-gold-foreground">{badge}</span>}
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      {!danger && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  );
  return to ? <Link to={to} className="block border-t border-border first:border-t-0">{content}</Link> : <div className="border-t border-border first:border-t-0">{content}</div>;
}
