import { formatGHS, getHostel } from "@/lib/hostels";

export interface Receipt {
  id: string;
  reference: string;
  hostelId: string;
  hostelName: string;
  subtotal: number;
  serviceFee: number;
  total: number;
  method: string;
  status: "Paid";
  createdAt: string; // ISO
}

const KEY = "he_receipts";

export function loadReceipts(): Receipt[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]") as Receipt[];
  } catch {
    return [];
  }
}

export function saveReceipt(r: Receipt) {
  if (typeof window === "undefined") return;
  const all = loadReceipts();
  all.unshift(r);
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function getReceipt(id: string) {
  return loadReceipts().find((r) => r.id === id);
}

export function buildReceiptHtml(r: Receipt): string {
  const h = getHostel(r.hostelId);
  const date = new Date(r.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const rent = h?.pricePerSemester ?? 0;
  const deposit = h?.deposit ?? 0;
  return `<!doctype html><html><head><meta charset="utf-8"/><title>HostelEase Receipt ${r.reference}</title>
<style>
  body{font-family:'Inter',system-ui,sans-serif;max-width:560px;margin:40px auto;padding:32px;color:#121317;}
  h1{font-family:'Baloo 2',sans-serif;margin:0 0 4px;color:#8031CF;}
  .brand{color:#F35622;font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-size:11px;}
  .row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px;}
  .muted{color:#5b5868;}
  .total{font-weight:700;border-top:1px solid #ece8f1;margin-top:8px;padding-top:10px;font-size:16px;}
  .paid{display:inline-block;background:#017A7220;color:#017A72;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:700;}
  .card{border:1px solid #ece8f1;border-radius:16px;padding:20px;margin-top:18px;}
  .foot{margin-top:24px;font-size:11px;color:#5b5868;text-align:center;letter-spacing:.2em;text-transform:uppercase;}
</style></head><body>
<div class="brand">HostelEase · Payment Receipt</div>
<h1>${r.hostelName}</h1>
<span class="paid">PAID</span>
<div class="card">
  <div class="row"><span class="muted">Reference</span><span>${r.reference}</span></div>
  <div class="row"><span class="muted">Date</span><span>${date}</span></div>
  <div class="row"><span class="muted">Payment method</span><span>${r.method}</span></div>
</div>
<div class="card">
  <div class="row"><span class="muted">Semester rent</span><span>${formatGHS(rent)}</span></div>
  <div class="row"><span class="muted">Refundable deposit</span><span>${formatGHS(deposit)}</span></div>
  <div class="row"><span class="muted">Service fee (5%)</span><span>${formatGHS(r.serviceFee)}</span></div>
  <div class="row total"><span>Total paid</span><span>${formatGHS(r.total)}</span></div>
</div>
<p class="foot">Stay easy · HostelEase Ghana</p>
</body></html>`;
}

export function downloadReceipt(r: Receipt) {
  const blob = new Blob([buildReceiptHtml(r)], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `HostelEase-${r.reference}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
