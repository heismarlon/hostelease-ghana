import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — HostelEase" }] }),
  component: Auth,
});

function Auth() {
  const [role, setRole] = useState<"student" | "owner">("student");
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const navigate = useNavigate();

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background px-6 pt-12 pb-10">
      <Link to="/onboarding" className="text-xs font-semibold text-muted-foreground">← Back</Link>
      <div className="mt-6">
        <h1 className="font-display text-3xl font-semibold leading-tight">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup" ? "It takes less than a minute." : "Sign in to continue your search."}
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

      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/" });
        }}
      >
        {mode === "signup" && (
          <Field label="Full name" type="text" placeholder="Akua Mensah" />
        )}
        <Field
          label={role === "student" && mode === "signup" ? "University email" : "Email or phone"}
          type="email"
          placeholder={role === "student" && mode === "signup" ? "you@stu.ucc.edu.gh" : "you@example.com"}
        />
        <Field label="Password" type="password" placeholder="••••••••" />

        {mode === "signup" && role === "student" && (
          <p className="rounded-xl bg-secondary px-3 py-2 text-[11px] text-muted-foreground">
            We verify student emails ending in <span className="font-semibold">@stu.ucc.edu.gh</span> automatically. You can also upload a student ID later.
          </p>
        )}

        <button type="submit" className="mt-2 w-full rounded-2xl bg-gold py-3.5 text-sm font-bold text-gold-foreground shadow-gold">
          {mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or continue with <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-2xl border border-border bg-card py-3 text-sm font-semibold">Google</button>
        <button className="rounded-2xl border border-border bg-card py-3 text-sm font-semibold">Phone OTP</button>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        {mode === "signup" ? "Already have an account?" : "New to HostelEase?"}{" "}
        <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="font-semibold text-primary">
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
