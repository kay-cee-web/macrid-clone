<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

## File length: 150 lines max

- No code file may exceed **150 lines**. This covers components, pages, hooks, utils, services, types and styles. Documentation (`.md`) is exempt.
- If a file is approaching the limit, split it before adding more: extract subcomponents, custom hooks, helpers, or constants into their own files.

## Reusability

- Write code to be reused. Before creating something new, check whether an existing component, hook, or util already does it, and extend that instead of duplicating it.
- Build UI from small, generic, prop-driven components (buttons, inputs, cards, modals, tables) in a shared `components/ui` layer. Feature components compose these.
- Keep API calls in a shared service layer (one place per resource), never inline `fetch` calls inside components.
- Put shared logic in custom hooks and pure helpers in `lib/`/`utils/`. Put shared types in `types/`.
- No hard-coded values that repeat: use constants, config, or design tokens.

## Conventions

- **Toasts:** always use **sonner**. Call `toast.success/error/warning/message` imported from `sonner`. The themed `<Toaster>` (`src/components/ui/Toaster.tsx`) is mounted once in the root providers. Don't build other alert or notification systems.
- **Colours:** use token utilities only (`bg-surface`, `text-muted`, `border-line`, `bg-accent`, `text-good`, …), defined in `src/app/globals.css`. Never use raw hex values or Tailwind palette colours (`zinc-500`) in components.
- **Fonts:** `font-display` (Bricolage Grotesque) for headings only, `font-sans` (Geist) for the interface, `font-mono` (Geist Mono) for machine values (codes, IDs, counts, model names).
- **Folders (under `src/`):**
  - `components/ui` for the generic kit, `components/<feature>` for feature pieces, and `components/providers` for context providers.
  - `services` for API calls (one file per resource), `lib` for helpers, `hooks` for hooks, `types` for shared types.
- **API calls:** go through `api` from `src/lib/api/client.ts`. Check every response with `assertEnvelope` and turn errors into text with `extractApiError` (both in `src/lib/api/errors.ts`).

# Project purpose

This is a rebuild of the **Agents** section of Macrid, a marketing and sales platform.

- **Backend:** it calls the **same endpoints** as Macrid, so behaviour stays the same. Do not invent new endpoints; the contract is below.
- **Design:** the UI does not copy Macrid. It should be finer, more modern and more polished.
- **Light and dark mode are required.** Every component must work in both. Use theme tokens (CSS variables) instead of hard-coded colours, and never ship a component that has only been checked in one theme.
- **Auth:** the clone has its **own Login page** (and registration) that uses Macrid's auth endpoints (`POST /login`, `POST /register`, `GET /user`, `POST /logout`). It does not share a session with the main Macrid app.

**The goal is for agents to do the tasks people currently do by hand in the Macrid app.** Instead of clicking through Prospect Finder, Outreach, CRM and the rest, the user tells an agent what to do and the agent does it. Keep this in mind when designing any feature: each Macrid app area is something an agent should be able to operate.

## Macrid app areas agents should cover

These are folders under `Macrid/app/(dashboard)/`, and they match the agent categories:

| Category | Macrid area | Examples of manual work today |
|---|---|---|
| Prospecting | `prospect_finder` | Search for leads (Google Places, LinkedIn sources) |
| Funnels | `funnel-campaign` (ai-funnel-builder, templates, domain-setup, statistics) | Build funnels and landing pages |
| Outreach | `multi-channel-outreach` (email, sms, whatsapp) | Send campaigns and follow-ups |
| CRM | `crm` (leads, deals, companies, lists, tasks, appointment, mail, team) | Manage the pipeline, tasks and appointments |
| Deliverability | `email-deliverability-check` | Check email health |
| Analytics | `analytics` | Read and report on performance |
| Business | `ai-content-generator`, `white-label`, `settings` | Content, branding, account |

# Macrid reference (so you don't have to scan it again)

The original codebase is the sibling folder `../Macrid` (Next 16.0.7, JavaScript). The agents section is in `Macrid/app/(dashboard)/agents/`. The API layer is in `agents/_data/agentsApi.js` and `agents/_data/channelsApi.js`. Shared helpers are in `Macrid/lib/axios.js`, `lib/connectionsApi.js` and `lib/connectors.js`.

This clone uses TypeScript, a `src/` folder and Next 16.3.5.

## Backend basics

- **Base URL:** `process.env.NEXT_PUBLIC_API_URL` (Laravel API). Default headers are JSON (`Content-Type` and `Accept: application/json`).
- **Auth:**
  - `POST /login {email, password}` returns the token in `token`, `access_token` or `data.token`.
  - The token is stored in `localStorage` under `token` and sent as `Authorization: Bearer <token>`.
  - `GET /user` returns the current user. `POST /logout` logs out. `POST /register` creates an account.
- **401 handling (axios interceptor):**
  - `/login`, `/register` and `/logout` are skipped.
  - If `error` contains "run out of token", show an "upgrade your plan" warning and do **not** log the user out.
  - Log out only when `message` is exactly "Unauthenticated.". Before redirecting to `/login`, save the current path to `localStorage.redirectAfterLogin`.
- **A 200 can still be a failure.** Always check the body: `{status: false}` or `{success: false}` means it failed, and the reason is in `errors`.
- **Error text, in order of priority:**
  1. A plain string body
  2. The first message in `errors` (Laravel validation, `{field: [msg]}`)
  3. `error` (app-level, e.g. token exhaustion)
  4. `message`
  5. `"<fallback> (HTTP <status>)"`
- **Laravel types:** ids are numbers, so convert them to strings in the client, because they are used as URL segments and React keys. Booleans may arrive as `0`/`1`, so coerce them.

## Agent endpoints (all confirmed against the live API)

| Method and path | Body | Response |
|---|---|---|
| `GET /agents` | – | `{status, agents: [row]}`. Not paginated. Ordered newest-created first. |
| `POST /agents` | `{name?, instructions?, model?, is_active?, sending_enabled?}` | `{status, message: "New agent was created.", agent: row}` |
| `GET /agents/{id}` | – | `{status, agent: row, stats: {messages, actions_total, sent_last_24h, blocked_last_24h, last_action_at}}` |
| `PUT /agents/{id}` | Only the changed fields (allowlist above) | `{status, message: "Agent updated.", agent: row}` |
| `DELETE /agents/{id}` | – | `{status, message}` |
| `POST /agents/{id}/chat` | `{message, conversation_id?}` | `{status, reply, instructions_updated: bool, instructions: string\|null}` |
| `GET /agents/{id}/messages` | – | `{status, messages: [{id, role: "user"\|"assistant", content, created_at}]}`. Oldest first, whole thread, not paginated. |
| `GET /agents/{id}/actions` | – | `{status, actions: []}`. An activity log of what the agent did. It has always come back empty, so the row shape is unknown. |
| `POST /agents/{id}/sending` | `{enabled: bool}` (required; 422 without it) | `{status, message: "X has stopped sending. It can still research and draft.", agent: row}` |

**Agent row:** `{id, user_id, tenant_id, name, instructions, model, is_active, sending_enabled, created_at, updated_at}`.

**Agent quirks:**
- **The brief is `instructions`.** Macrid's UI calls it "description". Sending `description` is silently dropped.
- **There is no `category` or `favorite` column.** `PUT {favorite: true}` returns 200 but discards the value. Hide favourites until the backend adds the column.
- **Create from a task:** Macrid posts only `{instructions: task}` and the backend names the agent.
- **`POST /chat` can rewrite the agent's own instructions.** When `instructions_updated` is true, update the local agent with the new `instructions` and do **not** send a PUT, because the backend has already saved it.
- **No real reply field besides `reply`.** `message` in a response is the status line, never the reply.
- **Chat has no attachment field.** Upload images to `/gallery` first, then append their URLs to the message text. Macrid appends: `"\n\nAttached images (already hosted, open these URLs to view them):\n- name: url"`.
- **History is per agent, not per conversation.** `conversation_id` doesn't split history.
- **One request per chat turn.** No streaming, SSE or polling.
- **Sort order:** Macrid re-sorts the list by `updated_at` for "Recents". Sort options on the catalog are: edited, created, name A–Z, name Z–A.
- **`sending` is a kill switch, not a send button.** It sets `sending_enabled`; a stopped agent still researches and drafts. Show it beside "active" in settings, together with `stats.blocked_last_24h`.

## Channel endpoints (WhatsApp, Telegram, browser extension)

`{provider}` is `whatsapp`, `telegram` or `extension`. The agent id goes in the path, never in the body.

| Method and path | Body | Response |
|---|---|---|
| `POST /agents/{id}/{provider}/connect` | none | A pairing code (details below) |
| `GET /agents/{id}/{provider}/status` | – | `{connected: bool, channels: [{id, status: "pending"\|"active"\|…, label, number, last_message_at}]}` |
| `DELETE /agents/{id}/{provider}/{channelId}` | – | `{status, message: "WhatsApp disconnected."}`. Also deletes a pending row. |

**Connect responses:**
- **whatsapp:** `{code: "2CPQDL", number: "+17653965227", expires_in: 900, instructions: "Send this message to +1…: LINK 2CPQDL"}`
- **telegram:** `{code, bot: "MacridAgentBot", expires_in: 900, deep_link: "https://t.me/MacridAgentBot?start=CODE", instructions}`
- **extension:** `{code, expires_in: 900, instructions: "Open the Macrid extension and enter this code…"}`

**Pairing flow:**
1. The message the user sends is `LINK <CODE>`. The webhook matches on the word "LINK".
2. There is no WhatsApp deep link from the backend; build `https://wa.me/<digits>?text=LINK%20CODE`.
3. Show the code with a QR code of the shortcut link and a 15-minute countdown, and offer a new code when it expires.
4. **Reset the countdown for every new code.** Macrid has a bug where it doesn't.
5. The link completes on the backend through a webhook, so the client has no callback. Poll `status` with backoff (2s, then 5s, then 10s) until the code expires, and stop once `connected` is true.

**Status quirks:**
- **Asking for a code creates a `pending` row immediately.** A row existing does not mean the channel is linked; only rows in states other than pending, expired, revoked, failed or disconnected count.
- **`number` arrives masked** (`••••••••••2736`). Treat it as a label only, never as a dialable number.
- **One agent can have several channel rows.** Disconnect works per row, by id.

**Not ours to call:** `/connectors/whatsapp/webhook`, `/connectors/telegram/webhook`, `/connectors/extension/pair`, `/connectors/extension/capture` and `/connectors/extension/chat` are called by the providers and the extension.

**SMS and email channels** are listed in the Macrid UI, but there are no routes for them yet.

## Workspace connections (Plugins screen)

Connections belong to the user's workspace, not to one agent.

- **Read:**
  - `GET /connectors` (the newer route; may 404). If it fails, fall back to `GET /integrations`.
  - `GET /platform-apis` holds AI keys and Google Places, which `/connectors` does not report.
- **OAuth:**
  1. Open a blank popup inside the click handler, before any `await`, or the popup blocker will stop it.
  2. `GET <connector.connect>` (e.g. `/connectors/google/redirect?service=gmail`, `/connectors/outlook/redirect`) returns `{auth_url}`.
  3. Point the popup at that URL, then read connections again.
- **API key:**
  - `POST /connectors/{key}/api-key` with only the credential fields, on the newer route.
  - Otherwise `POST /integrations {service, ...fields, status: "1"}` on the legacy route.
  - Keys stored in `platform_apis` always go to `POST /platform-apis`.
- **Disconnect:**
  - `DELETE /connectors/{key}` on the newer route, or `DELETE /integrations/{recordId}` on the legacy route.
  - For `platform_apis`, `POST /platform-apis` with that provider's fields set to empty strings.
- **Search quota:** `GET /places/search-usage` (fallback `/search-usage`).
- **Connector catalogue** (names, logos, auth type, fields, connect route): copy it from `Macrid/lib/connectors.js`.

## Media upload (chat attachments)

- `POST /gallery` as multipart form data, field `file`. Set `Content-Type: multipart/form-data` yourself, because the default JSON header breaks the upload.
- Returns `image_url`, `image_name`, and so on.
- Macrid allows at most 4 images per message.

## Macrid screens (what to rebuild)

- **`/agents` (Home):**
  - A composer: type a task (with dictation and image attach), and it creates an agent, then redirects to `/agents/{id}?c=<conversationId>&intro=1&task=…&img=…`.
  - Below it, idea cards grouped by category. Clicking a card fills the composer.
- **`/agents/all`:** search, sort, grid/list toggle, Create agent. Each agent has a menu with rename, clone ("<name> copy"), copy ID and delete (confirm first).
- **`/agents/[id]` (chat workspace):**
  - Side panel: new conversation, Chat, Workflows, Plugins, Customize, Channels, plus invite, what's new and feedback.
  - An empty-state greeting and suggestion chips.
  - Each message has copy and read-aloud buttons.
  - URL parameters: `?task=` fills the draft, `?send=1` sends it automatically, `?img=` attaches images.
- **`/agents/[id]/workflows`:** idea cards. "Send to chat" opens the chat with `?task=<description>&send=1`.
- **`/agents/[id]/plugins`:** a Connectors tab (connections above) and a Skills tab. Skills are static data today; "activate" drafts `/<slug>` in the chat.
- **Settings modal:**
  - **General:** model, clone, delete. Add the `sending` switch here.
  - **Personalization:** name and instructions, saved with PUT.
  - **Channels:** the pairing flow above.
  - **Sharing, Security, Usage, Developer:** placeholders today. Use `stats` from `GET /agents/{id}` for usage and activity.

**Static data to port** from `Macrid/app/(dashboard)/agents/_data/`:
- `ideas.js` (categories and task ideas)
- `skills.js`, `platforms.js`, `surfaces.js`
- `greetings.js`, `intro.js` (the first message for a new agent, built on the client)

**UI with no backend yet (keep it local or hide it):** model choice, voice, memory, sharing, security, webhooks, folders, favourites, feedback, skill upload, connector requests, the conversations list.

## Macrid bugs not to repeat

- Clear the agents store on logout; Macrid can show the previous user's agents.
- Confirm before deleting.
- Keep attached images when creating an agent fails.
- Remove the appended "Attached images…" block from user messages when showing history.
- Render agent replies as markdown; Macrid shows plain text.
- Await clipboard writes and handle failures before showing "Copied".
