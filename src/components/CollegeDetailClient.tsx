"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Contact,
  ExternalLink,
  Globe,
  Heart,
  IndianRupee,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Scale,
  Star,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge, typeVariant } from "@/components/Badge";
import { Button } from "@/components/Button";
import { CollegeCard } from "@/components/CollegeCard";
import { CollegeImage } from "@/components/CollegeImage";
import { RatingStars } from "@/components/RatingStars";
import { useCompare } from "@/context/CompareContext";
import { colleges } from "@/data/colleges";
import { useSave } from "@/context/SaveContext";
import { formatDate, formatFees, formatPackage } from "@/lib/format";
import type { College } from "@/types/college";

type Tab = "Overview" | "Courses" | "Placements" | "Reviews";

export function CollegeDetailClient({ college }: { college: College }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const { isSaved, toggleSaved } = useSave();
  const added = isInCompare(college.id);
  const saved = isSaved(college.id);

  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem("collegefind_recent") ?? "[]");
      const existing = Array.isArray(parsed) ? parsed : [];
      const filtered = existing.filter(
        (item): item is { id: string; timestamp: number } =>
          typeof item === "object" &&
          item !== null &&
          "id" in item &&
          (item as { id: unknown }).id !== college.id,
      );
      window.localStorage.setItem(
        "collegefind_recent",
        JSON.stringify([{ id: college.id, timestamp: Date.now() }, ...filtered].slice(0, 8)),
      );
    } catch {
      window.localStorage.removeItem("collegefind_recent");
    }
  }, [college.id]);

  const related = useMemo(
    () =>
      colleges
        .filter((item) => item.category === college.category && item.id !== college.id)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3),
    [college.category, college.id],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-text-muted">
        <Link href="/">Home</Link>
        <ChevronRight size={15} />
        <Link href="/colleges">Colleges</Link>
        <ChevronRight size={15} />
        <span className="font-semibold text-text-primary">{college.name}</span>
      </nav>

      <section className="grid gap-8 rounded-2xl border border-border bg-white p-4 shadow-card md:grid-cols-[0.95fr_1.05fr] md:p-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl md:aspect-video">
          <CollegeImage alt={`${college.name} campus`} priority src={college.imageUrl} />
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant={typeVariant(college.type)}>{college.type}</Badge>
            <Badge>{college.category}</Badge>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-text-primary md:text-4xl">{college.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-text-secondary">
            <MapPin size={18} /> {college.location}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <RatingStars rating={college.rating} size={20} />
            <span className="font-bold text-text-primary">{college.rating}</span>
            <span className="text-text-muted">({college.totalReviews.toLocaleString("en-IN")} reviews)</span>
          </div>
          <p className="mt-4 flex items-center gap-2 text-text-secondary">
            <Calendar size={18} /> Established {college.established}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {college.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
          </div>
          <div className="mt-6 rounded-xl bg-surface p-4">
            <p className="text-sm font-semibold text-text-muted">Annual Fees</p>
            <p className="text-3xl font-bold text-text-primary">{formatFees(college.fees)}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-text-primary hover:border-primary hover:text-primary"
              href={college.website}
              rel="noopener noreferrer"
              target="_blank"
            >
              Visit Website <ExternalLink size={16} />
            </a>
            <Button onClick={() => (added ? removeFromCompare(college.id) : addToCompare(college))} variant={added ? "secondary" : "primary"}>
              <Scale size={16} /> {added ? "Remove Compare" : "Add to Compare"}
            </Button>
            <Button onClick={() => toggleSaved(college.id)} variant="outline">
              <Heart className={saved ? "fill-error text-error" : ""} size={16} /> {saved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-white p-4 shadow-card md:p-6">
        <div className="scrollbar-hide flex gap-6 overflow-x-auto border-b border-border">
          {(["Overview", "Courses", "Placements", "Reviews"] as Tab[]).map((item) => (
            <button
              className={`shrink-0 border-b-2 px-1 pb-3 font-semibold ${
                tab === item ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
              key={item}
              onClick={() => setTab(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-8 rounded-xl border border-border bg-white p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              initial={{ opacity: 0, x: 12 }}
              key={tab}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {tab === "Overview" ? <OverviewTab college={college} /> : null}
              {tab === "Courses" ? <CoursesTab college={college} /> : null}
              {tab === "Placements" ? <PlacementsTab college={college} /> : null}
              {tab === "Reviews" ? <ReviewsTab college={college} /> : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <ContactSection college={college} />

      {related.length ? (
        <section className="mt-10">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-text-primary">
            <Users size={24} /> People Also Viewed
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => <CollegeCard college={item} compact key={item.id} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function OverviewTab({ college }: { college: College }) {
  const stats = [
    [Calendar, college.established.toString(), "Established", "text-primary"],
    [BookOpen, college.courses.length.toString(), "Courses", "text-accent"],
    [Trophy, `#${college.rank}`, "Rank", "text-success"],
    [Building2, college.type, "Type", "text-purple-600"],
  ] as const;
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-blue-100 border-l-4 border-l-primary bg-blue-50/30 p-5">
        <p className="text-lg leading-relaxed text-text-secondary">{college.overview}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([Icon, value, label, colorClass]) => (
          <div className="rounded-lg border border-border bg-white p-4 text-center" key={label}>
            <Icon className={`mx-auto mb-2 ${colorClass}`} size={22} />
            <p className="text-2xl font-bold tabular-nums text-text-primary">{value}</p>
            <p className="text-sm text-text-muted">{label}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-primary">Why students choose this college</h3>
        <div className="mt-4 grid gap-3">
          {college.tags.slice(0, 3).map((tag) => (
            <div className="flex items-center gap-3 text-text-secondary" key={tag}>
              <CheckCircle2 className="text-success" size={18} />
              <span>Strong reputation for {tag.toLowerCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CoursesTab({ college }: { college: College }) {
  if (!college.courses.length) return <Empty icon={<BookOpen size={44} />} text="Course information not available" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left">
        <thead className="bg-surface text-sm font-semibold text-text-secondary">
          <tr>
            <th className="px-4 py-3">Course Name</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3 text-right">Annual Fees</th>
          </tr>
        </thead>
        <tbody>
          {college.courses.map((course, index) => (
            <tr className={index % 2 === 0 ? "bg-white" : "bg-surface/50"} key={course.name}>
              <td className="px-4 py-4 font-medium text-text-primary">{course.name}</td>
              <td className="px-4 py-4 text-text-secondary">{course.duration}</td>
              <td className="px-4 py-4 text-right font-semibold text-text-primary">{formatFees(course.fees)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlacementsTab({ college }: { college: College }) {
  const placements = college.placements;
  const stats = [
    [IndianRupee, formatPackage(placements.averagePackage), "Average Package", "border-l-primary", "text-primary"],
    [Trophy, formatPackage(placements.highestPackage), "Highest Package", "border-l-success", "text-success"],
    [TrendingUp, `${placements.placementRate}%`, "Placement Rate", "border-l-accent", "text-accent"],
  ] as const;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map(([Icon, value, label, borderClass, iconClass]) => (
          <div className={`relative rounded-xl border border-border border-l-4 ${borderClass} bg-white p-5`} key={label}>
            <Icon className={`absolute right-4 top-4 ${iconClass} opacity-60`} size={24} />
            <p className="pr-10 text-3xl font-bold tabular-nums text-text-primary">{value}</p>
            <p className="mt-1 text-sm text-text-muted">{label}</p>
          </div>
        ))}
      </div>
      <div>
        <div className="mb-2 flex justify-between text-sm font-semibold text-text-secondary">
          <span>Placement Rate</span>
          <span>{placements.placementRate}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-border">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-[#2563EB] to-[#16A34A] transition-all duration-1000"
            style={{ width: `${placements.placementRate}%` }}
          />
        </div>
      </div>
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-text-primary">
          <Building2 size={22} /> Top Recruiters
        </h3>
        {placements.topRecruiters.length ? (
          <div className="flex flex-wrap gap-2">
            {placements.topRecruiters.map((recruiter) => (
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700" key={recruiter}>
                <Building2 size={15} />
                {recruiter}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-text-muted">Recruiter information not available</p>
        )}
      </div>
    </div>
  );
}

function ReviewsTab({ college }: { college: College }) {
  const avatarColors = ["#2563EB", "#D97706", "#16A34A", "#7C3AED", "#EA580C", "#0F172A"];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <p className="text-5xl font-bold tabular-nums text-text-primary">{college.rating}</p>
        <div>
          <p className="text-sm text-text-muted">out of 5</p>
          <p className="text-sm text-text-muted">{college.totalReviews.toLocaleString("en-IN")} reviews</p>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => {
              const filled = index + 1 <= Math.round(college.rating);
              return (
                <Star
                  className={filled ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                  key={index}
                  size={18}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="mb-6 border-t border-border" />
      {college.reviews.length ? (
        <div className="space-y-4">
          {college.reviews.map((review) => (
            <article className="rounded-xl border border-border bg-white p-5" key={`${review.author}-${review.date}`}>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: avatarColors[review.author.charCodeAt(0) % avatarColors.length] }}
                >
                  {review.author.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text-primary">{review.author}</p>
                </div>
                <p className="text-right text-xs text-text-muted">{formatDate(review.date)}</p>
              </div>
              <div className="mt-4"><RatingStars rating={review.rating} size={15} /></div>
              <p className="mt-3 leading-relaxed text-slate-600">{review.comment}</p>
            </article>
          ))}
        </div>
      ) : (
        <Empty icon={<MessageSquare size={44} />} text="No reviews yet" />
      )}
    </div>
  );
}

function ContactSection({ college }: { college: College }) {
  return (
    <section className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-card">
      <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-text-primary">
        <Contact size={24} /> Contact Information
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        <a className="flex items-center gap-3 rounded-lg bg-surface p-4 text-text-secondary hover:text-primary" href={`tel:${college.phone}`}>
          <Phone size={19} /> {college.phone}
        </a>
        <a className="flex items-center gap-3 rounded-lg bg-surface p-4 text-text-secondary hover:text-primary" href={`mailto:${college.email}`}>
          <Mail size={19} /> {college.email}
        </a>
        <a className="flex items-center gap-3 rounded-lg bg-surface p-4 text-text-secondary hover:text-primary" href={college.website} rel="noopener noreferrer" target="_blank">
          <Globe size={19} /> Website
        </a>
      </div>
    </section>
  );
}

function Empty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="py-10 text-center text-text-muted">{icon}<p className="mt-3">{text}</p></div>;
}
