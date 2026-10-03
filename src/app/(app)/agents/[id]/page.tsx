import type { Metadata } from "next";
import { Suspense } from "react";
import { ChatView } from "@/components/chat/ChatView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Chat",
  description: "Chat with your agent and see what it changed in your records after every reply.",
});

export default function AgentChatPage() {
  return (
    <Suspense>
      <ChatView />
    </Suspense>
  );
}
