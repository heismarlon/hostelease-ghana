import { useEffect, useState } from "react";

const KEY = "he_language";

const dict: Record<string, Record<string, string>> = {
  en: {},
  fr: {
    Home: "Accueil",
    Search: "Rechercher",
    Saved: "Favoris",
    Messages: "Messages",
    Profile: "Profil",
    Hi: "Salut",
    Bookings: "Réservations",
    Appearance: "Apparence",
    "Quick actions": "Actions rapides",
    "Sign out": "Se déconnecter",
    Language: "Langue",
    "Personal info": "Infos personnelles",
    Receipts: "Reçus",
    "Saved hostels": "Résidences enregistrées",
    "Payment methods": "Moyens de paiement",
    "Roommate matching": "Colocataires",
    "Refer & earn GHS 20": "Parrainez & gagnez GHS 20",
    Admin: "Admin",
  },
  es: {
    Home: "Inicio",
    Search: "Buscar",
    Saved: "Guardados",
    Messages: "Mensajes",
    Profile: "Perfil",
    Hi: "Hola",
    Bookings: "Reservas",
    Appearance: "Apariencia",
    "Quick actions": "Acciones rápidas",
    "Sign out": "Cerrar sesión",
    Language: "Idioma",
    "Personal info": "Datos personales",
    Receipts: "Recibos",
    "Saved hostels": "Alojamientos guardados",
    "Payment methods": "Métodos de pago",
    "Roommate matching": "Compañeros de cuarto",
    "Refer & earn GHS 20": "Refiere y gana GHS 20",
    Admin: "Admin",
  },
};

export function getLang(): string {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem(KEY) || "en";
}

export function setLang(code: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, code);
  window.dispatchEvent(new Event("he-language-change"));
}

export function t(key: string, lang?: string): string {
  const l = lang || getLang();
  return dict[l]?.[key] ?? key;
}

export function useT() {
  const [lang, setL] = useState<string>(() => getLang());
  useEffect(() => {
    const on = () => setL(getLang());
    window.addEventListener("he-language-change", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("he-language-change", on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return (k: string) => t(k, lang);
}
