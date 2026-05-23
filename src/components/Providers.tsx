"use client";

import { AppShell } from "@/components/AppShell";
import { CompareDrawer } from "@/components/CompareDrawer";
import { CompareProvider } from "@/context/CompareContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      <AppShell>{children}</AppShell>
      <CompareDrawer />
    </CompareProvider>
  );
}
