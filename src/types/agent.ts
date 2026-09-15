/** An agent row exactly as the Laravel API sends it. */
export type AgentRow = {
  id: number | string;
  user_id?: number | null;
  tenant_id?: number | null;
  name?: string | null;
  instructions?: string | null;
  model?: string | null;
  is_active?: boolean | number | null;
  sending_enabled?: boolean | number | null;
  created_at?: string | null;
  updated_at?: string | null;
  /** Not a backend column yet; read tolerantly for when it lands. */
  category?: string | null;
};

/** The agent shape every screen uses. */
export type Agent = {
  id: string;
  name: string;
  /** The agent's brief. The backend calls it `instructions` too. */
  instructions: string;
  model: string | null;
  isActive: boolean;
  /** Kill switch: when false the agent still researches and drafts, but sends nothing. */
  sendingEnabled: boolean;
  category: string;
  createdAt: string | null;
  updatedAt: string | null;
};

/** Fields that can be written back with POST/PUT /agents. */
export type AgentInput = Partial<Pick<Agent, "name" | "instructions" | "model" | "isActive" | "sendingEnabled">>;

/** Activity counters from GET /agents/{id}. */
export type AgentStats = {
  messages: number;
  actionsTotal: number;
  sentLast24h: number;
  blockedLast24h: number;
  lastActionAt: string | null;
};

export type ChatImage = { url: string; name: string };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  at: string;
  images?: ChatImage[];
  /** A failed send, shown inline rather than as an agent reply. */
  error?: boolean;
};

export type ChatReply = {
  reply: string;
  /** The rewritten brief, when this turn changed the agent's own instructions. */
  instructions: string | null;
};
