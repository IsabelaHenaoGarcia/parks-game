"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginCard } from "@/components/game/LoginCard";
import { saveLogin } from "@/components/game/useLoginSession";
import { LoginData } from "@/components/game/types";
import { joinGame } from "@/lib/backend";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: LoginData) => {
    setError("");
    setLoading(true);
    try {
      await joinGame(data);
      saveLogin(data);
      router.push("/tablero");
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo entrar a la partida";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return <LoginCard onLogin={handleLogin} loading={loading} error={error} />;
}
