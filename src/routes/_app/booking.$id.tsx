import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Clock, ShieldCheck } from "lucide-react";
import { formatGHS, getHostel } from "@/lib/hostels";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/booking/$id")({
  loader: ({ params }) => {
    const hostel = getHostel(params.id);
    if (!hostel) throw notFound();
    return { hostel };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `Reserve ${loaderData.hostel.name} — HostelEase` : "Reserve — HostelEase" }],
  }),
  notFoundComponent: () => <div className="p-10 text-center text-sm">Hostel not found.</div>,
  errorComponent: () => <div className="p-10 text-center text-sm text-muted-foreground">Something went wrong.</div>,
  component: Booking,
});

const PROVIDERS = [
  { id: "mtn", name: "MTN MoMo", color: "bg-warning text-warning-foreground", initials: "MTN" },
  { id: "telecel", name: "Telecel Cash", color: "bg-destructive text-destructive-foreground", initials: "TC" },
  { id: "airteltigo", name: "AirtelTigo Money", color: "bg-primary text-primary-foreground", initials: "AT" },
] as const;

function Booking() {
  const { hostel } = Route.useLoaderData();
  const navigate = useNavigate();
  const [step, setStep] = useState<"summary" | "pay" | "done">("summary");
  const [provider, setProvider] = useState<(typeof PROVIDERS)[number]["id"]>("mtn");
  const [phone, setPhone] = useState("");
  const total = hostel.pricePerSemester + hostel.deposit;

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button
          onClick={() => (step === "summary" ? navigate({ to: "/hostel/$id", params: { id: hostel.id } }) : setStep("summary"))}
          className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="font-display text-xl font-semibold">
          {step === "summary" ? "Confirm reservation" : step === "pay" ? "Mobile Money" : "Booked!"}
        </h1>
      </header>

      <div className="px-5 pb-32">
        {step === "summary" && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl bg-card shadow-card">
              <div className="flex gap-3 p-3">
                <img src={hostel.photos[0]} alt={hostel.name} loading="lazy" width={96} height={96} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-semibold">{hostel.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{hostel.area} · {hostel.distanceKm} km</p>
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card p-4 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price breakdown</p>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="Semester rent" value={formatGHS(hostel.pricePerSemester)} />
                <Row label="Refundable deposit" value={formatGHS(hostel.deposit)} />
                <Row label="Service fee" value="GHS 0" muted />
                <div className="my-2 border-t border-border" />
                <Row label="Total due now" value={formatGHS(total)} bold />
              </dl>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-gold/15 p-4 text-sm">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-foreground" />
              <p>Your room is held for <strong>2 hours</strong> after you tap Continue. Complete payment within this window.</p>
            </div>
          </div>
        )}

        {step === "pay" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select your provider and enter the number that will receive the prompt.</p>
            <div className="grid gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border bg-card p-3 text-left transition-all",
                    provider === p.id ? "border-primary ring-2 ring-primary/20" : "border-border",
                  )}
                >
                  <span className={cn("grid h-11 w-11 place-items-center rounded-xl text-[11px] font-bold", p.color)}>{p.initials}</span>
                  <span className="flex-1 text-sm font-semibold">{p.name}</span>
                  <span className={cn("h-5 w-5 rounded-full border-2", provider === p.id ? "border-primary bg-primary" : "border-border")} />
                </button>
              ))}
            </div>
            <label className="block">
              <span className="text-xs font-semibold">Mobile Money number</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="024 123 4567"
                className="mt-1.5 w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <div className="rounded-2xl bg-secondary p-4 text-sm">
              <div className="flex justify-between font-semibold">
                <span>Amount</span>
                <span>{formatGHS(total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">You'll receive a prompt to authorize this payment.</p>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-5 pt-6 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success text-success-foreground">
              <Check className="h-10 w-10" strokeWidth={3} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">You're booked!</h2>
              <p className="mt-2 text-sm text-muted-foreground">A confirmation receipt has been sent to your email and is saved in your bookings.</p>
            </div>
            <div className="rounded-2xl bg-card p-4 text-left shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Receipt</p>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="Hostel" value={hostel.name} />
                <Row label="Reference" value={`HE-${hostel.id.slice(0, 4).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`} />
                <Row label="Paid via" value={PROVIDERS.find((p) => p.id === provider)?.name ?? ""} />
                <Row label="Amount" value={formatGHS(total)} bold />
              </dl>
            </div>
            <div className="space-y-2">
              <Link to="/profile" className="block rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground">View booking</Link>
              <Link to="/" className="block rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold">Back home</Link>
            </div>
          </div>
        )}
      </div>

      {step !== "done" && (
        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-border bg-card/95 px-5 py-3 backdrop-blur safe-bottom">
          <button
            onClick={() => setStep(step === "summary" ? "pay" : "done")}
            disabled={step === "pay" && phone.length < 10}
            className="w-full rounded-2xl bg-gold py-3.5 text-sm font-bold text-gold-foreground shadow-gold transition-transform active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
          >
            {step === "summary" ? `Continue to payment · ${formatGHS(total)}` : `Pay ${formatGHS(total)}`}
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className={cn("text-sm", muted ? "text-muted-foreground" : "")}>{label}</dt>
      <dd className={cn("text-sm", bold && "font-display text-base font-bold", muted && "text-muted-foreground")}>{value}</dd>
    </div>
  );
}
