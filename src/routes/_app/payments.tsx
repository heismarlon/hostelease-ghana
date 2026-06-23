import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Building2, Check, CreditCard, Plus, Smartphone, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/payments")({
  head: () => ({ meta: [{ title: "Payment methods — HostelEase" }] }),
  component: Payments,
});

type Method =
  | { id: string; kind: "momo"; label: string; sub: string }
  | { id: string; kind: "bank"; label: string; sub: string }
  | { id: string; kind: "card"; label: string; sub: string };

const INITIAL: Method[] = [
  { id: "m1", kind: "momo", label: "MTN MoMo", sub: "024 •••• 1245 · Marlon B." },
  { id: "m2", kind: "bank", label: "GCB Bank", sub: "•••• •••• 8821" },
  { id: "m3", kind: "card", label: "Visa debit", sub: "•••• •••• •••• 4242 · exp 09/27" },
];

const ICONS = { momo: Smartphone, bank: Building2, card: CreditCard } as const;

function Payments() {
  const [methods, setMethods] = useState<Method[]>(INITIAL);
  const [activeId, setActiveId] = useState<string>(INITIAL[0].id);
  const [adding, setAdding] = useState<null | Method["kind"]>(null);

  const remove = (id: string) =>
    setMethods((m) => m.filter((x) => x.id !== id));

  const add = (kind: Method["kind"], label: string, sub: string) => {
    const m: Method = { id: crypto.randomUUID(), kind, label, sub };
    setMethods((arr) => [...arr, m]);
    setActiveId(m.id);
    setAdding(null);
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="flex items-center gap-3 bg-hero-gradient px-5 pb-6 pt-12 text-white">
        <Link
          to="/profile"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/15"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold">Payment methods</h1>
          <p className="text-xs text-white/80">Used for your hostel bookings & service fee</p>
        </div>
      </header>

      <section className="space-y-3 px-5 pt-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Saved
        </h2>
        <ul className="space-y-2">
          {methods.map((m) => {
            const Icon = ICONS[m.kind];
            const active = activeId === m.id;
            return (
              <li
                key={m.id}
                className={`flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-card ${
                  active ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <button
                  onClick={() => setActiveId(m.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-semibold">{m.label}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{m.sub}</p>
                </button>
                {active ? (
                  <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                    <Check className="h-3 w-3" /> Default
                  </span>
                ) : (
                  <button
                    onClick={() => remove(m.id)}
                    className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-2 px-5 pt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Add new
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {(["momo", "bank", "card"] as const).map((k) => {
            const Icon = ICONS[k];
            const label = k === "momo" ? "MoMo" : k === "bank" ? "Bank" : "Card";
            return (
              <button
                key={k}
                onClick={() => setAdding(k)}
                className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-border bg-card p-3 text-xs font-semibold"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                {label}
                <Plus className="h-3 w-3 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </section>

      {adding && (
        <AddSheet kind={adding} onClose={() => setAdding(null)} onAdd={add} />
      )}
    </div>
  );
}

function AddSheet({
  kind,
  onClose,
  onAdd,
}: {
  kind: "momo" | "bank" | "card";
  onClose: () => void;
  onAdd: (k: "momo" | "bank" | "card", label: string, sub: string) => void;
}) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const submit = () => {
    if (kind === "momo") onAdd("momo", "Mobile Money", `${a} · ${b || "Marlon B."}`);
    if (kind === "bank") onAdd("bank", a || "Bank", `•••• ${b.slice(-4)}`);
    if (kind === "card") onAdd("card", "Card", `•••• •••• •••• ${a.slice(-4)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md rounded-t-3xl bg-card p-5 pb-8">
        <h3 className="font-display text-lg font-bold">
          Add {kind === "momo" ? "Mobile Money" : kind === "bank" ? "bank account" : "card"}
        </h3>
        <div className="mt-4 space-y-3">
          {kind === "momo" && (
            <>
              <Input label="Phone number" value={a} onChange={setA} placeholder="024 123 4567" />
              <Input label="Account name" value={b} onChange={setB} placeholder="Marlon Bilson" />
            </>
          )}
          {kind === "bank" && (
            <>
              <Input label="Bank" value={a} onChange={setA} placeholder="GCB Bank" />
              <Input label="Account number" value={b} onChange={setB} placeholder="1234567890" />
            </>
          )}
          {kind === "card" && (
            <>
              <Input label="Card number" value={a} onChange={setA} placeholder="4242 4242 4242 4242" />
              <Input label="Expiry" value={b} onChange={setB} placeholder="MM/YY" />
            </>
          )}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="rounded-2xl border border-border bg-card py-3 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
