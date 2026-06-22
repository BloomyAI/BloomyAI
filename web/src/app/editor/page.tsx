"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditorPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/editor/list");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#1E222B] flex items-center justify-center">
      <div className="text-white/60">Loading...</div>
    </div>
  );
}
