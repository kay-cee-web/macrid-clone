import type { Metadata } from "next";
import { SocialView } from "@/components/records/SocialView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Social media",
  description: "Your connected social accounts and everything your agents have posted.",
  path: "/records/social",
});

export default function RecordSocialPage() {
  return <SocialView />;
}
