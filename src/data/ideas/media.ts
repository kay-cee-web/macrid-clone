import type { Idea } from "@/types/idea";

/**
 * Video, podcast and press work. The agent writes everything around the media
 * today — scripts, show notes, descriptions, pitches — but no tool makes or
 * edits images, audio or video, and none uploads to YouTube, so those wait.
 */
export const MEDIA: Idea[] = [
  {
    title: "Video script",
    ready: true,
    platforms: [],
    description: "When I give you a topic, write a short video script: the hook, the beats, on-screen text and the call to action.",
  },
  {
    title: "Podcast show notes",
    ready: true,
    platforms: [],
    description: "When I share an episode transcript, write the show notes, a chapter list and three lines worth quoting.",
  },
  {
    title: "YouTube description pack",
    ready: true,
    platforms: [],
    description: "When I share a video's transcript, write title options, the description, chapters and tags.",
  },
  {
    title: "Press pitch",
    ready: true,
    platforms: ["email"],
    description: "When I have news, find the angle, write a short pitch, and email it to the journalists on my press list once I approve.",
  },
  {
    title: "Media kit",
    ready: true,
    platforms: [],
    description: "From my site and my best results, write a one-page media kit: who I am, my audience, the numbers and what I speak on.",
  },
  {
    title: "Captions from a transcript",
    ready: true,
    platforms: [],
    description: "When I share a transcript, clean it into short, readable caption lines with the filler words taken out.",
  },
  {
    title: "Podcast guest pitches",
    platforms: ["email"],
    description: "Every week, find podcasts in my niche that take guests and email each host a short pitch that fits their show.",
  },
  {
    title: "Press mentions watch",
    platforms: [],
    description: "Every week, look for new articles and posts that mention my brand and sum up what they said.",
  },
  {
    title: "Thumbnails and covers",
    blocked: "an image tool for agents",
    platforms: [],
    description: "When a video or episode is ready, make the thumbnail and cover art in my colours and sizes.",
  },
  {
    title: "Clips from a long video",
    blocked: "a video tool for agents",
    platforms: [],
    description: "When I upload a long video, cut its strongest moments into short vertical clips with captions.",
  },
  {
    title: "Upload to YouTube",
    blocked: "a way to upload to YouTube",
    platforms: ["youtube"],
    description: "When a video and its description are ready, upload it to my channel at the time I pick.",
  },
];
