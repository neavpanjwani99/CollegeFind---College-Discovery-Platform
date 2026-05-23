"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface SaveContextType {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
}

const SaveContext = createContext<SaveContextType | null>(null);
const STORAGE_KEY = "collegefind_saved";

function readSavedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string").slice(0, 50)
      : [];
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function SaveProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSavedIds(readSavedIds());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds.slice(0, 50)));
    } catch {
      // Ignore storage failures so private browsing does not break the UI.
    }
  }, [savedIds]);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [id, ...current].slice(0, 50),
    );
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const value = useMemo<SaveContextType>(
    () => ({ savedIds, isSaved, toggleSaved }),
    [isSaved, savedIds, toggleSaved],
  );

  return <SaveContext.Provider value={value}>{children}</SaveContext.Provider>;
}

export function useSave() {
  const context = useContext(SaveContext);
  if (!context) throw new Error("useSave must be used within SaveProvider");
  return context;
}
