import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";

const HIDE_NAV = ["/onboarding", "/auth", "/booking"];

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const hideNav = HIDE_NAV.some((p) => pathname.startsWith(p));

  useEffect(() => {
    const signedIn = typeof window !== "undefined" && window.localStorage.getItem("he_signed_in") === "1";
    if (!signedIn) {
      navigate({ to: "/auth" });
    } else {
      setChecked(true);
    }
  }, [navigate]);

  if (!checked) return null;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <main className={hideNav ? "flex-1" : "flex-1 pb-24"}>
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
