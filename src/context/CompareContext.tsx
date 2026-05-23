"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { colleges } from "@/data/colleges";
import type { College } from "@/types/college";

interface Toast {
  id: number;
  message: string;
  type: "success" | "warning" | "info";
}

interface CompareContextType {
  compareList: College[];
  addToCompare: (college: College) => boolean;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  canAddMore: boolean;
  notify: (message: string, type?: Toast["type"]) => void;
}

const CompareContext = createContext<CompareContextType | null>(null);
const STORAGE_KEY = "collegefind_compare";

function readCompareIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string").slice(0, 3)
      : [];
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<College[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const valid = readCompareIds()
        .map((id) => colleges.find((college) => college.id === id))
        .filter((college): college is College => Boolean(college));
      setCompareList(valid);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(compareList.map((college) => college.id)),
      );
    } catch {
      // Persistence is optional; the app should still work in restricted storage modes.
    }
  }, [compareList]);

  const notify = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const addToCompare = useCallback(
    (college: College) => {
      let added = false;
      setCompareList((current) => {
        if (current.some((item) => item.id === college.id)) return current;
        if (current.length >= 3) return current;
        added = true;
        return [...current, college];
      });
      if (!added && compareList.length >= 3 && !compareList.some((item) => item.id === college.id)) {
        notify("Maximum 3 colleges can be compared. Remove one to add another.", "warning");
      } else if (added) {
        notify("Added to comparison", "success");
      }
      return added;
    },
    [compareList, notify],
  );

  const removeFromCompare = useCallback(
    (id: string) => {
      setCompareList((current) => current.filter((college) => college.id !== id));
      notify("Removed from comparison", "info");
    },
    [notify],
  );

  const clearCompare = useCallback(() => {
    setCompareList([]);
    notify("Comparison cleared", "info");
  }, [notify]);

  const isInCompare = useCallback(
    (id: string) => compareList.some((college) => college.id === id),
    [compareList],
  );

  const value = useMemo<CompareContextType>(
    () => ({
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      canAddMore: compareList.length < 3,
      notify,
    }),
    [addToCompare, clearCompare, compareList, isInCompare, notify, removeFromCompare],
  );

  return (
    <CompareContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-[80] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            className={`rounded-lg border px-4 py-3 text-sm shadow-lg ${
              toast.type === "warning"
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : toast.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-slate-200 bg-white text-slate-700"
            }`}
            key={toast.id}
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within CompareProvider");
  return context;
}
