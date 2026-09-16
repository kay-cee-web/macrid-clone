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

## Clone architecture (reuse these; don't rebuild them)

- **Auth:**
  - `AuthProvider` + `useAuth()` for the session.
  - `<AuthGate mode="guest|user|unverified">` handles every auth redirect.
  - Signing out emits the `logout` event (`src/lib/auth/events.ts`).
- **Agents data:**
  - `src/services/agents.ts` and `src/services/chat.ts` hold the API calls.
  - The shared store is `src/lib/agents/store.ts`, read with `useAgents()` / `useAgent(id)`. It resets on logout.
  - Change agents only through `src/lib/agents/actions.ts`: create, update, setSending, delete, clone, startConversation, leaveAgent, mergeAgentLocally. Updates show immediately and roll back if the request fails.
  - `src/lib/agents/attachments.ts` appends image URLs for chat and splits them back out of history.
- **Static data:** idea catalogue in `src/data/ideas` (`ideasFor`, `readinessOf`); platform chips in `src/data/platforms.ts`.
- **Shared agent UI:** `TaskComposer` (also meant for the chat composer), `AgentAvatar`, `AgentCard`, `AgentActionsMenu` + `AgentDialogs` (mount the dialogs once per page), `WorkReceipt`, `IdeaCard`/`IdeaBrowser`.
- **Layout:** `AppShell` (sidebar and mobile drawer) wraps every signed-in route (`/agents/*`, `/records/*`). `<main>` is the scroll container, so full-height views use `h-full`. `HairlineGrid` lays out card grids separated by 1px lines.
- **Agent workspace:**
  - `/agents/[id]/layout.tsx` renders `AgentWorkspace`: it loads the agent and shows the header (tabs Chat and Workflows, New conversation, Instructions, actions menu).
  - Views read the open agent with `useWorkspace()` and open the editor with `openInstructions()`.
  - Add new tabs (Plugins, Settings) to `WorkspaceHeader`.
- **Chat:**
  - `useChat(agentId)` handles history, sending, retry, and instruction rewrites (merged locally). There is one thread per agent.
  - `ChatView` reads the URL options: `?task=` draft, `?img=` staged images, `?send=1` sends automatically once history has loaded. There is no `?c=`.
  - **New conversation = copy the agent.** The backend has no endpoint for separate conversations, so `useNewConversation` → `startConversation` creates a copy named `<name> clone <n>` (`src/lib/agents/copyName.ts`: the next free number, counted from the original name, so a clone of "X clone 1" becomes "X clone 2") with the same instructions, model, `is_active` and `sending_enabled`, then opens `/agents/{copyId}`. Earlier conversations stay on the earlier agents (in Recents and All agents).
    - Channels (WhatsApp, Telegram, extension), history and stats stay on the original agent; they are not copied.
    - `src/lib/agents/fresh.ts` tracks copies that haven't been used yet. Clicking New conversation on one opens it again instead of copying again. Leaving it (`AgentWorkspace` unmount → `leaveAgent`) deletes it quietly.
    - A copy counts as used after it sends a message, is edited (`updateAgent`, `setSending`) or starts a channel pairing. Only this tab's memory tracks this, so a reload keeps the copy as a normal agent.
  - **Work receipts** (`src/lib/records/receipts.ts`): `/actions` is always empty, so `useChat` reads Records before and after each turn (`snapshot.ts`) and compares them (`diff.ts`). The changes show as a `TurnReceipt` (built on `WorkReceipt`) under the reply, failed turns included, and each line links to its Records page.
    - A snapshot covers lists (lead counts come from `contacts_count`, not from reading every lead), deals, tasks, appointments, email, SMS and WhatsApp campaigns, and funnels. A read that fails is skipped, so it never shows up as "deleted".
    - A snapshot under 60s old is reused as the next turn's "before". If the "before" reads take longer than 4s, the turn gets no receipt rather than holding the message back.
    - Changes made elsewhere during the turn show up too, and the receipt says so. Receipts exist only for turns sent in this session; they are gone after a reload.
  - **Tokens:** `sendChatMessage` returns `usage` (`tokens_charged`, `tokens_remaining`, `using_own_key`). `TurnUsage` shows the cost beside the reply's time. `src/lib/tokens/balance.ts` (`useTokenBalance`) keeps the last known balance for `TokenBalance` in the workspace header; there is no balance endpoint, so nothing shows before the first reply. A failed turn that ran out of tokens (`isTokenExhausted`) gets an "Upgrade plan" link to Macrid's `/settings/plans`.
  - `linkRecordMentions` (`src/lib/records/mentions.ts`) turns "list ID 168" in replies into a link to `/records/lists/168`. `ui/Markdown` opens in-app (`/…`) links in the same tab.
  - `ComposerWithAttachments` = `TaskComposer` + gallery image uploads (`useAttachments`, max 4 images, 5 MB each).
  - Agent replies render with `ui/Markdown`.
  - **Above the composer:**
    - `SetupNotice` warns while the draft names a platform with nothing connected (`platformsMentioned` + `missingIn`), or asks to send while the agent's sending is off. It never blocks the send.
    - `ApprovalBar` offers Send / Don't send / Ask for changes when "Ask before sending" is on and the last reply asks for a go-ahead (`asksForApproval`).
- **Workspace setup** (`src/lib/setup/`): `setupFrom(connections)` gives each platform one of `ready | shared | missing | unknown`.
  - email: SMTP, Gmail or Outlook connected. sms: `shared` without Twilio (Macrid's system sender, `smssender_id: 1`).
  - google_maps: `shared` without the user's own Places key. google_business: needs GBP.
  - whatsapp, linkedin and facebook are `unknown`: no endpoint reports them, and `unknown` never blocks.
  - `useWorkspaceSetup()` reads it through a shared store (5 min cache). `ConnectorsPanel` primes the store with every fresh read.
  - `readinessOf(idea, setup)`: `blocked` → "Not available"; `ready` missing → "Partly" (the tools can't do every step); a needed platform missing → "Connect X"; otherwise "Ready".
- **Ask before sending** (`src/lib/agents/approval.ts`): there is no approval queue, so `ApprovalSetting` writes an `[Approval rule]…[/Approval rule]` block into the instructions.
  - The block says: show the draft, the recipients and the checks, then wait for "send".
  - The switch reads its state back from the text, because a chat turn can rewrite the instructions.
- **Scheduled work:** there is no automations endpoint, so `ScheduledWork` (top of Workflows) asks the agent to list, create or cancel automations in chat. Its tools do the work.
- **Settings** (`/agents/[id]/settings?section=general|channels|usage&channel=…`):
  - **General:** the sending switch with its 24h counts, "Ask before sending", model (`PUT model`), agent ID, clone and delete.
  - **Channels:** `useChannelConnection` (status check, pairing code, backoff polling, disconnect) + `PairingCard`. Mount the card with `key={code}` so each code gets a fresh countdown.
  - **Usage:** stats and the `/actions` log.
  - Build sections from `SettingsSection` + `SettingRow`.
- **Plugins** (`/agents/[id]/plugins?tab=connectors|skills`):
  - **Connectors:** catalogue in `src/data/connectors`; API in `src/services/connections.ts` (read `/connectors`, fall back to `/integrations`, plus `/platform-apis`; writes go to the routes of whichever read answered); OAuth via `useOAuthPopup`; key forms built from each connector's field list in `ApiKeyModal`.
  - **Senders** (`src/services/senders.ts`) are set up in the clone:
    - SMTP (`store: "mail_accounts"`): `POST /mail-accounts` with `port` as a number and encryption `TLS|SSL|None`.
    - Twilio (`store: "sms_senders"`): `POST /sms-senders {sid, auth_token, sender}`.
    - These can hold several senders, so their cards offer "Add another" and "Manage" (in Macrid) instead of Disconnect. `/mail-accounts` and `/sms-senders` override whatever `/connectors` says about them.
  - **`POST /platform-apis` replaces the whole row** (the Places key and every AI key). `savePlatformKeys` reads the row first and sends it all back with only the changed fields.
  - **External connectors** (WhatsApp Business via Meta, Facebook) link out to the Macrid app at `NEXT_PUBLIC_MACRID_APP_URL` (default `https://app.macrid.com`).
  - **Skills:** static data in `src/data/skills`; "Use in chat" drafts `/slug`.
  - `ConfirmModal` is the shared "are you sure?" dialog.
- **Records** (`/records/lists|lists/[listId]|leads|companies|deals|tasks|appointments|campaigns?channel=email|sms|whatsapp|campaigns/sms/[id]|funnels|funnels/[slug]|analytics`):
  - A read-only view of workspace data, so users can see what agents created. `/agents/{id}/actions` stays empty even after tool use, so these endpoints are the only source.
  - Services: `lists`, `leads`, `companies`, `deals`, `tasks`, `appointments`, `campaigns` (email, SMS + logs, WhatsApp), `funnels` (one file per resource). Normalisers are in `src/lib/records/`, and status labels and tones in `status.ts`.
  - **Leads:** every lead, with its list and a status filter. **SMS campaigns:** each row opens its delivery log.
  - **Funnels:** a row opens its stats and latest events; the view accepts a slug or an id.
  - **Analytics** (`src/lib/records/analytics.ts`) is computed in the browser from campaign rows and `/sms-logs`, over a 7/30/90-day or all-time range. `ui/StatGrid` draws the KPI tiles.
  - Rows are sorted newest first (`newestFirst`). Paginated endpoints go through `fetchAllPages` (`src/lib/api/paginate.ts`).
  - Build each view from `RecordsView` (search, refresh, loading/error/empty states) + `ui/DataTable` (columns, `rowHref` makes the whole row a link) + the cell helpers in `records/cells.tsx`.
- **Layout:** `(app)/layout.tsx` = `AuthGate` + `AppShell` for every signed-in section. `ui/RouteTabs` renders link tabs (the agent header and Records).
- **Generic hooks:** `useAsync(load, deps)` for read-only requests (`refreshing` is true during `reload()`), `useClipboard`, `useCountdown`. The UI kit also has `Switch`, `Select` (native) and `QrCode`. Response helpers (`pickList`, `pickOne`, `toBool`, `toText`, `toNumber`) are in `src/lib/api/pick.ts`.

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
| `POST /agents/{id}/chat` | `{message, conversation_id?}` | `{status, reply, instructions_updated: bool, instructions: string\|null, tokens_charged, tokens_remaining, using_own_key: bool}` |
| `GET /agents/{id}/messages` | – | `{status, messages: [{id, role: "user"\|"assistant", content, created_at}]}`. Oldest first, whole thread, not paginated. |
| `GET /agents/{id}/actions` | – | `{status, actions: []}`. An activity log of what the agent did. It stays empty and `stats.actions_total` stays 0 even after `create_list`/`add_to_list` (tested 2026-09-15), so the row shape is unknown. |
| `POST /agents/{id}/sending` | `{enabled: bool}` (required; 422 without it) | `{status, message: "X has stopped sending. It can still research and draft.", agent: row}` |

**Agent row:** `{id, user_id, tenant_id, name, instructions, model, is_active, sending_enabled, created_at, updated_at}`.

**Agent quirks:**
- **The brief is `instructions`.** Macrid's UI calls it "description". Sending `description` is silently dropped.
- **There is no `category` or `favorite` column.** `PUT {favorite: true}` returns 200 but discards the value. Hide favourites until the backend adds the column.
- **Create from a task:** Macrid posts only `{instructions: task}` and the backend names the agent.
- **`POST /chat` can rewrite the agent's own instructions.** When `instructions_updated` is true, update the local agent with the new `instructions` and do **not** send a PUT, because the backend has already saved it.
- **No real reply field besides `reply`.** `message` in a response is the status line, never the reply.
- **Chat has no attachment field.** Upload images to `/gallery` first, then append their URLs to the message text. Macrid appends: `"\n\nAttached images (already hosted, open these URLs to view them):\n- name: url"`.
- **History is per agent, not per conversation.** `conversation_id` doesn't split history, and no endpoint lists or loads past conversations, so every message is added to the end of one thread. The clone doesn't send `conversation_id`; "New conversation" copies the agent instead (see Chat above).
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

**UI with no backend yet (keep it local or hide it):** model choice, voice, memory, sharing, security, webhooks, folders, favourites, feedback, skill upload, connector requests, the conversations list (in the clone, past conversations are the earlier copies of the agent).

## Agent tools (backend, confirmed 2026-09-15)

The agent runs **server-side with real tools**, so it does the CRM and outreach work itself. The clone only sends chat turns and never calls the CRM or outreach endpoints below. An agent listed its tools when asked:

- **Records:** search_leads, read_lead, search_contacts, search_companies, create_lead, update_lead_status, update_record, delete_records, find_duplicates, merge_duplicates, score_leads
- **Lists:** list_lists, create_list, add_to_list
- **Pipeline:** list_deals, create_deal, move_deal_stage, pipeline_summary
- **Tasks and calendar:** create_task, list_tasks, complete_task, list_calendar_events, book_appointment, list_appointments, reschedule_appointment
- **Outreach:** send_email, send_sms, send_whatsapp, list_mail_accounts, verify_emails, check_sending_domain, check_email_copy, list_campaigns, campaign_recipients, campaign_performance, read_inbox
- **Prospecting and funnels:** find_prospects, list_funnels, create_funnel, update_funnel
- **Automation and account:** schedule_automation, list_automations, cancel_automation, plan_usage, check_connections

Chat turns cost tokens: `tokens_charged` and `tokens_remaining` come back on every reply, and `using_own_key` is true when the user's own AI key paid for it. `sending_enabled` very likely blocks the send_* tools (inferred from the switch's message, not tested).

## CRM and outreach (what agents operate)

Read from Macrid's frontend; the backend itself was not read. The agent reaches these through its tools above. The endpoints show what each action does and what receipts could show.

**Base URL:** `https://api.macrid.com/api/macrid-userend`. The public booking routes (`/book/...`) sit one level up, at `/api`, with no auth.

### CRM

**Lists**
- `GET /lists` returns `{lists:[{id,name,description,contacts_count}]}`.
- `POST /lists` and `PUT /lists/{id}` take `{name, description}`. Delete with `DELETE /lists/{id}`.
- Bulk delete: `POST /lists/bulk-delete {ids:[…]}`.

**Leads**
- `GET /leads?page&per_page&list&status&leadsource&country` returns a paginator at `data`.
  - **`search` is ignored**, so Macrid fetches `per_page=1000` and filters in the browser.
- Fields returned: `id, first_name, last_name, email, phone, website, address, city, country, lead_status, score, track_code, list_id`.
- Create one: `POST /leads {list_id, name, email, website, phone, city, lead_status}` (sends `name`, not `first_name`).
- Update: `PUT /leads/{id}` (same body without `name`); moving to another list is `PUT {list_id}`.
- Import: `POST /multiple-leads {list_id, leads:[{email, first_name, phone, website, city, lead_status:"not_contacted"}]}`. Prospect Finder and the deliverability check also save leads this way.
- Bulk delete: `DELETE /bulk-delete-leads` with body `{ids:"1,2,3"}` (a comma-separated string).
- `lead_status` casing is mixed (`ACTIVE`, `CONTACTED`, `CLOSED`, `not_contacted`, `booked`), so normalise it before comparing.
- Export to an email platform: `POST /ar-export {service, data:[{name,email}]}`.

**Companies**
- `GET /companies?page` returns `{companies, teams}`. Macrid's code treats `companies` as both a plain array and a paginator, so `fetchCompanies` accepts either. Rows: `id, name, industry, type, email, domain, city, state, owner, owner_name, created_at`.
- `POST /companies` and `PUT /companies/{id}` take `{name, email, domain, owner, industry, type, status (PROSPECT|CLIENT|PARTNER), city, state, postal_code, num_employee, annual_revenue, time_zone, description, linkedin_company_page}`.
- Bulk delete: `DELETE /bulk-delete-companies {ids:"1,2"}`.
- Companies are **not** linked by id to leads or deals.

**Deals**
- `GET /deals` returns `data.deals`.
- `POST /deals` and `PUT /deals/{id}` take `{name, owner, contact (lead id), company (free text), pipeline, industry, type, priority, stage, amount, item, close_date, source, next_action, next_action_date, note, status}`.
- Move stage: `POST /update-deal-stage {id, stage}`.
- **Stages are fixed in the frontend:** Prospecting, Qualification, Proposal, Negotiation, Closing Won, Closing Lost.
- `GET /deal-details/{id}` returns `{deal, dealcampaigns, tasks, teams, contacts, companies, mailAccounts}`.
- Email from a deal: `POST /deal-send-email {emailto, emailsubject, emailbody, dealId}` (uses Gmail).

**Tasks**
- `GET /tasks` returns `{tasks:[{id,name,type,priority,deal_id,start_date,end_date,status,note}]}`.
- **Write names differ from read names:** `POST /tasks` and `PUT /tasks/{id}` take `{dealId, taskname, taskstart_date, taskend_date, tasktype, taskpriority, tasknote, status}`.
- Every task needs a deal.
- Allowed values:
  - type: Task, Email, Meeting, Call, Follow-up, Other
  - priority: Low, Medium, High, Urgent
  - status: Pending, In Progress, Completed, Cancelled

**Appointments** (Macrid code: `crm/appointment/_lib/`)
- `GET /appointments?when=all|upcoming&page`.
- `POST /appointments {title, start_at (ISO with offset), duration_minutes|end_at, timezone, attendee_name/email/phone, lead_id, deal_id, location, meeting_url, allow_overlap}`.
  - A clash returns 409 with `conflict`; resend with `allow_overlap:true` to book anyway.
- `POST /appointments/{id}/status {status: pending|confirmed|completed|cancelled|no_show, reason?}`.
- `GET /appointments/availability?date&duration_minutes`.
- Calendar sync: `POST /appointments/{id}/sync` and `POST /appointments/sync-all` (25 per call).
- Public booking: `GET /book/{track_code}/slots` and `POST /book/{track_code}`.
- **Backend bug:** the time offset on `start_at` is dropped, so appointments are stored an hour late (see `APPOINTMENTS-API-ISSUES.md`).

**Inbox** (Gmail only)
- `GET /emails` returns the messages grouped by mailbox, with `nextPageToken`.
- Send: `POST /emails/send {emailto, emailsubject, emailbody}`. Reply: `POST /emails/reply/{id}`.
- When Google needs re-authorising, get the link from `GET /google/auth-url`.

**Team**
- `GET /teams`; `POST /teams {name, username, email, role}`.
- `role` is accepted but not stored yet. There is no invite email.

### Funnels

- `GET /funnel-campaigns` returns rows at `data`: `id, slug, name, format, status (1 = published), created_at, custom_domain, temp_url, funnelcampaign_url`. The list has no view or click counts.
- **Public URL** comes from the backend: landing pages use `custom_domain`, falling back to `temp_url` (`*.macridsites.com`); other formats use `funnelcampaign_url`. Add `https://` when it's missing.
- `GET /funnel-campaign-events/{slug}/stats` returns flat fields: `views, clicks, unique_visitors, views_change, clicks_change, visitors_change, conversion_change, campaign_name`. CTR is computed in the browser.
- `GET /funnel-campaign-events?slug&per_page&page[&action=view|click][&from&to]` returns a paginator at `data`. Rows: `action, country, city, browser, os, device_type, referrer, created_at`.
- Publish: `POST /funnel-campaigns/publish {slug}` and `/unpublish {slug}`. Delete: `DELETE /funnel-campaigns/{id}`.

### Automations

- **No endpoint lists, creates or cancels automations.** Only the agent's tools (`schedule_automation`, `list_automations`, `cancel_automation`) reach them. Scheduling otherwise exists only as a field on a send (email `schedule_datetime`, SMS `datetime`).

### Email outreach

**Senders (SMTP)**
- `GET /mail-accounts` (rows at `data`); `POST /mail-accounts` and `PUT /mail-accounts/{id}` take `{host, port (number), username, password, encryption_type (TLS|SSL|None), senderemail, sendername}`.
- **Delete is on a different path:** `DELETE /email-accounts/{id}`, bulk `POST /email-accounts/bulk-delete {ids}`.
- There is no verify or test-connection endpoint.

**Simple campaign**
- `POST /email-campaigns` (multipart) with `{subject, body (HTML), mailaccount_id, schedule_datetime ('' = now), list_id + lead_ids[] | recipients[] (emails)}`. Sends immediately or schedules.

**Editor campaign**
- Create: `POST /email-campaigns/store-create-from-template {email_html}` returns `{campaign:{slug}}`.
- Save: `POST /email-campaigns/update-template {slug, body}`.
- Send: `POST /email-campaigns/update-send-template {mailaccount_id, subject, slug, body, status:'4', recipientDetails: manually|existing, list, schedule_datetime}`.
- Test send: `POST /email-campaign/send-test-email-to-user` (note the singular `email-campaign`).

**Merge tags** (single braces): `{username} {fullname} {email} {company} {date} {unsubscribe}`.

**AI drafting**
- `POST /email-campaigns/generate-email-subject` or `/generate-email-body` with `{prompt_type, description, email_type}`.
- `email_type` is one of `cold_email|follow_up|welcome|promotional|newsletter|announcement|transactional`.

**Stats**
- `GET /email-campaigns` returns rows with `open_rate, click_rate, clicks, unsubscribers, status (sent|pending|scheduled|draft|failed)`.
- There are no endpoints for sequences, follow-ups or reply tracking.
- **There are no `/analytics/*` endpoints.** Macrid's analytics pages compute everything in the browser from `/email-campaigns`, `/sms-campaigns` + `/sms-logs`, and the WhatsApp campaigns list (its WhatsApp analytics page is empty).

**Deliverability check**
- `POST /verify-emails {emails:[…]}` (batches of 10) returns `{results:[{email, status: valid|invalid|unknown, risk, tags}]}`.
- It is **not** part of the send flow, so an agent should run it before sending.

### SMS (Twilio, user's own credentials)

**Senders**
- `GET /sms-senders` (rows `{id, sid, sender, status ("1" = active), messages_count}`); `POST /sms-senders {sid, auth_token, sender}`; `DELETE /sms-senders/{id}`.
- **Bug:** `PUT` sends camelCase `authToken`, which doesn't match the create call.
- Without a sender of your own, SMS still goes out on Macrid's system sender (`smssender_id: 1`).

**Send**
- `POST /send-sms {message (≤1000), contacts:[+E.164 numbers], type, smssender_id (1 = system sender), sender_name (≤11), datetime (null = now)}`.
- There is no `list_id`: Macrid loads `/leads?list=` and sends the phone numbers.
- There are no merge tags.

**Templates, history, balance**
- Templates: `GET /sms-templates`; `POST /sms-templates {name, message, type}` (the templates screen in Macrid's UI is broken).
- History:
  - `GET /sms-campaigns`
  - `GET /sms-logs`
  - `GET /sms-logs/sms-campaign-id?smscampaign_id=` returns `{to, status: delivered|pending|failed, error_message, cost, datetime}` (an array, or at `logs`/`data`)
  - `GET /sms-logs` rows carry `smscampaign_id`, which the analytics use to match logs to campaigns.
- Balance: `GET /sms-balance` (may not exist).

### WhatsApp outreach

- **Connect:** Meta embedded signup, then `POST /whatsapp/fetch-phones {access_token}`, then `POST /whatsapp/connect {waba_id, phone_number_id, phone_number, display_name, access_token}`.
  - **No endpoint reports whether WhatsApp Business is connected.** Macrid only checks `localStorage.macrid_wa_connection`, so the clone treats it as unknown.
- **Broadcasts:** Macrid lists them at `GET "/whatsapp.campaigns"` (with a dot, params `from`/`to`); the detail route is `GET /whatsapp/campaigns/{id}`. The clone tries the dot path first, then the slash on a 404.
  - Row fields have had two names each: `total_recipients|recipients, sent_count|successful, delivered_count, read_count|read, replied_count|replied, failed_count|failed, scheduled_at|started_at`.
- **Templates:** `GET /whatsapp/templates` (use only `APPROVED` ones).
- **Send:**
  - `POST /whatsapp/send-bulk {mode: text|template, content, leads:[{id, name, phone, vars}]}` returns `{sent, failed, errors}`; `{{name}}` and `{{business}}` work in `content`.
  - `POST /whatsapp/send {lead_id, to_phone, to_name, mode, message}`.
- **Not built:** the 24-hour messaging window, scheduling and a team inbox have no backend.

## Macrid bugs not to repeat

- Clear the agents store on logout; Macrid can show the previous user's agents.
- Confirm before deleting.
- Keep attached images when creating an agent fails.
- Remove the appended "Attached images…" block from user messages when showing history.
- Render agent replies as markdown; Macrid shows plain text.
- Await clipboard writes and handle failures before showing "Copied".
