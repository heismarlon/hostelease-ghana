import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import onboardImg from "@/assets/onboard-1.jpg";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome to HostelEase" }] }),
  component: Onboarding,
});

const SLIDES = [
  { title: "Find verified hostels", body: "Every listing on HostelEase is checked by our team before it goes live." },
  { title: "Compare in seconds", body: "Shortlist 2-3 hostels and see prices, distance and amenities side by side." },
  { title: "Pay with Mobile Money", body: "Reserve your room and pay with MTN MoMo, Telecel Cash or AirtelTigo Money." },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const last = i === SLIDES.length - 1;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <div className="flex justify-end px-5 pt-10">
        <Link to="/auth" className="text-xs font-semibold text-muted-foreground">Skip</Link>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="relative mb-8 aspect-square w-72 max-w-full overflow-hidden rounded-[2.5rem] bg-secondary">
          <img src={onboardImg} alt="" width={896} height={896} className="h-full w-full object-cover" />
        </div>
        <h1 className="font-display text-3xl font-semibold leading-tight">{SLIDES[i].title}</h1>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">{SLIDES[i].body}</p>
      </div>
      <div className="space-y-5 px-8 pb-10">
        <div className="flex justify-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-1.5 bg-border"}`} />
          ))}
        </div>
        <button
          onClick={() => (last ? navigate({ to: "/auth" }) : setI(i + 1))}
          className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          {last ? "Get started" : "Next"}
        </button>
      </div>
    </div>
  );
}
