import { useEffect, useState } from "react";
import { HOSTELS as BASE, type Hostel } from "./hostels";

const HIDE_KEY = "he_admin_hidden";
const ADD_KEY = "he_admin_added";
const EVT = "he-hostels-change";

function read<T>(k: string, fb: T): T {
  if (typeof window === "undefined") return fb;
  try {
    const raw = window.localStorage.getItem(k);
    if (!raw) return fb;
    return JSON.parse(raw) as T;
  } catch {
    return fb;
  }
}

function write(k: string, v: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new Event(EVT));
}

export function getAllHostels(): Hostel[] {
  const added = read<Hostel[]>(ADD_KEY, []);
  const hidden = read<string[]>(HIDE_KEY, []);
  return [...BASE, ...added].filter((h) => !hidden.includes(h.id));
}

export function getHiddenIds(): string[] {
  return read<string[]>(HIDE_KEY, []);
}

export function getAddedHostels(): Hostel[] {
  return read<Hostel[]>(ADD_KEY, []);
}

export function toggleHidden(id: string) {
  const hidden = read<string[]>(HIDE_KEY, []);
  const next = hidden.includes(id) ? hidden.filter((x) => x !== id) : [...hidden, id];
  write(HIDE_KEY, next);
}

export function addHostel(h: Hostel) {
  const added = read<Hostel[]>(ADD_KEY, []);
  write(ADD_KEY, [...added, h]);
}

export function removeAdded(id: string) {
  const added = read<Hostel[]>(ADD_KEY, []);
  write(ADD_KEY, added.filter((h) => h.id !== id));
}

export function useHostels(): Hostel[] {
  const [list, setList] = useState<Hostel[]>(() => getAllHostels());
  useEffect(() => {
    const on = () => setList(getAllHostels());
    window.addEventListener(EVT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVT, on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return list;
}

export function useIsAdmin(): boolean {
  const [admin, setAdmin] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("he_role") === "admin";
  });
  useEffect(() => {
    const on = () => setAdmin(window.localStorage.getItem("he_role") === "admin");
    window.addEventListener("he-role-change", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("he-role-change", on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return admin;
}
