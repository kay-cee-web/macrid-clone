import { PLATFORMS } from "@/data/platforms";
import { skillName } from "@/data/skills";
import type { Skill, SkillDoc } from "@/types/skill";

const bullets = (lines: string[]) => lines.map((line) => `- ${line}`);
const numbered = (lines: string[]) => lines.map((line, i) => `${i + 1}. ${line}`);

const section = (heading: string, body: string[]) => ["", `## ${heading}`, "", ...body];

/**
 * The YAML header of a SKILL.md. Kept apart from the body because a `---`
 * line straight after text is a heading underline in Markdown, so rendering
 * the header as Markdown would turn the whole block into one big title.
 */
export const skillFrontmatter = (skill: Skill) => [
  "---",
  `name: ${skillName(skill)}`,
  `description: ${skill.description}`,
  `surface: ${skill.surface}`,
  "---",
];

/** Everything under the header: the part that is meant to be rendered. */
export function skillBody(skill: Skill, doc: SkillDoc | null): string {
  const needs = (skill.platforms ?? []).map((id) => PLATFORMS[id].name);

  return [
    `# ${skillName(skill)}`,
    ...section("Overview", [skill.description]),
    ...(doc ? section("Use cases", bullets(doc.useCases)) : []),
    ...(doc ? section("How it runs", numbered(doc.steps)) : []),
    ...(doc ? section("What you get back", [doc.output]) : []),
    ...(needs.length ? section("Needs connected", bullets(needs)) : []),
    ...section("How to use it", [
      `Type \`/${skill.slug}\` in the chat, or press **Use in chat** to put it in the composer.`,
      "",
      "Add the specifics after it — the list, the area, the period — and the agent does the rest.",
    ]),
  ].join("\n");
}

/** The whole file, as the download writes it. */
export const skillMarkdown = (skill: Skill, doc: SkillDoc | null) =>
  `${[...skillFrontmatter(skill), "", skillBody(skill, doc)].join("\n")}\n`;
