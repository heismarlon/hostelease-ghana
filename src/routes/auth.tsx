import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Home, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — HostelEase" }] }),
  component: Auth,
});

type Role = "student" | "owner" | "admin";

function Auth() {
  const [role, setRole] = useState<Role>("student");
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [adminLogin, setAdminLogin] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("University of Cape Coast (UCC)");
  const [programme, setProgramme] = useState("");
  const [level, setLevel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName,
              role,
              phone,
              university: role === "student" ? university : "",
              programme: role === "student" ? programme : "",
              level: role === "student" ? level : "",
            },
          },
        });
        if (error) throw error;
        if (!data.session) {
          const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
          if (signInErr) throw signInErr;
        }
        // Ensure profile row reflects the details even if trigger raced
        const { data: userRes } = await supabase.auth.getUser();
        if (userRes.user) {
          await supabase.from("profiles").upsert({
            id: userRes.user.id,
            full_name: fullName,
            role,
            phone,
            university: role === "student" ? university : "",
            programme: role === "student" ? programme : "",
            level: role === "student" ? level : "",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem("he_signed_in", "1");
        const effectiveRole = mode === "signup" ? role : (adminLogin ? "admin" : "student");
        window.localStorage.setItem("he_role", effectiveRole);
        window.dispatchEvent(new Event("he-role-change"));
      }
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="mx-auto min-h-screen max-w-md bg-background px-6 pt-12 pb-10">
      <Link to="/onboarding" className="text-xs font-semibold text-muted-foreground">← Back</Link>
      <div className="mt-6">
        <h1 className="font-display text-3xl font-semibold leading-tight">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup" ? "It takes less than a minute — your account is saved securely." : "Sign in to continue your search."}
        </p>
      </div>

      {mode === "signup" && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold">I am a…</p>
          <div className="grid grid-cols-3 gap-2">
            <RoleCard active={role === "student"} onClick={() => setRole("student")} icon={GraduationCap} label="Student" sub="Booking a hostel" />
            <RoleCard active={role === "owner"} onClick={() => setRole("owner")} icon={Home} label="Owner" sub="Listing rooms" />
            <RoleCard active={role === "admin"} onClick={() => setRole("admin")} icon={ShieldCheck} label="Admin" sub="Manage the app" />
          </div>
        </div>
      )}


      <form className="mt-6 space-y-3" onSubmit={submit}>
        {mode === "signup" && (
          <>
            <Field label="Full name" type="text" placeholder="Akua Mensah" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <Field label="Phone" type="tel" placeholder="+233 24 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
            {role === "student" && (
              <>
                <Field label="University" type="text" placeholder="University of Cape Coast (UCC)" value={university} onChange={(e) => setUniversity(e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Programme" type="text" placeholder="BSc Computer Science" value={programme} onChange={(e) => setProgramme(e.target.value)} />
                  <Field label="Level" type="text" placeholder="300" value={level} onChange={(e) => setLevel(e.target.value)} />
                </div>
              </>
            )}
          </>
        )}
        <Field
          label={role === "student" && mode === "signup" ? "University email" : "Email"}
          type="email"
          placeholder={role === "student" && mode === "signup" ? "you@stu.ucc.edu.gh" : "you@example.com"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block">
          <span className="text-xs font-semibold">Password</span>
          <div className="relative mt-1.5">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="w-full rounded-2xl border border-input bg-card px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-2 grid w-9 place-items-center rounded-xl text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        {mode === "login" && (
          <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs">
            <input
              type="checkbox"
              checked={adminLogin}
              onChange={(e) => setAdminLogin(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold">Sign in as admin</span>
            <span className="text-muted-foreground">— manage hostels & app content</span>
          </label>
        )}

        {mode === "signup" && role === "student" && (
          <p className="rounded-xl bg-secondary px-3 py-2 text-[11px] text-muted-foreground">
            We verify student emails ending in <span className="font-semibold">@stu.ucc.edu.gh</span> automatically. You can also upload a student ID later.
          </p>
        )}


        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-[12px] text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-3.5 text-sm font-bold text-gold-foreground shadow-gold disabled:opacity-70"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        {mode === "signup" ? "Already have an account?" : "New to HostelEase?"}{" "}
        <button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(null); }} className="font-semibold text-primary">
          {mode === "signup" ? "Sign in" : "Create one"}
        </button>
      </p>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-semibold">{label}</span>
      <input
        {...rest}
        className="mt-1.5 w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function RoleCard({
  active, onClick, icon: Icon, label, sub,
}: { active: boolean; onClick: () => void; icon: typeof GraduationCap; label: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border bg-card p-4 text-left transition-all",
        active ? "border-primary ring-2 ring-primary/20" : "border-border",
      )}
    >
      <span className={cn("mb-2 grid h-10 w-10 place-items-center rounded-xl", active ? "bg-gold text-gold-foreground" : "bg-secondary text-foreground")}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </button>
  );
}
