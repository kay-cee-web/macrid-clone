/**
 * The agent's first message, in ten wordings of the same shape: a two-line
 * heading, what it does, where its work shows up, how to steer it, a closing.
 * `[records]`, `[instructions]` and `[plugins]` become links when drawn.
 */
export type AgentGreeting = {
  hello: (name: string) => string;
  title: string;
  paragraphs: string[];
  closing: string;
};

export const GREETINGS: AgentGreeting[] = [
  {
    hello: (name) => `Hi ${name} 👋`,
    title: "welcome to your new agent",
    paragraphs: [
      "I do the work, not just describe it. Hand me a task — finding customers, drafting and sending a campaign, checking how one did, booking a meeting — and I'll carry it out with the tools in your workspace.",
      "Everything I create shows up in [records], and each reply lists what changed, so you can always check my work.",
      "You can also tell me how you'd like to work together. Change my [instructions], connect your tools in [plugins], set up scheduled work, or ask for something else entirely.",
    ],
    closing: "Pick one of the suggestions to get going, or tell me what you want me to do.",
  },
  {
    hello: (name) => `Hello ${name} 👋`,
    title: "I'm ready when you are",
    paragraphs: [
      "Give me a job and I'll get on with it — build a lead list, write the follow-up, send it, and tell you how it went.",
      "Whatever I make lands in [records], and every reply ends with a list of what I changed.",
      "If you want me to work differently, edit my [instructions] or connect more tools in [plugins]. I can also run things on a schedule.",
    ],
    closing: "Start with a suggestion below, or just tell me what you need.",
  },
  {
    hello: (name) => `Hey ${name} 👋`,
    title: "let's get some work off your plate",
    paragraphs: [
      "I'm here to take on the tasks you'd otherwise click through yourself: research, outreach, follow-ups, bookings and reports.",
      "You can see everything I've done in [records], and I'll say what changed after each task.",
      "Tell me how you like things done by changing my [instructions], and give me more reach by connecting tools in [plugins].",
    ],
    closing: "Choose a suggestion to begin, or describe the job in your own words.",
  },
  {
    hello: (name) => `Welcome, ${name} 👋`,
    title: "your new agent is set up",
    paragraphs: [
      "Think of me as a teammate who acts. Ask for a list of prospects, a campaign, a summary of how things are going — I'll do it, not just plan it.",
      "My work is saved where you can find it, in [records], and each reply shows exactly what I touched.",
      "My [instructions] say how I should work, and you can change them any time. Connect the services I should use in [plugins].",
    ],
    closing: "Try one of the suggestions, or tell me where to start.",
  },
  {
    hello: (name) => `Hi ${name} 👋`,
    title: "what are we working on?",
    paragraphs: [
      "I can find leads, write and send messages, keep your calendar moving and report back on results, all from this chat.",
      "Check on me any time: the lists, leads, tasks and campaigns I make appear in [records], and every reply says what changed.",
      "Want a different tone, a stricter rule or a regular routine? Update my [instructions], or connect another tool in [plugins].",
    ],
    closing: "Pick a suggestion, or give me your first task.",
  },
  {
    hello: (name) => `Good to meet you, ${name} 👋`,
    title: "I'm your new agent",
    paragraphs: [
      "Tell me what needs doing and I'll take it from there — sourcing contacts, drafting copy, sending it out, or pulling the numbers together.",
      "Nothing I do is hidden. You'll find it in [records], and I'll list the changes under each reply.",
      "You decide how I work. Adjust my [instructions], connect your accounts in [plugins], or ask me to run something on a schedule.",
    ],
    closing: "Use a suggestion to start, or tell me what's on your list.",
  },
  {
    hello: (name) => `Hi ${name} 👋`,
    title: "ready to get started",
    paragraphs: [
      "Hand me the jobs that eat your day. I'll research, write, send and follow up using the tools your workspace already has.",
      "Each reply ends with what I changed, and the full record lives in [records].",
      "Shape how I work through my [instructions], and connect more of your tools in [plugins] so I can do more on my own.",
    ],
    closing: "Start with one of these, or tell me what you'd like done.",
  },
  {
    hello: (name) => `Hello ${name} 👋`,
    title: "let's put me to work",
    paragraphs: [
      "Ask me a question or give me a task. I'll answer directly, or do the work — build the list, send the message, book the call.",
      "You'll always know what happened: changes are listed under each reply and saved in [records].",
      "Tell me how you'd like to work together. My [instructions] can change at any time, and [plugins] is where you connect your tools.",
    ],
    closing: "Pick a suggestion below, or tell me what you need first.",
  },
  {
    hello: (name) => `Hey ${name} 👋`,
    title: "glad you're here",
    paragraphs: [
      "I'm built to do the work, start to finish — whether that's finding the right people, writing to them, or keeping track of what came back.",
      "What I create is kept in [records], and every reply sums up what changed so you can check it at a glance.",
      "Change my [instructions] to set the rules I follow, and connect your tools in [plugins] to widen what I can do.",
    ],
    closing: "Choose a suggestion, or tell me what we're working on today.",
  },
  {
    hello: (name) => `Welcome aboard, ${name} 👋`,
    title: "I'm all yours",
    paragraphs: [
      "Give me a goal and I'll break it down and get it done: prospecting, outreach, scheduling, reporting, or something else entirely.",
      "Every task leaves a trail in [records], and I'll spell out what changed each time I reply.",
      "Fine-tune me through my [instructions], or connect the services I should use in [plugins]. I can run routines on a schedule too.",
    ],
    closing: "Pick one of the suggestions to get going, or tell me what to do.",
  },
];

/** The same agent always gets the same greeting; different agents get different ones. */
export function greetingFor(seed: string): AgentGreeting {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return GREETINGS[hash % GREETINGS.length];
}
