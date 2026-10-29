"use client";

import { AudioLines, Clapperboard, ImagePlus, Music, ScrollText } from "lucide-react";
import { AskAgent, type AgentPrompt } from "./AskAgent";
import { MediaGallery } from "./MediaGallery";
import { MediaJobs } from "./MediaJobs";
import { RecordsSection } from "./RecordsSection";

const PROMPTS: AgentPrompt[] = [
  { label: "Image", hint: "Ads, posts, thumbnails", Icon: ImagePlus, task: "Make an image for me. Ask what it's for and the style I want, then generate it and show it to me." },
  { label: "Video", hint: "Short clips and reels", Icon: Clapperboard, task: "Make a short video for me. Ask what it's for, write the shot list, then generate it." },
  { label: "Music", hint: "Background tracks and jingles", Icon: Music, task: "Make a short music track for me. Ask the mood, length and where it will be used, then generate it." },
  { label: "Script", hint: "Videos, podcasts, voice-overs", Icon: ScrollText, task: "Write a script for me. Ask what it's for, who it's for and how long it should run, then write it." },
  { label: "Text to speech", hint: "A voice-over from your text", Icon: AudioLines, task: "Turn my text into a voice-over. Ask me for the text and the voice I want, then generate the audio." },
];

/** What agents generated (`/models/jobs`), making more, and the gallery of uploaded files. */
export function MediaStudioView() {
  return (
    <div className="grid gap-10">
      <MediaJobs />
      <RecordsSection title="Make something" description="An agent asks what you need, then makes it in the chat.">
        <AskAgent label="Make media" prompts={PROMPTS} />
      </RecordsSection>
      <MediaGallery />
    </div>
  );
}
