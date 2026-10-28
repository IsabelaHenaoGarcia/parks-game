import { LoginData } from "@/components/game/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function joinGame(data: LoginData) {
  const res = await fetch(`${API_BASE}/games/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ player: data.username, color: data.color }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body?.detail || "No se pudo unir a la partida";
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }

  return res.json();
}
