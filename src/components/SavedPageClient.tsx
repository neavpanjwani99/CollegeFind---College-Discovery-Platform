"use client";

import { Heart } from "lucide-react";
import { CollegeCard } from "@/components/CollegeCard";
import { LinkButton } from "@/components/Button";
import { useSave } from "@/context/SaveContext";
import { colleges } from "@/data/colleges";

export function SavedPageClient() {
  const { savedIds } = useSave();
  const savedColleges = colleges.filter((college) => savedIds.includes(college.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="flex items-center gap-3 text-3xl font-bold text-text-primary">
        <Heart className="text-error" /> Saved Colleges
      </h1>
      <p className="mt-2 text-text-secondary">Your locally saved shortlist persists in this browser.</p>
      {savedColleges.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedColleges.map((college) => <CollegeCard college={college} key={college.id} />)}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-border bg-white p-12 text-center shadow-card">
          <Heart className="mx-auto text-text-muted" size={64} />
          <h2 className="mt-5 text-2xl font-bold text-text-primary">Your shortlist is empty</h2>
          <p className="mt-2 text-text-secondary">Tap the heart on any college card to add it here. Compare up to 3 at once.</p>
          <LinkButton className="mt-6" href="/colleges">Start Exploring</LinkButton>
        </div>
      )}
    </div>
  );
}
