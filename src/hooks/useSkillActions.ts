"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { docFor } from "@/data/skills";
import { downloadText } from "@/lib/download";
import { skillMarkdown } from "@/lib/skills/markdown";
import type { Skill } from "@/types/skill";

/** Preview state and the SKILL.md download, shared by the hub and the plugins tab. */
export function useSkillActions() {
  const [previewing, setPreviewing] = useState<Skill | null>(null);

  const download = useCallback((skill: Skill) => {
    try {
      downloadText(`${skill.slug}.md`, skillMarkdown(skill, docFor(skill.slug)));
    } catch {
      toast.error("Could not start the download.");
    }
  }, []);

  return {
    previewing,
    preview: setPreviewing,
    closePreview: useCallback(() => setPreviewing(null), []),
    download,
  };
}
