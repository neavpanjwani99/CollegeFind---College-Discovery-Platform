"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, Search, School, Star, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { CollegeCard } from "@/components/CollegeCard";
import { colleges } from "@/data/colleges";
import { formatFees } from "@/lib/format";
import type { CollegeFilters, SortOption } from "@/types/college";

const categories = ["All", "Engineering", "Management", "Medical", "Arts", "Commerce"];
const types = ["All", "Government", "Private", "Deemed"];
const ratings = [3, 3.5, 4, 4.5];
const pageSize = 9;

export function CollegesClient() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [filters, setFilters] = useState<CollegeFilters>({
    category: searchParams.get("category") ?? "All",
    location: "",
    minFees: "",
    maxFees: "",
    minRating: 0,
    type: "All",
  });
  const [sortBy, setSortBy] = useState<SortOption>("rating-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const isLoading = false;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchQuery), 150);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => setCurrentPage(1), 0);
    return () => window.clearTimeout(timer);
  }, [debouncedSearch, filters, sortBy]);

  const feeError =
    filters.minFees !== "" && filters.maxFees !== "" && filters.minFees > filters.maxFees;

  const filtered = useMemo(() => {
    if (feeError) return [];
    const query = debouncedSearch.toLowerCase().trim();
    return colleges
      .filter((college) => {
        const matchesSearch =
          !query ||
          college.name.toLowerCase().includes(query) ||
          college.location.toLowerCase().includes(query) ||
          college.courses.some((course) => course.name.toLowerCase().includes(query));
        const matchesCategory = filters.category === "All" || college.category === filters.category;
        const matchesType = filters.type === "All" || college.type === filters.type;
        const matchesRating = !filters.minRating || college.rating >= filters.minRating;
        const matchesMinFees = filters.minFees === "" || college.fees >= filters.minFees;
        const matchesMaxFees = filters.maxFees === "" || college.fees <= filters.maxFees;
        const matchesLocation =
          !filters.location ||
          college.location.toLowerCase().includes(filters.location.toLowerCase().trim());
        return (
          matchesSearch &&
          matchesCategory &&
          matchesType &&
          matchesRating &&
          matchesMinFees &&
          matchesMaxFees &&
          matchesLocation
        );
      })
      .sort((a, b) => {
        if (sortBy === "fees-asc") return a.fees - b.fees;
        if (sortBy === "fees-desc") return b.fees - a.fees;
        if (sortBy === "rank-asc") return a.rank - b.rank;
        if (sortBy === "reviews-desc") return b.totalReviews - a.totalReviews;
        return b.rating - a.rating;
      });
  }, [debouncedSearch, feeError, filters, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const resultsKey = JSON.stringify(filters) + searchQuery;
  const activeFilterChips = [
    searchQuery
      ? { label: `Search: ${searchQuery}`, onRemove: () => setSearchQuery("") }
      : null,
    filters.category !== "All"
      ? {
          label: filters.category,
          onRemove: () => setFilters((current) => ({ ...current, category: "All" })),
        }
      : null,
    filters.type !== "All"
      ? { label: filters.type, onRemove: () => setFilters((current) => ({ ...current, type: "All" })) }
      : null,
    filters.location
      ? {
          label: `Location: ${filters.location}`,
          onRemove: () => setFilters((current) => ({ ...current, location: "" })),
        }
      : null,
    filters.minFees !== ""
      ? {
          label: `Min Fees: ${formatFees(filters.minFees)}`,
          onRemove: () => setFilters((current) => ({ ...current, minFees: "" })),
        }
      : null,
    filters.maxFees !== ""
      ? {
          label: `Max Fees: ${formatFees(filters.maxFees)}`,
          onRemove: () => setFilters((current) => ({ ...current, maxFees: "" })),
        }
      : null,
    filters.minRating
      ? {
          label: `${filters.minRating}+ Rating`,
          onRemove: () => setFilters((current) => ({ ...current, minRating: 0 })),
        }
      : null,
  ].filter((chip): chip is { label: string; onRemove: () => void } => chip !== null);
  const hasActiveFilters =
    searchQuery ||
    filters.category !== "All" ||
    filters.type !== "All" ||
    filters.location ||
    filters.minFees !== "" ||
    filters.maxFees !== "" ||
    filters.minRating > 0;

  function clearAll() {
    setSearchQuery("");
    setDebouncedSearch("");
    setFilters({ category: "All", location: "", minFees: "", maxFees: "", minRating: 0, type: "All" });
  }

  function changePage(page: number) {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-border bg-white p-6 shadow-card md:p-8">
        <h1 className="text-3xl font-bold text-text-primary md:text-5xl">Find colleges with decision-ready filters</h1>
        <p className="mt-3 max-w-3xl text-text-secondary">
          Combine category, ownership type, rating, fee range, and location. Every result card keeps
          fees, placement rate, rank, and reviews visible for faster scanning.
        </p>
      </div>
      <button
        className="mb-4 inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-text-primary shadow-card lg:hidden"
        onClick={() => setFiltersOpen((current) => !current)}
        type="button"
      >
        <Filter size={18} /> Filters
      </button>
      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8">
      <section className={`${filtersOpen ? "block" : "hidden"} mb-8 rounded-2xl border border-border bg-white p-4 shadow-card md:p-6 lg:sticky lg:top-24 lg:block`}>
        <div className="mb-5 flex flex-col gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              className="h-12 w-full rounded-lg border border-transparent bg-surface pl-10 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search colleges, courses, cities..."
              value={searchQuery}
            />
            {searchQuery ? (
              <button
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                onClick={() => setSearchQuery("")}
                type="button"
              >
                <X size={18} />
              </button>
            ) : null}
          </div>
          <select
            className="h-12 rounded-lg border border-border bg-white px-3 text-sm font-semibold text-text-secondary outline-none focus:ring-2 focus:ring-primary/20"
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            value={sortBy}
          >
            <option value="rating-desc">Rating: High to Low</option>
            <option value="fees-asc">Fees: Low to High</option>
            <option value="fees-desc">Fees: High to Low</option>
            <option value="rank-asc">Rank: Best First</option>
            <option value="reviews-desc">Reviews: Most First</option>
          </select>
        </div>

        <FilterGroup label="Category" options={categories} value={filters.category} onChange={(value) => setFilters((current) => ({ ...current, category: value }))} />
        <FilterGroup label="Type" options={types} value={filters.type} onChange={(value) => setFilters((current) => ({ ...current, type: value }))} />

        <div className="mt-5 grid gap-4 md:grid-cols-3 lg:grid-cols-1">
          <label className="text-sm font-semibold text-text-secondary">
            Min Fees (INR)
            <input
              className="mt-2 h-11 w-full rounded-lg border border-border bg-white px-3 outline-none focus:ring-2 focus:ring-primary/20"
              min="0"
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  minFees: event.target.value === "" ? "" : Number(event.target.value),
                }))
              }
              type="number"
              value={filters.minFees}
            />
          </label>
          <label className="text-sm font-semibold text-text-secondary">
            Max Fees (INR)
            <input
              className="mt-2 h-11 w-full rounded-lg border border-border bg-white px-3 outline-none focus:ring-2 focus:ring-primary/20"
              min="0"
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  maxFees: event.target.value === "" ? "" : Number(event.target.value),
                }))
              }
              type="number"
              value={filters.maxFees}
            />
          </label>
          <label className="text-sm font-semibold text-text-secondary">
            Filter by city or state
            <input
              className="mt-2 h-11 w-full rounded-lg border border-border bg-white px-3 outline-none focus:ring-2 focus:ring-primary/20"
              onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))}
              placeholder="Delhi"
              value={filters.location}
            />
          </label>
        </div>
        {feeError ? <p className="mt-2 text-sm font-semibold text-error">Min fees cannot exceed max fees</p> : null}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-semibold text-text-secondary">Minimum rating</span>
          {ratings.map((rating) => (
            <button
              className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                filters.minRating === rating
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-border bg-white text-text-secondary hover:bg-surface"
              }`}
              key={rating}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  minRating: current.minRating === rating ? 0 : rating,
                }))
              }
              type="button"
            >
              <Star size={15} /> {rating}+
            </button>
          ))}
          {hasActiveFilters ? (
            <Button className="ml-auto" onClick={clearAll} size="sm" variant="ghost">
              Clear All Filters
            </Button>
          ) : null}
        </div>
      </section>

      <div>
      {activeFilterChips.length ? (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {activeFilterChips.map((chip) => (
            <Chip label={chip.label} key={chip.label} onRemove={chip.onRemove} />
          ))}
          <button
            className="text-sm font-semibold text-primary hover:text-primary-dark"
            onClick={clearAll}
            type="button"
          >
            Clear All
          </button>
        </div>
      ) : null}

      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p aria-live="polite" className="font-semibold text-text-secondary">
          {hasActiveFilters ? `${filtered.length} colleges match your filters` : `Showing all ${filtered.length} colleges`}
        </p>
      </div>

      <div ref={gridRef}>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="h-[520px] animate-pulse rounded-xl border border-border bg-white p-4" key={index}>
                <div className="h-44 rounded-lg bg-surface" />
                <div className="mt-5 h-6 w-3/4 rounded bg-surface" />
                <div className="mt-4 h-4 rounded bg-surface" />
                <div className="mt-3 h-4 w-2/3 rounded bg-surface" />
                <div className="mt-24 h-10 rounded bg-surface" />
              </div>
            ))}
          </div>
        ) : pageItems.length ? (
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              key={resultsKey}
              transition={{ duration: 0.2 }}
            >
              {pageItems.map((college, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  key={college.id}
                  transition={{
                    duration: 0.8,
                    delay: (index % 3) * 0.15,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <CollegeCard college={college} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="rounded-xl border border-border bg-white p-12 text-center shadow-card">
            <School className="mx-auto text-text-muted" size={64} />
            <h2 className="mt-5 text-2xl font-bold text-text-primary">No colleges found matching your filters</h2>
            <p className="mt-2 text-text-secondary">Try adjusting your search or filters.</p>
            <Button className="mt-6" onClick={clearAll}>Clear All Filters</Button>
          </div>
        )}
      </div>

      {pageCount > 1 ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} variant="outline">
            <ChevronLeft size={16} /> Previous
          </Button>
          {Array.from({ length: pageCount }).map((_, index) => {
            const page = index + 1;
            return (
              <button
                className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold ${
                  page === currentPage ? "bg-primary text-white" : "bg-white text-text-secondary hover:bg-surface"
                }`}
                key={page}
                onClick={() => changePage(page)}
                type="button"
              >
                {page}
              </button>
            );
          })}
          <Button disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)} variant="outline">
            Next <ChevronRight size={16} />
          </Button>
        </div>
      ) : null}
      </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-text-secondary">{label}</span>
      {options.map((option) => (
        <button
          className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
            value === option ? "bg-primary text-white" : "bg-surface text-text-secondary hover:bg-border"
          }`}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
      {label}
      <button aria-label={`Remove ${label}`} onClick={onRemove} type="button">
        <X size={14} />
      </button>
    </span>
  );
}
