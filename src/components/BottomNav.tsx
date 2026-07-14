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
        className="overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-[20px]"
        style={{ boxShadow: "0 -4px 30px rgba(0,0,0,0.08)" }}
      >
        <ul className="grid grid-cols-5">
          {TABS.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to as "/"}
                  className={cn(
                    "relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-all duration-200 ease-out",
                    active ? "text-[#0A1F44]" : "text-neutral-600 hover:text-neutral-800",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 place-items-center transition-transform duration-200 ease-out",
                      active && "scale-110",
                    )}
                  >
                    <Icon className="h-[20px] w-[20px]" strokeWidth={active ? 2.5 : 2} />
                  </span>
                  <span className="transition-opacity duration-200">

                    {label}
                  </span>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute bottom-1 h-1 w-6 rounded-full bg-[#0A1F44]"
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
