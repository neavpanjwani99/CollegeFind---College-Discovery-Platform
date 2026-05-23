"use client";

import { Crown, Scale, X } from "lucide-react";
import Link from "next/link";
import { Badge, typeVariant } from "@/components/Badge";
import { LinkButton } from "@/components/Button";
import { CollegeImage } from "@/components/CollegeImage";
import { RatingStars } from "@/components/RatingStars";
import { useCompare } from "@/context/CompareContext";
import { formatFees, formatPackage } from "@/lib/format";
import type { College } from "@/types/college";

export function ComparePageClient() {
  const { compareList, removeFromCompare } = useCompare();

  if (compareList.length < 2) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-12">
        <div className="rounded-xl border border-border bg-white p-10 text-center shadow-card">
          <Scale className="mx-auto text-text-muted" size={64} />
          <h1 className="mt-5 text-3xl font-bold text-text-primary">Compare Colleges</h1>
          <p className="mt-2 text-text-secondary">Please select at least 2 colleges to compare.</p>
          <LinkButton className="mt-6" href="/colleges">Browse Colleges</LinkButton>
        </div>
      </div>
    );
  }

  const bestRank = Math.min(...compareList.map((college) => college.rank));
  const bestRating = Math.max(...compareList.map((college) => college.rating));
  const lowestFees = Math.min(...compareList.map((college) => college.fees));
  const bestAverage = Math.max(...compareList.map((college) => college.placements.averagePackage));
  const bestHighest = Math.max(...compareList.map((college) => college.placements.highestPackage));
  const bestPlacement = Math.max(...compareList.map((college) => college.placements.placementRate));

  const rows = [
    { label: "Location", render: (college: College) => college.location },
    { label: "Type", render: (college: College) => <Badge variant={typeVariant(college.type)}>{college.type}</Badge> },
    { label: "Category", render: (college: College) => college.category },
    { label: "National Rank", render: (college: College) => <Winner active={college.rank === bestRank}>#{college.rank}</Winner> },
    { label: "Overall Rating", render: (college: College) => <Winner active={college.rating === bestRating}>{college.rating} <RatingStars rating={college.rating} /></Winner> },
    { label: "Annual Fees", render: (college: College) => <Winner active={college.fees === lowestFees}>{formatFees(college.fees)}</Winner> },
    { label: "Average Package", render: (college: College) => <Winner active={college.placements.averagePackage === bestAverage}>{formatPackage(college.placements.averagePackage)}</Winner> },
    { label: "Highest Package", render: (college: College) => <Winner active={college.placements.highestPackage === bestHighest}>{formatPackage(college.placements.highestPackage)}</Winner> },
    { label: "Placement Rate", render: (college: College) => <Winner active={college.placements.placementRate === bestPlacement}>{college.placements.placementRate}%</Winner> },
    { label: "Established", render: (college: College) => college.established },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="flex items-center gap-3 text-3xl font-bold text-text-primary">
        <Scale /> Compare Colleges
      </h1>
      <p className="mt-2 text-text-secondary">Side-by-side comparison of your shortlisted colleges.</p>
      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-white shadow-card">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-48 bg-surface px-4 py-4 text-left text-sm text-text-secondary">Criteria</th>
              {compareList.map((college) => (
                <th className="relative min-w-56 border-l border-border px-4 py-4 text-left" key={college.id}>
                  <button
                    aria-label={`Remove ${college.name}`}
                    className="absolute right-3 top-3 rounded-full p-1 text-text-muted hover:bg-surface hover:text-error"
                    onClick={() => removeFromCompare(college.id)}
                    type="button"
                  >
                    <X size={16} />
                  </button>
                  <div className="relative mb-3 h-20 overflow-hidden rounded-lg">
                    <CollegeImage alt={`${college.name} campus`} src={college.imageUrl} />
                  </div>
                  <Link className="font-bold text-text-primary hover:text-primary" href={`/colleges/${college.id}`}>
                    {college.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t border-border" key={row.label}>
                <td className="sticky left-0 bg-surface px-4 py-4 text-sm font-bold text-text-secondary">{row.label}</td>
                {compareList.map((college) => (
                  <td className="border-l border-border px-4 py-4 text-sm text-text-secondary" key={college.id}>
                    {row.render(college)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Winner({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-semibold ${active ? "bg-green-50 text-green-700" : "text-text-secondary"}`}>
      {active ? <Crown size={15} /> : null}
      {children}
    </span>
  );
}
