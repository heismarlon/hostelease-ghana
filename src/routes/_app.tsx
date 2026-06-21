import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";

const HIDE_NAV = ["/onboarding", "/auth", "/booking"];

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideNav = HIDE_NAV.some((p) => pathname.startsWith(p));

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <main className={hideNav ? "flex-1" : "flex-1 pb-24"}>
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
