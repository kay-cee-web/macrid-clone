import type { Metadata } from "next";
import { SkillsCatalog } from "@/components/skills/SkillsCatalog";

export const metadata: Metadata = { title: "Skills" };

export default function SkillsPage() {
  return <SkillsCatalog />;
}
