import { LoginData } from "./types";

const STORAGE_KEY = "parques-login";

export const saveLogin = (data: LoginData) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadLogin = (): LoginData | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LoginData;
  } catch {
    return null;
  }
};

export const clearLogin = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
};
