"use client";

import { Scale, Trophy, X } from "lucide-react";
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
          <LinkButton className="mt-6" href="/colleges">Start Exploring</LinkButton>
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

  const rows: {
    label: string;
    render: (college: College) => React.ReactNode;
    isWinner?: (college: College) => boolean;
  }[] = [
    { label: "Location", render: (college) => college.location },
    { label: "Type", render: (college) => <Badge variant={typeVariant(college.type)}>{college.type}</Badge> },
    { label: "Category", render: (college) => college.category },
    {
      label: "National Rank",
      render: (college) => `#${college.rank}`,
      isWinner: (college) => college.rank === bestRank,
    },
    {
      label: "Overall Rating",
      render: (college) => (
        <>
          {college.rating} <RatingStars rating={college.rating} />
        </>
      ),
      isWinner: (college) => college.rating === bestRating,
    },
    {
      label: "Annual Fees",
      render: (college) => formatFees(college.fees),
      isWinner: (college) => college.fees === lowestFees,
    },
    {
      label: "Average Package",
      render: (college) => formatPackage(college.placements.averagePackage),
      isWinner: (college) => college.placements.averagePackage === bestAverage,
    },
    {
      label: "Highest Package",
      render: (college) => formatPackage(college.placements.highestPackage),
      isWinner: (college) => college.placements.highestPackage === bestHighest,
    },
    {
      label: "Placement Rate",
      render: (college) => `${college.placements.placementRate}%`,
      isWinner: (college) => college.placements.placementRate === bestPlacement,
    },
    { label: "Established", render: (college) => college.established },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="flex items-center gap-3 text-3xl font-bold text-text-primary">
        <Scale /> Compare Colleges
      </h1>
      <p className="mt-2 text-text-secondary">Side-by-side comparison of your shortlisted colleges.</p>
      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-white shadow-card">
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="sticky top-16 z-20">
            <tr>
              <th className="sticky left-0 z-30 w-48 bg-surface px-4 py-4 text-left text-sm text-text-secondary">Criteria</th>
              {compareList.map((college) => (
                <th className="relative min-w-56 border-l border-border bg-white px-4 py-4 text-left" key={college.id}>
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
                  <td
                    className={`border-l border-border px-4 py-4 text-sm text-text-secondary ${
                      row.isWinner?.(college) ? "bg-green-50" : ""
                    }`}
                    key={college.id}
                  >
                    <Winner active={Boolean(row.isWinner?.(college))}>{row.render(college)}</Winner>
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
    <span className={`inline-flex items-center gap-1 font-semibold ${active ? "text-green-700" : "text-text-secondary"}`}>
      {active ? <Trophy size={15} /> : null}
      {children}
    </span>
  );
}
