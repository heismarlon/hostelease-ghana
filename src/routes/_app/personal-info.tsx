import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, GraduationCap, Loader2, Mail, MapPin, Pencil, Phone, ShieldCheck, User } from "lucide-react";
import { useProfile, initials } from "@/lib/use-profile";

export const Route = createFileRoute("/_app/personal-info")({
  head: () => ({ meta: [{ title: "Personal info — HostelEase" }] }),
  component: PersonalInfo,
});

function PersonalInfo() {
  const { profile, loading, save } = useProfile();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    programme: "",
    level: "",
    university: "",
    phone: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        programme: profile.programme ?? "",
        level: profile.level ?? "",
        university: profile.university ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile]);

  const onSave = async () => {
    setSaving(true);
    try {
      await save(form);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "full_name", icon: User, label: "Full name" },
    { key: "programme", icon: GraduationCap, label: "Programme" },
    { key: "level", icon: GraduationCap, label: "Level" },
    { key: "university", icon: MapPin, label: "University" },
    { key: "phone", icon: Phone, label: "Phone" },
  ] as const;

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
            {initials(profile?.full_name)}
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-bold">{profile?.full_name || "Your account"}</h1>
            <p className="truncate text-xs text-white/80">
              {[profile?.programme, profile?.level && `L${profile.level}`, profile?.university]
                .filter(Boolean)
                .join(" · ") || "Add your details"}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-gold">
              <ShieldCheck className="h-3 w-3" /> Verified student
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-2 px-5 pt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profile details</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground"
            >
              <Pencil className="h-3 w-3" /> Edit
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          {loading ? (
            <p className="p-5 text-center text-xs text-muted-foreground">Loading…</p>
          ) : (
            fields.map((f, i) => (
              <div
                key={f.key}
                className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-primary">
                  <f.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{f.label}</p>
                  {editing ? (
                    <input
                      value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : (
                    <p className="truncate text-sm font-semibold">
                      {form[f.key] || <span className="text-muted-foreground">Not set</span>}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
          {profile?.email && (
            <div className="flex items-center gap-3 border-t border-border px-4 py-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-primary">
                <Mail className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Email</p>
                <p className="truncate text-sm font-semibold">{profile.email}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-5 pt-5">
        {editing ? (
          <div className="flex gap-3">
            <button
              onClick={() => setEditing(false)}
              className="flex-1 rounded-2xl border border-border bg-card py-3.5 text-sm font-bold"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-70"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </button>
          </div>
        ) : (
          <Link
            to="/profile"
            className="block rounded-2xl bg-primary py-3.5 text-center text-sm font-bold text-primary-foreground"
          >
            Done
          </Link>
        )}
      </section>
    </div>
  );
}
