import type { Metadata } from "next";
import { MediaStudioView } from "@/components/records/MediaStudioView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Media studio",
  description: "Make images, video, music, scripts and voice-overs, and see everything made.",
  path: "/records/media",
});

export default function RecordMediaPage() {
  return <MediaStudioView />;
}
