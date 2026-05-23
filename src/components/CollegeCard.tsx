"use client";

import { motion } from "framer-motion";
import { Check, Heart, IndianRupee, MapPin, Scale, Trophy } from "lucide-react";
import Link from "next/link";
import { Badge, typeVariant } from "@/components/Badge";
import { Button, LinkButton } from "@/components/Button";
import { CollegeImage } from "@/components/CollegeImage";
import { RatingStars } from "@/components/RatingStars";
import { useCompare } from "@/context/CompareContext";
import { useSave } from "@/context/SaveContext";
import { formatFees, truncate } from "@/lib/format";
import type { College } from "@/types/college";

export function CollegeCard({ college, compact = false }: { college: College; compact?: boolean }) {
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const { isSaved, toggleSaved } = useSave();
  const added = isInCompare(college.id);
  const saved = isSaved(college.id);
  const categoryStrip: Record<College["category"], string> = {
    Engineering: "#2563EB",
    Management: "#D97706",
    Medical: "#16A34A",
    Arts: "#7C3AED",
    Commerce: "#EA580C",
  };

  return (
    <motion.article
      className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-200 hover:border-primary/30"
      style={{ borderTop: `3px solid ${categoryStrip[college.category]}` }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.12)" }}
    >
      <div className={`relative ${compact ? "h-36" : "h-48"}`}>
        <CollegeImage alt={`${college.name} campus`} src={college.imageUrl} />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-3">
          <Badge className="border-white/20 bg-white/90 text-text-primary">{college.category}</Badge>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">
            <Trophy size={13} /> Rank #{college.rank}
          </span>
        </div>
        <motion.button
          aria-label={saved ? "Remove saved college" : "Save college"}
          className="absolute right-3 top-3 rounded-full bg-black/30 p-2 text-white backdrop-blur transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => toggleSaved(college.id)}
          transition={{ type: "spring", stiffness: 600, damping: 15 }}
          type="button"
          whileTap={{ scale: 1.4 }}
        >
          <motion.span
            animate={saved ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            className="flex"
            transition={{ duration: 0.3 }}
          >
            <Heart className={saved ? "fill-error text-error" : "text-white/80"} size={18} />
          </motion.span>
        </motion.button>
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
            <span className="text-sm font-bold tabular-nums text-text-primary">{college.rating}</span>
            <span className="text-sm text-text-muted">({college.totalReviews.toLocaleString("en-IN")})</span>
          </div>
        </div>
        <p className="line-clamp-3 border-b border-border pb-4 text-sm leading-6 text-text-secondary">{college.overview}</p>
        <div className="mt-auto space-y-4">
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface p-3">
            <div>
              <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                <IndianRupee size={13} /> Fees
              </p>
              <p className="mt-1 text-sm font-bold tabular-nums text-text-primary">{formatFees(college.fees)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Placement</p>
              <p className="mt-1 text-sm font-bold tabular-nums text-text-primary">{college.placements.placementRate}%</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <LinkButton className="w-full" href={`/colleges/${college.id}`} variant="primary">
              Explore College
            </LinkButton>
            <motion.div whileTap={{ scale: 0.94 }}>
              <Button
                aria-label={added ? "Remove from compare" : "Add to compare"}
                className="w-full"
                onClick={() => (added ? removeFromCompare(college.id) : addToCompare(college))}
                variant={added ? "secondary" : "outline"}
              >
                {added ? <Check size={16} /> : <Scale size={16} />}
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  key={added ? "added" : "compare"}
                  transition={{ duration: 0.2 }}
                >
                  {added ? "Added" : "Compare"}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
