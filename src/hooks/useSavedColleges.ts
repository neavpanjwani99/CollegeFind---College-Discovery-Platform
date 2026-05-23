"use client";

import { useSave } from "@/context/SaveContext";

export function useSavedColleges() {
  return useSave();
}
