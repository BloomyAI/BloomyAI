"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    // Create a new conversation and redirect to it directly
    const newConversationId = Date.now().toString();
    router.push(`/chat/${newConversationId}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-dark-text-secondary">Loading...</div>
    </div>
  );
}
