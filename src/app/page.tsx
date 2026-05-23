import { ArrowRight, BarChart3, CheckCircle2, Heart, Search, Scale, ShieldCheck, TrendingUp } from "lucide-react";
import { CollegeCard } from "@/components/CollegeCard";
import { LinkButton } from "@/components/Button";
import { getTopRatedColleges } from "@/data/colleges";

export default function Home() {
  const topColleges = getTopRatedColleges(3);

  return (
    <div>
      <section className="relative overflow-hidden bg-[#0f172a] text-white">
        <div className="absolute inset-0 bg-[url('/placeholder-college.svg')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.95),rgba(15,23,42,0.76),rgba(15,23,42,0.36))]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl content-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_420px] md:py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-blue-100 backdrop-blur">
              <ShieldCheck size={16} />
              Local mock data, no login, no backend
            </div>
            <h1 className="text-5xl font-bold leading-tight md:text-7xl">CollegeFind</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              A focused discovery workspace for Indian students to search colleges, compare decisions,
              inspect placements, and save shortlists without leaving the browser.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/colleges" size="lg">
                Explore Colleges <ArrowRight size={18} />
              </LinkButton>
              <LinkButton className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-text-primary" href="/compare" size="lg" variant="outline">
                Compare Shortlist <Scale size={18} />
              </LinkButton>
            </div>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {["15 colleges seeded", "Static export ready", "Saved in browser"].map((item) => (
                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-3 text-sm font-semibold text-slate-100 backdrop-blur" key={item}>
                  <CheckCircle2 className="text-green-300" size={17} />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="self-end rounded-2xl border border-white/15 bg-white/12 p-4 shadow-2xl backdrop-blur-md">
            <div className="mb-4 rounded-xl bg-white p-4 text-text-primary">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-text-muted">Decision dashboard</p>
                  <p className="text-2xl font-bold">Rank, fees, rating</p>
                </div>
                <TrendingUp className="text-success" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            {[
              ["15", "Colleges", Search],
              ["5", "Categories", BarChart3],
              ["3", "Compare slots", Scale],
              ["50", "Saved limit", Heart],
            ].map(([value, label, Icon]) => (
              <div className="flex items-center gap-4 rounded-xl bg-white/95 p-4 text-text-primary shadow-card" key={label as string}>
                <div className="rounded-lg bg-blue-50 p-3 text-primary">
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{value as string}</p>
                  <p className="text-sm text-text-secondary">{label as string}</p>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-border bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["Search depth", "Name, city, state, and course matching with 150ms debounce."],
            ["Decision safety", "Compare is capped at 3 colleges so the table stays readable."],
            ["Beginner-friendly", "All data is local TypeScript, so the flow is easy to inspect."],
          ].map(([title, text]) => (
            <div className="rounded-xl border border-border bg-background p-5" key={title}>
              <p className="font-bold text-text-primary">{title}</p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{text}</p>
            </div>
          ))}
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
