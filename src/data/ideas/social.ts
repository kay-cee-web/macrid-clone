import type { Idea } from "@/types/idea";

/**
 * Writing and publishing posts. The agent can draft today, but no tool posts to
 * a network yet, so every workflow that publishes is blocked on its connector.
 */
export const SOCIAL: Idea[] = [
  {
    title: "Post drafts in my voice",
    ready: true,
    platforms: [],
    description: "When I share an idea, write it as a LinkedIn post, an X thread and an Instagram caption, ready to paste.",
  },
  {
    title: "Monthly content calendar",
    ready: true,
    platforms: [],
    description: "At the start of each month, plan the month's posts per network: themes, dates, hooks and formats.",
  },
  {
    title: "Publish to LinkedIn",
    blocked: "a way to post to LinkedIn",
    platforms: ["linkedin"],
    description: "When I approve a draft, post it to my LinkedIn profile or company page at the time I pick.",
  },
  {
    title: "Post to X",
    blocked: "a way to post to X",
    platforms: ["x"],
    description: "When I give you an update, write it as a post or a thread that fits the limit and publish it once I approve.",
  },
  {
    title: "Instagram post",
    blocked: "a way to post to Instagram",
    platforms: ["instagram"],
    description: "When I share a photo and the point of it, write the caption and hashtags and publish it to my business account.",
  },
  {
    title: "TikTok upload",
    blocked: "a way to post to TikTok",
    platforms: ["tiktok"],
    description: "When I share a short video, write the caption and hashtags and post it to my TikTok account.",
  },
  {
    title: "Facebook page post",
    blocked: "a way to post to Facebook",
    platforms: ["facebook"],
    description: "When I approve a post, publish it to my Facebook page and tell me about the first comments.",
  },
  {
    title: "Telegram channel update",
    blocked: "a way to post to Telegram",
    platforms: ["telegram"],
    description: "When something ships, write the announcement and post it to my Telegram channel.",
  },
  {
    title: "Cross-post everywhere",
    blocked: "social publishing connectors",
    platforms: ["linkedin", "x", "instagram", "facebook"],
    description: "When I write one post, adapt it to each network's length and tone and publish them all at once.",
  },
  {
    title: "Publish the week's posts",
    blocked: "social publishing connectors",
    platforms: ["linkedin", "x", "instagram"],
    description: "Every Monday, draft the week's posts, and once I approve them, publish each one at its best time.",
  },
  {
    title: "Social performance recap",
    blocked: "social publishing connectors",
    platforms: ["linkedin", "x", "instagram", "tiktok"],
    description: "Every Friday, read the week's post stats, say what worked and suggest next week's angles.",
  },
];
