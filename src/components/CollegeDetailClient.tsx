"use client";

import {
  BookOpen,
  Building2,
  Calendar,
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
import { useSavedColleges } from "@/hooks/useSavedColleges";
import { formatDate, formatFees, formatPackage } from "@/lib/format";
import type { College } from "@/types/college";

type Tab = "Overview" | "Courses" | "Placements" | "Reviews";

export function CollegeDetailClient({ college }: { college: College }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const { isSaved, toggleSaved } = useSavedColleges();
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
        <div className="mt-8">
          {tab === "Overview" ? <OverviewTab college={college} /> : null}
          {tab === "Courses" ? <CoursesTab college={college} /> : null}
          {tab === "Placements" ? <PlacementsTab college={college} /> : null}
          {tab === "Reviews" ? <ReviewsTab college={college} /> : null}
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
    [BookOpen, college.courses.length.toString(), "Courses"],
    [TrendingUp, `${college.placements.placementRate}%`, "Placement Rate"],
    [IndianRupee, formatPackage(college.placements.averagePackage), "Avg Package"],
    [Trophy, formatPackage(college.placements.highestPackage), "Highest Package"],
    [Calendar, college.established.toString(), "Established"],
  ] as const;
  return (
    <div>
      <p className="max-w-3xl text-lg leading-relaxed text-text-secondary">{college.overview}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(([Icon, value, label]) => (
          <div className="rounded-lg border border-border bg-white p-4 text-center" key={label}>
            <Icon className="mx-auto mb-2 text-primary" size={22} />
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            <p className="text-sm text-text-muted">{label}</p>
          </div>
        ))}
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
  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-xl bg-surface p-4 md:grid-cols-3">
        {[
          [IndianRupee, formatPackage(placements.averagePackage), "Average Package"],
          [Trophy, formatPackage(placements.highestPackage), "Highest Package"],
          [TrendingUp, `${placements.placementRate}%`, "Placement Rate"],
        ].map(([Icon, value, label]) => (
          <div className="rounded-lg bg-white p-5 text-center" key={label as string}>
            <Icon className="mx-auto mb-2 text-primary" size={24} />
            <p className="text-3xl font-bold text-text-primary">{value as string}</p>
            <p className="text-sm text-text-muted">{label as string}</p>
          </div>
        ))}
      </div>
      <div>
        <div className="mb-2 flex justify-between text-sm font-semibold text-text-secondary">
          <span>Placement Rate</span>
          <span>{placements.placementRate}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-border">
          <div className="h-4 rounded-full bg-success transition-all duration-1000" style={{ width: `${placements.placementRate}%` }} />
        </div>
      </div>
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-text-primary">
          <Building2 size={22} /> Top Recruiters
        </h3>
        {placements.topRecruiters.length ? (
          <div className="flex flex-wrap gap-2">
            {placements.topRecruiters.map((recruiter) => (
              <span className="rounded-full border border-border bg-white px-4 py-2 text-sm text-text-secondary" key={recruiter}>{recruiter}</span>
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
  return (
    <div>
      <div className="mb-6 rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-5xl font-bold text-text-primary">{college.rating}</p>
        <div className="mt-2"><RatingStars rating={college.rating} size={22} /></div>
        <p className="mt-2 text-text-muted">Based on {college.totalReviews.toLocaleString("en-IN")} reviews</p>
      </div>
      {college.reviews.length ? (
        <div className="space-y-4">
          {college.reviews.map((review) => (
            <article className="rounded-lg border border-border bg-white p-4" key={`${review.author}-${review.date}`}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {review.author.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{review.author}</p>
                  <p className="text-xs text-text-muted">{formatDate(review.date)}</p>
                  <div className="mt-2"><RatingStars rating={review.rating} size={15} /></div>
                  <p className="mt-3 leading-relaxed text-text-secondary">{review.comment}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty icon={<MessageSquare size={44} />} text="No reviews yet. Be the first to review!" />
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
