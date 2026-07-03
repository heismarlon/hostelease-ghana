import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight, Copy, CreditCard, Gift, Globe, Heart, LogOut, Moon, Receipt, ShieldCheck, Sun, User, Users } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, initials } from "@/lib/use-profile";



export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — HostelEase" }] }),
  component: Profile,
});

const BOOKINGS = [
  { hostel: "Amamoma Court", status: "Confirmed", color: "bg-success/15 text-success" },
  { hostel: "Apewosika Lodge", status: "Completed", color: "bg-muted text-muted-foreground" },
];

const THEMES: { id: Theme; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "Auto" },
];

const REFERRAL_CODE = "MARLON20";

function Profile() {
  const navigate = useNavigate();
  const [theme, setTheme] = useTheme();
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") window.localStorage.removeItem("he_signed_in");
    navigate({ to: "/auth" });
  };

  const handleRefer = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://hostelease.app";
    setReferralLink(`${origin}/auth?ref=${REFERRAL_CODE}`);
    setCopied(false);
  };

  const copyLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5 pb-6">
      <header className="bg-hero-gradient px-5 pb-6 pt-12 text-white">

        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gold font-display text-2xl font-bold text-gold-foreground">
            MB
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-semibold">Marlon Bilson</h1>
            <p className="truncate text-xs text-primary-foreground/70">BSc Computer Science · L300 · UCC</p>
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

      <section className="space-y-3 px-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Appearance</h2>
        <div className="rounded-2xl bg-card p-3 shadow-card">
          <div className="mb-2 flex items-center gap-2 px-1 text-sm font-medium">
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            Theme
          </div>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                  theme === t.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-2 px-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick actions</h2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          <Row icon={User} label="Personal info" to="/personal-info" />
          <Row icon={Receipt} label="Receipts" to="/receipts" />
          <Row icon={Heart} label="Saved hostels" to="/saved" />
          <Row icon={Users} label="Roommate matching" to="/roommates" />
          <Row icon={CreditCard} label="Payment methods" to="/payments" />
          <Row icon={Gift} label="Refer & earn GHS 20" onClick={handleRefer} />
          <Row icon={Globe} label="Language" to="/language" />
          <Row icon={LogOut} label="Sign out" danger onClick={signOut} />
        </div>

        {referralLink && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Your referral link</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Share this link. You earn <strong>GHS 20</strong> when your friend completes their first booking.
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-card p-2">
              <code className="flex-1 truncate text-[11px]">{referralLink}</code>
              <button
                onClick={copyLink}
                className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="px-5 pt-6 pb-4 text-center">
        <p className="font-script text-5xl leading-none text-gold">stay easy</p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">HostelEase · Ghana</p>
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
  onClick,
}: {
  icon: typeof Heart;
  label: string;
  value?: string;
  badge?: string;
  danger?: boolean;
  to?: "/saved" | "/payments" | "/personal-info" | "/receipts" | "/roommates" | "/language";
  onClick?: () => void;
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
  if (to) return <Link to={to} className="block border-t border-border first:border-t-0">{content}</Link>;
  if (onClick) return <button type="button" onClick={onClick} className="block w-full text-left border-t border-border first:border-t-0">{content}</button>;
  return <div className="border-t border-border first:border-t-0">{content}</div>;
}
