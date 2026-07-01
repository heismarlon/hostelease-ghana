import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Globe } from "lucide-react";

export const Route = createFileRoute("/_app/language")({
  head: () => ({ meta: [{ title: "Language — HostelEase" }] }),
  component: LanguagePage,
});

const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "tw", name: "Twi", native: "Twi (Akan)" },
  { code: "fa", name: "Fante", native: "Mfantse" },
  { code: "ee", name: "Ewe", native: "Eʋegbe" },
  { code: "ga", name: "Ga", native: "Gã" },
  { code: "ha", name: "Hausa", native: "Hausa" },
  { code: "da", name: "Dagbani", native: "Dagbanli" },
  { code: "fr", name: "French", native: "Français" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "pt", name: "Portuguese", native: "Português" },
];

const KEY = "he_language";

function LanguagePage() {
  const [selected, setSelected] = useState("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSelected(window.localStorage.getItem(KEY) ?? "en");
  }, []);

  const choose = (code: string) => {
    setSelected(code);
    if (typeof window !== "undefined") window.localStorage.setItem(KEY, code);
  };

  return (
    <div className="pb-6">
      <header className="bg-hero-gradient px-5 pb-6 pt-12 text-white">
        <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-primary-foreground/90">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15">
            <Globe className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold">Language</h1>
            <p className="text-xs text-primary-foreground/80">Pick the language HostelEase uses across the app.</p>
          </div>
        </div>
      </header>

      <section className="mt-4 px-5">
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          {LANGUAGES.map((lang, i) => {
            const active = selected === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => choose(lang.code)}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${i > 0 ? "border-t border-border" : ""}`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent font-display text-xs font-bold text-primary">
                  {lang.code.toUpperCase()}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{lang.name}</span>
                  <span className="block text-[11px] text-muted-foreground">{lang.native}</span>
                </span>
                {active && (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Full translations for local languages are rolling out gradually. Your preference is saved on this device.
        </p>
      </section>
    </div>
  );
}
