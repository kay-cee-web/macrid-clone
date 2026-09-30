import type { Metadata } from "next";
import { MeetingsTab } from "@/components/workspace/MeetingsTab";

export const metadata: Metadata = { title: "Meetings" };

export default function AgentMeetingsPage() {
  return <MeetingsTab />;
}
