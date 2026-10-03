import type { Metadata } from "next";
import { SkillsCatalog } from "@/components/skills/SkillsCatalog";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Skills",
  description: "Skills your agents can use, each with a SKILL.md you can preview or download.",
  path: "/agents/workbench/skills",
});

export default function SkillsPage() {
  return <SkillsCatalog />;
}
