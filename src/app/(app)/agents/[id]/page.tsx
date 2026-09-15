import { Suspense } from "react";
import { ChatView } from "@/components/chat/ChatView";

export default function AgentChatPage() {
  return (
    <Suspense>
      <ChatView />
    </Suspense>
  );
}
