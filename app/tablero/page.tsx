"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ParquesApp } from "@/components/game/ParquesApp";
import { loadLogin } from "@/components/game/useLoginSession";
import { LoginData } from "@/components/game/types";

export default function TableroPage() {
  const router = useRouter();
  const [loginData] = useState<LoginData | null>(() => loadLogin());

  useEffect(() => {
    if (!loginData) router.replace("/login");
  }, [loginData, router]);

  if (!loginData) return null;

  return <ParquesApp initialLoginData={loginData} />;
}
