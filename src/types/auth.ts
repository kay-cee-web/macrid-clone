export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  [key: string]: unknown;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  /** Optional licence code; only sent when filled in. */
  licensecode?: string;
};

export type AuthStatus = "loading" | "authenticated" | "guest";
