import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Home, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — HostelEase" }] }),
  component: Auth,
});

function Auth() {
  const [role, setRole] = useState<"student" | "owner">("student");
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("University of Cape Coast (UCC)");
  const [programme, setProgramme] = useState("");
  const [level, setLevel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      if (typeof window !== "undefined") window.localStorage.setItem("he_signed_in", "1");
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
          <div className="grid grid-cols-2 gap-2">
            <RoleCard active={role === "student"} onClick={() => setRole("student")} icon={GraduationCap} label="Student" sub="Looking for a hostel" />
            <RoleCard active={role === "owner"} onClick={() => setRole("owner")} icon={Home} label="Hostel Owner" sub="Listing rooms" />
          </div>
        </div>
      )}

      <form className="mt-6 space-y-3" onSubmit={submit}>
        {mode === "signup" && (
          <Field label="Full name" type="text" placeholder="Akua Mensah" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        )}
        <Field
          label={role === "student" && mode === "signup" ? "University email" : "Email"}
          type="email"
          placeholder={role === "student" && mode === "signup" ? "you@stu.ucc.edu.gh" : "you@example.com"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

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
