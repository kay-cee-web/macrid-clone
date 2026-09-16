"use client";

import { useSyncExternalStore } from "react";
import { getServerTokenBalance, getTokenBalance, subscribeTokenBalance } from "@/lib/tokens/balance";

/** Tokens left on the account as of the last chat reply, or null before the first one. */
export function useTokenBalance() {
  return useSyncExternalStore(subscribeTokenBalance, getTokenBalance, getServerTokenBalance);
}
