import { Suspense } from "react";
import { CollegesClient } from "@/components/CollegesClient";

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10">Loading colleges...</div>}>
      <CollegesClient />
    </Suspense>
  );
}
