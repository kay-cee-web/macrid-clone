"use client";

import { useSyncExternalStore } from "react";
import { readFavorites, serverFavorites, subscribeToFavorites, toggleFavorite } from "@/lib/agents/favorites";

/** Favourite agent ids, live across every card and menu on the page. */
export function useFavorites() {
  const favorites = useSyncExternalStore(subscribeToFavorites, readFavorites, serverFavorites);
  return { favorites, isFavorite: (id: string) => favorites.has(id), toggle: toggleFavorite };
}
