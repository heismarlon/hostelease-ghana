import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Heart, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS: ReadonlyArray<{ to: string; label: string; icon: typeof Home; exact?: boolean }> = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/search", label: "Search", icon: Search },
  { to: "/saved", label: "Saved", icon: Heart },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 pb-[calc(env(safe-area-inset-bottom)+8px)]"
      aria-label="Primary"
    >
      <div
        className="overflow-hidden rounded-full border border-white/15 bg-[#0A1F44]/75 backdrop-blur-[20px]"
        style={{ boxShadow: "0 -4px 30px rgba(0,0,0,0.18)" }}
      >
        <ul className="grid grid-cols-5">
          {TABS.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to as "/"}
                  className={cn(
                    "group relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-all duration-200 ease-out active:scale-90",
                    active ? "text-white" : "text-white/80 hover:text-white",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 place-items-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-active:scale-125",
                      active ? "scale-110 -translate-y-0.5" : "scale-100",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[20px] w-[20px] transition-all duration-200",
                        active && "drop-shadow-[0_2px_6px_rgba(255,215,0,0.5)]",
                      )}
                      strokeWidth={active ? 2.6 : 2}
                    />
                  </span>
                  <span className="transition-opacity duration-200">{label}</span>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute bottom-1 h-1 w-6 rounded-full bg-gold animate-scale-in"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
