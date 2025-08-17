"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finishLogin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/favorites")
      } else {
        router.push("/")
      }
    }

    finishLogin();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-32">
      Signing you in...
    </div>
  );
}