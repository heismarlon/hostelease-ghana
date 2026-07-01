import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, FileText, Receipt as ReceiptIcon } from "lucide-react";
import { downloadReceipt, loadReceipts, type Receipt } from "@/lib/receipts";
import { formatGHS } from "@/lib/hostels";

export const Route = createFileRoute("/_app/receipts")({
  head: () => ({ meta: [{ title: "Receipts — HostelEase" }] }),
  component: ReceiptsPage,
});

function ReceiptsPage() {
  const [items, setItems] = useState<Receipt[]>([]);

  useEffect(() => {
    setItems(loadReceipts());
  }, []);

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="flex items-center gap-3 px-5 pb-4 pt-12">
        <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-card" aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-xl font-bold">Receipts</h1>
      </header>

      <div className="space-y-3 px-5">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-accent text-primary">
              <ReceiptIcon className="h-5 w-5" />
            </div>
            <p className="font-display text-lg font-semibold">No receipts yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Your booking receipts will appear here.</p>
          </div>
        ) : (
          items.map((r) => (
            <article key={r.id} className="rounded-2xl bg-card p-4 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-bold">{r.hostelName}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.reference} · {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Paid via {r.method}</p>
                </div>
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">PAID</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="font-display text-lg font-bold">{formatGHS(r.total)}</span>
                <button
                  onClick={() => downloadReceipt(r)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <Row label="Subtotal" value={formatGHS(r.subtotal)} />
                <Row label="Service fee (1.5%)" value={formatGHS(r.serviceFee)} />
              </div>
            </article>
          ))
        )}

        {items.length === 0 && (
          <Link to="/" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <FileText className="h-4 w-4" /> Browse hostels to book
          </Link>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
