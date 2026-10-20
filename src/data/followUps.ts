import {
  BarChart3,
  CalendarDays,
  CalendarPlus,
  Clock,
  CopyCheck,
  Filter,
  Inbox,
  ListChecks,
  MailCheck,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { Suggestion } from "@/types/suggestion";

/**
 * What to offer under a reply, by what its turn was about. Every line is
 * something the agent's own tools can do (score_leads, check_email_copy,
 * pipeline_summary…), so a pick never asks for work it can't finish.
 * Earlier topics win when a turn touches several.
 */
export const FOLLOW_UPS: [RegExp, Suggestion[]][] = [
  [/\b(leads?|prospects?|contacts?|lists?)\b/i, [
    { label: "Score these leads", text: "Score the leads we just talked about and tell me which are worth contacting first.", Icon: Target },
    { label: "Check for duplicates", text: "Check my leads for duplicates and tell me what you'd merge.", Icon: CopyCheck },
  ]],
  [/\b(e-?mails?|campaigns?|newsletters?|outreach)\b/i, [
    { label: "Check the copy before it goes out", text: "Check the email copy for spam triggers and anything that could hurt deliverability.", Icon: MailCheck },
    { label: "How did my last campaign do?", text: "How did my most recent campaign perform? Give me opens, clicks and anything that stands out.", Icon: BarChart3 },
  ]],
  [/\b(inbox|unread|replies|replied)\b/i, [
    { label: "Summarise my unread email", text: "Read my inbox and summarise the unread messages that need a reply.", Icon: Inbox },
  ]],
  [/\b(calendar|appointments?|meetings?|book(ed|ing)?)\b/i, [
    { label: "What's on my calendar this week?", text: "List my appointments for the rest of this week.", Icon: CalendarDays },
    { label: "Book a follow-up", text: "Book a follow-up appointment for this. Ask me anything you need to know first.", Icon: CalendarPlus },
  ]],
  [/\b(tasks?|to-?dos?|follow[- ]?ups?)\b/i, [
    { label: "What's still open?", text: "List my open tasks, most urgent first.", Icon: ListChecks },
  ]],
  [/\b(deals?|pipeline|stages?|closing)\b/i, [
    { label: "Summarise my pipeline", text: "Give me a summary of my pipeline: deals by stage, value, and what's stuck.", Icon: TrendingUp },
  ]],
  [/\b(funnels?|landing pages?|pages?)\b/i, [
    { label: "How are my pages doing?", text: "List my funnels and tell me how each one is performing.", Icon: Filter },
  ]],
  [/\b(every (day|week|monday|morning)|weekly|daily|schedul\w*|automat\w*)\b/i, [
    { label: "Show my scheduled work", text: "List the automations you have scheduled for me.", Icon: Clock },
  ]],
  [/\b(payments?|revenue|sales|invoices?|refunds?|stripe|paypal)\b/i, [
    { label: "How much came in this month?", text: "How much revenue came in this month so far, and how does it compare with last month?", Icon: Wallet },
  ]],
];
