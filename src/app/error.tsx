"use client";

import { Button } from "@/components/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md rounded-xl border border-border bg-white p-8 text-center shadow-card">
        <h2 className="text-2xl font-bold text-text-primary">Something went wrong</h2>
        <p className="mt-2 text-text-secondary">{error.message || "An unexpected error occurred."}</p>
        <Button className="mt-6" onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
