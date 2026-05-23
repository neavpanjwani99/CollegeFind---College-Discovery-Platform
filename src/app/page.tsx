"use client";

import { ArrowRight, BarChart3, Building2, Heart, MapPin, Search, Scale, TrendingUp } from "lucide-react";
import Link from "next/link";
import { CollegeCard } from "@/components/CollegeCard";
import { LinkButton } from "@/components/Button";
import { CountUpNumber, MotionDiv } from "@/components/ui/MotionWrapper";
import { getTopRatedColleges } from "@/data/colleges";
import type { College } from "@/types/college";

const categories: College["category"][] = ["Engineering", "Management", "Medical", "Arts", "Commerce"];
const howItWorks = [
  {
    step: "1",
    Icon: Search,
    title: "Search & Filter",
    text: "Use filters for category, fees, location and rating to narrow down options.",
  },
  {
    step: "2",
    Icon: Scale,
    title: "Compare Side by Side",
    text: "Add up to 3 colleges and compare fees, placements, and rankings in one table.",
  },
  {
    step: "3",
    Icon: Heart,
    title: "Save Your Shortlist",
    text: "Save colleges you like and come back to them anytime from any device.",
  },
] as const;

export default function Home() {
  const topColleges = getTopRatedColleges(3);
  const stats = [
    ["Colleges Listed", 10, "+", Building2],
    ["Categories", 5, "", BarChart3],
    ["Avg Placement Rate", 90, "+%", TrendingUp],
    ["Cities Covered", 10, "+", MapPin],
  ] as const;

  return (
    <div>
      <section className="bg-[#F8FAFC]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8">
          <MotionDiv
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
            initial={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="mb-5 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-bold text-accent">
              India&apos;s smartest college search
            </p>
            <h1 className="text-5xl font-bold leading-tight text-text-primary md:text-7xl">
              Find the right college.
              <br />
              Not just any college.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary md:text-xl">
              Compare fees, placements, rankings, and real reviews — all in one place. No confusion,
              no paid promotions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/colleges" size="lg">
                Explore Colleges <ArrowRight size={18} />
              </LinkButton>
              <LinkButton href="/compare" size="lg" variant="outline">
                Compare Colleges <Scale size={18} />
              </LinkButton>
            </div>
          </MotionDiv>

          <MotionDiv
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-border bg-white p-5 shadow-card"
            initial={{ opacity: 0, x: 32 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="mb-4 rounded-xl bg-surface p-4 text-text-primary">
              <p className="text-sm font-semibold text-text-muted">Platform at a glance</p>
              <p className="text-2xl font-bold tabular-nums">Rank, fees, rating</p>
            </div>
            <div className="grid gap-3">
              {stats.map(([label, value, suffix, Icon]) => (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white p-4" key={label}>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-3 text-primary">
                      <Icon size={22} />
                    </div>
                    <p className="text-sm font-semibold text-text-secondary">{label}</p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-text-primary">
                    <CountUpNumber suffix={suffix} value={value} />
                  </p>
                </div>
              ))}
            </div>
          </MotionDiv>
        </div>
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 pb-12 sm:px-6 lg:px-8">
          {categories.map((category) => (
            <Link
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-primary hover:text-primary"
              href={`/colleges?category=${category}`}
              key={category}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-text-primary">How CollegeFind works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {howItWorks.map(({ step, Icon, title, text }) => (
              <div className="rounded-xl border border-border bg-background p-5" key={title}>
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {step}
                  </span>
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent">Start shortlist</p>
            <h2 className="mt-2 text-3xl font-bold text-text-primary">Top rated colleges</h2>
            <p className="mt-2 text-text-secondary">High-signal cards for ranking, fees, placements, and location.</p>
          </div>
          <LinkButton className="hidden sm:inline-flex" href="/colleges" variant="outline">
            View all
          </LinkButton>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {topColleges.map((college) => (
            <CollegeCard college={college} compact key={college.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
