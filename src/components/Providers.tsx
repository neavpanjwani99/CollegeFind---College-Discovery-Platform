"use client";

import { AppShell } from "@/components/AppShell";
import { CompareDrawer } from "@/components/CompareDrawer";
import { CompareProvider } from "@/context/CompareContext";
import { SaveProvider } from "@/context/SaveContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      <SaveProvider>
        <AppShell>{children}</AppShell>
        <CompareDrawer />
      </SaveProvider>
    </CompareProvider>
  );
}
