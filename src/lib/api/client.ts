import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { getToken } from "@/lib/auth/session";
import { emitAuthEvent } from "@/lib/auth/events";
import { isTokenExhausted } from "./errors";

/** The one HTTP client. Same Laravel API and auth scheme as Macrid. */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AUTH_ROUTES = ["/login", "/register", "/logout"];
let tokenWarningShown = false;

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }
    if (AUTH_ROUTES.some((route) => error.config?.url?.includes(route))) {
      return Promise.reject(error);
    }

    const body = error.response.data ?? {};
    const appError = typeof body.error === "string" ? body.error : "";
    const message = typeof body.message === "string" ? body.message : "";

    // Out of AI tokens is a plan limit, not an expired session: warn, stay signed in.
    if (isTokenExhausted(appError)) {
      if (!tokenWarningShown) {
        tokenWarningShown = true;
        toast.warning("You've run out of tokens. Upgrade your plan to keep your agents working.");
        setTimeout(() => (tokenWarningShown = false), 5000);
      }
      return Promise.reject(error);
    }

    // Only Laravel's literal "Unauthenticated." ends the session.
    if (message.replace(".", "").trim().toLowerCase() === "unauthenticated") {
      emitAuthEvent("unauthenticated");
    }
    return Promise.reject(error);
  },
);
