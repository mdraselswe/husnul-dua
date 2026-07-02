"use client";

// Tracks a visitor's own submissions in localStorage so they can view/edit
// their pending duas without an account.
export interface MyDua {
  id: string;
  editToken: string;
  title: string;
  at: number;
}

const KEY = "hd_my_duas";

export function getMyDuas(): MyDua[] {
  if (typeof window === "undefined") return [];
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addMyDua(d: MyDua) {
  const list = getMyDuas().filter((x) => x.id !== d.id);
  list.unshift(d);
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 100)));
  } catch {
    /* ignore */
  }
}

export function tokenFor(id: string): string | undefined {
  return getMyDuas().find((d) => d.id === id)?.editToken;
}
