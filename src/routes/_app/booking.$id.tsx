import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Building2, Check, Clock, CreditCard, Download, ShieldCheck, Smartphone } from "lucide-react";
import { formatGHS, getHostel } from "@/lib/hostels";
import { cn } from "@/lib/utils";
import { downloadReceipt, saveReceipt, type Receipt } from "@/lib/receipts";

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

const SERVICE_FEE_RATE = 0.05;

type Method = "momo" | "bank" | "card";

const METHODS: { id: Method; name: string; sub: string; icon: typeof Smartphone }[] = [
  { id: "momo", name: "Mobile Money", sub: "MTN · Telecel · AirtelTigo", icon: Smartphone },
  { id: "bank", name: "Bank account", sub: "GCB, Ecobank, Fidelity & more", icon: Building2 },
  { id: "card", name: "Credit / Debit card", sub: "Visa, Mastercard", icon: CreditCard },
];

const MOMO_PROVIDERS = [
  { id: "mtn", name: "MTN MoMo", color: "bg-warning text-warning-foreground", initials: "MTN" },
  { id: "telecel", name: "Telecel Cash", color: "bg-destructive text-destructive-foreground", initials: "TC" },
  { id: "airteltigo", name: "AirtelTigo Money", color: "bg-primary text-primary-foreground", initials: "AT" },
] as const;


function Booking() {
  const { hostel } = Route.useLoaderData() as { hostel: import("@/lib/hostels").Hostel };
  const navigate = useNavigate();
  const [step, setStep] = useState<"summary" | "pay" | "done">("summary");
  const [method, setMethod] = useState<Method>("momo");
  const [momoProvider, setMomoProvider] = useState<(typeof MOMO_PROVIDERS)[number]["id"]>("mtn");
  const [phone, setPhone] = useState("");
  const [bank, setBank] = useState("GCB Bank");
  const [accountNumber, setAccountNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const subtotal = hostel.pricePerSemester + hostel.deposit;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee;

  const payDisabled =
    (method === "momo" && phone.length < 10) ||
    (method === "bank" && accountNumber.length < 8) ||
    (method === "card" && (cardNumber.length < 12 || cardExpiry.length < 4 || cardCvc.length < 3));

  const methodLabel =
    method === "momo"
      ? MOMO_PROVIDERS.find((p) => p.id === momoProvider)?.name ?? "Mobile Money"
      : method === "bank"
        ? `${bank} • ****${accountNumber.slice(-4)}`
        : `Card ****${cardNumber.slice(-4)}`;

  const receiptRef = useRef<Receipt | null>(null);
  const receipt = useMemo(() => {
    if (receiptRef.current) return receiptRef.current;
    return null;
  }, []);

  const completeBooking = () => {
    const r: Receipt = {
      id: crypto.randomUUID(),
      reference: `HE-${hostel.id.slice(0, 4).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      hostelId: hostel.id,
      hostelName: hostel.name,
      subtotal,
      serviceFee,
      total,
      method: methodLabel,
      status: "Paid",
      createdAt: new Date().toISOString(),
    };
    receiptRef.current = r;
    saveReceipt(r);
    setStep("done");
  };
  void receipt;

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
        <h1 className="font-display text-xl font-bold">
          {step === "summary" ? "Confirm reservation" : step === "pay" ? "Choose payment" : "Booked!"}
        </h1>
      </header>

      <div className="px-5 pb-32">
        {step === "summary" && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl bg-card shadow-card">
              <div className="flex gap-3 p-3">
                <img src={hostel.photos[0]} alt={hostel.name} loading="lazy" width={96} height={96} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-bold">{hostel.name}</p>
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
                <Row label={`HostelEase service fee (${Math.round(SERVICE_FEE_RATE * 100)}%)`} value={formatGHS(serviceFee)} />
                <div className="my-2 border-t border-border" />
                <Row label="Total due now" value={formatGHS(total)} bold />
              </dl>
              <p className="mt-2 text-[11px] text-muted-foreground">
                A {Math.round(SERVICE_FEE_RATE * 100)}% service fee helps us verify listings and keep HostelEase running.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-gold/15 p-4 text-sm">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <p>Your room is held for <strong>2 hours</strong> after you tap Continue. Complete payment within this window.</p>
            </div>
          </div>
        )}

        {step === "pay" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Pick how you'd like to pay.</p>
            <div className="grid gap-2">
              {METHODS.map((m) => {
                const Icon = m.icon;
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border bg-card p-3 text-left transition-all",
                      active ? "border-primary ring-2 ring-primary/20" : "border-border",
                    )}
                  >
                    <span className={cn("grid h-11 w-11 place-items-center rounded-xl", active ? "bg-primary text-primary-foreground" : "bg-secondary text-primary")}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold">{m.name}</span>
                      <span className="block text-[11px] text-muted-foreground">{m.sub}</span>
                    </span>
                    <span className={cn("h-5 w-5 rounded-full border-2", active ? "border-primary bg-primary" : "border-border")} />
                  </button>
                );
              })}
            </div>

            {method === "momo" && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {MOMO_PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setMomoProvider(p.id)}
                      className={cn(
                        "rounded-2xl border bg-card p-2 text-center transition-all",
                        momoProvider === p.id ? "border-primary ring-2 ring-primary/20" : "border-border",
                      )}
                    >
                      <span className={cn("mx-auto grid h-9 w-full place-items-center rounded-xl text-[11px] font-bold", p.color)}>{p.initials}</span>
                      <span className="mt-1 block text-[11px] font-semibold">{p.name}</span>
                    </button>
                  ))}
                </div>
                <Field label="Mobile Money number" value={phone} onChange={setPhone} placeholder="024 123 4567" type="tel" />
              </div>
            )}

            {method === "bank" && (
              <div className="space-y-3">
                <label className="block">
                  <span className="text-xs font-semibold">Bank</span>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    {["GCB Bank", "Ecobank", "Fidelity Bank", "Absa", "Stanbic", "Zenith Bank", "CalBank"].map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </label>
                <Field label="Account number" value={accountNumber} onChange={setAccountNumber} placeholder="1234567890" type="tel" />
              </div>
            )}

            {method === "card" && (
              <div className="space-y-3">
                <Field label="Card number" value={cardNumber} onChange={setCardNumber} placeholder="4242 4242 4242 4242" type="tel" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Expiry" value={cardExpiry} onChange={setCardExpiry} placeholder="MM/YY" />
                  <Field label="CVC" value={cardCvc} onChange={setCardCvc} placeholder="123" type="tel" />
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-secondary p-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatGHS(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Service fee ({Math.round(SERVICE_FEE_RATE * 100)}%)</span>
                <span>{formatGHS(serviceFee)}</span>
              </div>
              <div className="mt-2 flex justify-between font-bold">
                <span>Amount</span>
                <span>{formatGHS(total)}</span>
              </div>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-5 pt-6 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success text-success-foreground">
              <Check className="h-10 w-10" strokeWidth={3} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">You're booked!</h2>
              <p className="mt-2 text-sm text-muted-foreground">A confirmation receipt has been sent to your email and is saved in your bookings.</p>
            </div>
            <div className="rounded-2xl bg-card p-4 text-left shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment receipt</p>
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">Paid</span>
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="Hostel" value={hostel.name} />
                <Row label="Reference" value={`HE-${hostel.id.slice(0, 4).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`} />
                <Row label="Paid via" value={methodLabel} />
                <Row label="Date" value={new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} />
              </dl>
              <div className="my-3 border-t border-dashed border-border" />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Fee breakdown</p>
              <dl className="mt-2 space-y-1.5 text-sm">
                <Row label="Semester rent" value={formatGHS(hostel.pricePerSemester)} muted />
                <Row label="Refundable deposit" value={formatGHS(hostel.deposit)} muted />
                <Row label={`HostelEase service fee (${Math.round(SERVICE_FEE_RATE * 100)}%)`} value={formatGHS(serviceFee)} muted />
                <div className="my-1 border-t border-border" />
                <Row label="Total paid" value={formatGHS(total)} bold />
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
            disabled={step === "pay" && payDisabled}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-gold transition-transform active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
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

function Field({
  label, value, onChange, placeholder, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

