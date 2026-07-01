import jsPDF from "jspdf";
import { formatGHS, getHostel } from "@/lib/hostels";

export interface Receipt {
  id: string;
  reference: string;
  hostelId: string;
  hostelName: string;
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  academicYear: string;
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

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export function downloadReceipt(r: Receipt) {
  const h = getHostel(r.hostelId);
  const rent = h?.pricePerSemester ?? 0;
  const deposit = h?.deposit ?? 0;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  let y = 56;

  // Brand bar
  doc.setFillColor(243, 86, 34); // brand orange
  doc.rect(0, 0, W, 8, "F");

  // Header
  doc.setTextColor(243, 86, 34);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("HOSTELEASE · PAYMENT RECEIPT", 40, y);

  y += 28;
  doc.setTextColor(128, 49, 207); // brand purple
  doc.setFontSize(22);
  doc.text(r.hostelName, 40, y);

  y += 18;
  doc.setTextColor(1, 122, 114); // teal
  doc.setFontSize(10);
  doc.text("PAID", 40, y);

  // Booking details card
  y += 26;
  doc.setDrawColor(236, 232, 241);
  doc.setLineWidth(0.8);
  doc.roundedRect(40, y, W - 80, 130, 10, 10);
  let cy = y + 24;
  const left = 56;
  const right = W - 56;
  doc.setTextColor(91, 88, 104);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const detailRow = (label: string, value: string) => {
    doc.setTextColor(91, 88, 104);
    doc.text(label, left, cy);
    doc.setTextColor(18, 19, 23);
    doc.text(value, right, cy, { align: "right" });
    cy += 20;
  };

  detailRow("Reference", r.reference);
  detailRow("Issued", fmtDate(r.createdAt));
  detailRow("Check-in", fmtDate(r.checkIn));
  detailRow("Check-out", fmtDate(r.checkOut));
  detailRow("Academic year", r.academicYear);
  detailRow("Payment method", r.method);

  // Fee breakdown card
  y = cy + 16;
  doc.roundedRect(40, y, W - 80, 130, 10, 10);
  cy = y + 24;

  const feeRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(bold ? 18 : 91, bold ? 19 : 88, bold ? 23 : 104);
    doc.text(label, left, cy);
    doc.setTextColor(18, 19, 23);
    doc.text(value, right, cy, { align: "right" });
    cy += 20;
  };

  doc.setFont("helvetica", "bold");
  doc.setTextColor(128, 49, 207);
  doc.text("Fee breakdown", left, cy);
  cy += 20;

  feeRow("Semester rent", formatGHS(rent));
  feeRow("Refundable deposit", formatGHS(deposit));
  feeRow("Service fee (1.5%)", formatGHS(r.serviceFee));

  // divider
  doc.setDrawColor(236, 232, 241);
  doc.line(left, cy - 8, right, cy - 8);
  feeRow("Total paid", formatGHS(r.total), true);

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(91, 88, 104);
  doc.text("Stay easy · HostelEase Ghana", W / 2, 800, { align: "center" });

  doc.save(`HostelEase-${r.reference}.pdf`);
}
