import { useCallback, useEffect, useState } from "react";

const KEY = "he_saved_hostels";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function emit() {
  window.dispatchEvent(new Event("he-saved-change"));
}

export function useSavedHostels() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(read());
    const onChange = () => setIds(read());
    window.addEventListener("he-saved-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("he-saved-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const current = read();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    window.localStorage.setItem(KEY, JSON.stringify(next));
    emit();
  }, []);

  const isSaved = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, isSaved };
}
