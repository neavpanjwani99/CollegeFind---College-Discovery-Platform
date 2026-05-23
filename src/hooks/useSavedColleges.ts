"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "collegefind_saved";

function readSavedIds(): string[] {
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

export function useSavedColleges() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSavedIds(readSavedIds()), 0);
    return () => window.clearTimeout(timer);
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

  return { savedIds, toggleSaved, isSaved };
}
