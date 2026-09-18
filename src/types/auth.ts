export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  /** Profile fields `POST /profile-update/{id}` writes; absent on older rows. */
  username?: string;
  phone?: string;
  city?: string;
  country?: string;
  /** The avatar's gallery URL — the endpoint takes a link, never a file. */
  profile_pic?: string;
  created_at?: string;
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
