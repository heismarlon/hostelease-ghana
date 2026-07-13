import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SubItem = { label: string; to: string; search?: Record<string, string> };
type Item = {
  label: string;
  to?: string;
  children?: SubItem[];
};

const ITEMS: Item[] = [
  {
    label: "Explore Hostels",
    children: [
      { label: "All Areas", to: "/search" },
      { label: "On Campus", to: "/search" },
      { label: "Kwaprow", to: "/search" },
      { label: "Amamoma", to: "/search" },
    ],
  },
  { label: "My Bookings", to: "/receipts" },
  { label: "Saved Hostels", to: "/saved" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Contact Us", to: "/messages" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Body scroll lock
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Escape + focus management
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    // Focus close button on open
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  // Restore focus on close
  useEffect(() => {
    if (!open) openBtnRef.current?.focus?.();
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* Fixed top header */}
      <header
        className="fixed inset-x-0 top-0 z-50 mx-auto flex h-14 max-w-md items-center justify-between px-4 md:max-w-3xl lg:max-w-5xl"
        style={{ backgroundColor: "#1A1F36" }}
      >
        <button
          ref={openBtnRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu-panel"
          className="relative grid h-10 w-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          <Menu
            className={cn(
              "absolute h-5 w-5 transition-all duration-300",
              open ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
            )}
          />
          <X
            className={cn(
              "absolute h-5 w-5 transition-all duration-300",
              open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
            )}
          />
        </button>

        <Link to="/" className="font-display text-lg font-bold text-white">
          HostelEase
        </Link>

        <Link
          to="/search"
          aria-label="Search"
          className="grid h-10 w-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          <Search className="h-5 w-5" />
        </Link>
      </header>

      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Sliding panel */}
      <div
        id="mobile-menu-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className={cn(
          "fixed inset-x-0 top-14 z-40 mx-auto max-w-md overflow-y-auto border-t border-white/20 bg-white/10 text-gray-900 backdrop-blur-[20px] md:max-w-3xl lg:max-w-5xl",
          "h-[calc(100dvh-3.5rem)]",
          "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-[110%] opacity-0",
        )}
        style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
        aria-hidden={!open}
      >
        <nav>
          <ul className="divide-y divide-white/20">
            {ITEMS.map((item) => {
              const hasChildren = !!item.children?.length;
              const isExpanded = expanded === item.label;
              if (hasChildren) {
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : item.label)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between px-6 py-5 text-left text-lg font-semibold text-gray-900 transition-colors hover:bg-white/20"
                    >
                      <span>{item.label}</span>
                      <ChevronRight
                        className={cn(
                          "h-5 w-5 text-gray-600 transition-transform duration-300",
                          isExpanded && "rotate-90",
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid overflow-hidden transition-all duration-300 ease-in-out",
                        isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="min-h-0">
                        <ul className="bg-white/10">
                          {item.children!.map((sub) => (
                            <li key={sub.label}>
                              <Link
                                to={sub.to as "/search"}
                                onClick={close}
                                className="block px-10 py-3 text-base font-normal text-gray-700 transition-colors hover:text-gray-900"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              }
              return (
                <li key={item.label}>
                  <Link
                    to={item.to as "/"}
                    onClick={close}
                    className="block px-6 py-5 text-lg font-semibold text-gray-900 transition-colors hover:bg-white/20"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>


      {/* Close button inside header sits on top; re-render for focus target */}
      <button
        ref={closeBtnRef}
        type="button"
        onClick={close}
        className="sr-only"
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
      >
        Close
      </button>
    </>
  );
}
