"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    const supabase = createClient();

    async function testConnection() {
      const { error } = await supabase.auth.getSession();

      if (error) {
        setStatus(`Connection failed: ${error.message}`);
      } else {
        setStatus("Supabase connected successfully!");
      }
    }

    testConnection();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">{status}</h1>
    </main>
  );
}
