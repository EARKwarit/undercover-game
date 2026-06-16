"use client";

// Stable per-device identity stored in localStorage.
export function getPlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("uc_pid");
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `p_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    localStorage.setItem("uc_pid", id);
  }
  return id;
}

export function getStoredName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("uc_name") || "";
}

export function setStoredName(name: string) {
  if (typeof window !== "undefined") localStorage.setItem("uc_name", name);
}
