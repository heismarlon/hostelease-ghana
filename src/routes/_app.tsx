import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MobileMenu } from "@/components/MobileMenu";
import { supabase } from "@/integrations/supabase/client";

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
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        if (typeof window !== "undefined") window.localStorage.setItem("he_signed_in", "1");
        setChecked(true);
      } else {
        navigate({ to: "/auth" });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        if (typeof window !== "undefined") window.localStorage.removeItem("he_signed_in");
        navigate({ to: "/auth" });
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (!checked) return null;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background md:max-w-3xl lg:max-w-5xl">
      {!hideNav && <MobileMenu />}
      <main className={hideNav ? "flex-1" : "flex-1 pt-14 pb-28 md:pb-8"}>
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
