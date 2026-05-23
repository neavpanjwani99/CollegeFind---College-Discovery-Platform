"use client";

import { Check, Heart, IndianRupee, MapPin, Scale, Trophy } from "lucide-react";
import Link from "next/link";
import { Badge, typeVariant } from "@/components/Badge";
import { Button, LinkButton } from "@/components/Button";
import { CollegeImage } from "@/components/CollegeImage";
import { RatingStars } from "@/components/RatingStars";
import { useCompare } from "@/context/CompareContext";
import { useSavedColleges } from "@/hooks/useSavedColleges";
import { formatFees, truncate } from "@/lib/format";
import type { College } from "@/types/college";

export function CollegeCard({ college, compact = false }: { college: College; compact?: boolean }) {
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const { isSaved, toggleSaved } = useSavedColleges();
  const added = isInCompare(college.id);
  const saved = isSaved(college.id);

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
      <div className={`relative ${compact ? "h-36" : "h-48"}`}>
        <CollegeImage alt={`${college.name} campus`} src={college.imageUrl} />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-3">
          <Badge className="border-white/20 bg-white/90 text-text-primary">{college.category}</Badge>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">
            <Trophy size={13} /> Rank #{college.rank}
          </span>
        </div>
        <button
          aria-label={saved ? "Remove saved college" : "Save college"}
          className="absolute right-3 top-3 rounded-full bg-black/30 p-2 text-white backdrop-blur transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => toggleSaved(college.id)}
          type="button"
        >
          <Heart className={saved ? "fill-error text-error" : "text-white/80"} size={18} />
        </button>
      </div>
      <div className="flex min-h-[260px] flex-col gap-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Badge variant={typeVariant(college.type)}>{college.type}</Badge>
            <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-text-muted">
              {college.established}
            </span>
          </div>
          <Link
            className="block text-lg font-bold leading-snug text-text-primary hover:text-primary"
            href={`/colleges/${college.id}`}
          >
            {truncate(college.name, compact ? 46 : 58)}
          </Link>
          <p className="flex items-center gap-1.5 text-sm text-text-secondary">
            <MapPin size={15} />
            {college.location}
          </p>
          <div className="flex items-center gap-2">
            <RatingStars rating={college.rating} />
            <span className="text-sm font-semibold text-text-primary">{college.rating}</span>
            <span className="text-sm text-text-muted">({college.totalReviews.toLocaleString("en-IN")})</span>
          </div>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-text-secondary">{college.overview}</p>
        <div className="mt-auto space-y-4">
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface p-3">
            <div>
              <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                <IndianRupee size={13} /> Fees
              </p>
              <p className="mt-1 text-sm font-bold text-text-primary">{formatFees(college.fees)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Placement</p>
              <p className="mt-1 text-sm font-bold text-text-primary">{college.placements.placementRate}%</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton className="flex-1" href={`/colleges/${college.id}`} variant="primary">
              View Details
            </LinkButton>
            <Button
              aria-label={added ? "Remove from compare" : "Add to compare"}
              className="active:scale-95"
              onClick={() => (added ? removeFromCompare(college.id) : addToCompare(college))}
              variant={added ? "secondary" : "outline"}
            >
              {added ? <Check size={16} /> : <Scale size={16} />}
              {added ? "Added" : "Compare"}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
