"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { useCompare } from "@/context/CompareContext";
import { truncate } from "@/lib/format";

export function CompareDrawer() {
  const { clearCompare, compareList, removeFromCompare } = useCompare();

  return (
    <AnimatePresence>
      {compareList.length ? (
        <motion.aside
          animate={{ y: 0, opacity: 1 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white px-4 py-3 shadow-drawer"
          exit={{ y: 100, opacity: 0 }}
          initial={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-bold text-text-primary">Compare ({compareList.length}/3)</span>
              {Array.from({ length: 3 }).map((_, index) => {
                const college = compareList[index];
                return college ? (
                  <span
                    className="inline-flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-sm text-text-secondary"
                    key={college.id}
                  >
                    {truncate(college.name, 20)}
                    <button
                      aria-label={`Remove ${college.name}`}
                      className="text-text-muted hover:text-error"
                      onClick={() => removeFromCompare(college.id)}
                      type="button"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ) : (
                  <span
                    className="rounded-lg border-2 border-dashed border-border px-3 py-1.5 text-sm text-text-muted"
                    key={index}
                  >
                    Empty slot
                  </span>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button onClick={clearCompare} size="sm" variant="ghost">
                Clear All
              </Button>
              <Link
                aria-disabled={compareList.length < 2}
                className={`inline-flex h-9 items-center justify-center rounded-lg border border-primary bg-primary px-3 text-sm font-semibold text-white ${
                  compareList.length < 2 ? "pointer-events-none opacity-50" : "hover:bg-primary-dark"
                }`}
                href="/compare"
                title={compareList.length < 2 ? "Select at least 2 colleges" : "Compare now"}
              >
                Compare Now
              </Link>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
