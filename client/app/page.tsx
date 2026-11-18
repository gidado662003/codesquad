"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getToken() ? "/tasks" : "/login");
  }, [router]);

  return (
    <p className="p-8 text-stone-500">Opening the task app…</p>
  );
}
