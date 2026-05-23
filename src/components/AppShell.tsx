"use client";

import { GraduationCap, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCompare } from "@/context/CompareContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { compareList } = useCompare();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/colleges${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`);
    setOpen(false);
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/colleges", label: "Colleges" },
    { href: "/saved", label: "Saved" },
    { href: "/compare", label: `Compare${compareList.length ? ` (${compareList.length})` : ""}` },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 shadow-[0_1px_20px_rgba(15,23,42,0.05)] backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2 text-xl font-bold text-primary" href="/">
          <span className="rounded-xl bg-primary p-2 text-white shadow-card">
            <GraduationCap className="text-white" size={20} />
          </span>
          College<span className="text-accent">F</span>ind
        </Link>
        <form className="hidden w-72 items-center rounded-lg bg-surface px-3 focus-within:ring-2 focus-within:ring-primary/20 md:flex" onSubmit={onSubmit}>
          <Search className="text-text-muted" size={17} />
          <input
            aria-label="Search colleges"
            className="h-9 w-full bg-transparent px-2 text-sm outline-none placeholder:text-text-muted"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search colleges, courses, cities..."
            value={query}
          />
        </form>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                pathname === link.href ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button
          aria-label="Open menu"
          className="rounded-lg p-2 text-text-primary hover:bg-surface md:hidden"
          onClick={() => setOpen(true)}
          type="button"
        >
          <Menu />
        </button>
      </nav>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/30 md:hidden" onClick={() => setOpen(false)}>
          <div
            className="ml-auto min-h-screen w-72 bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-bold text-primary">CollegeFind</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)} type="button">
                <X />
              </button>
            </div>
            <form className="mb-5 flex items-center rounded-lg bg-surface px-3" onSubmit={onSubmit}>
              <Search className="text-text-muted" size={17} />
              <input
                className="h-10 w-full bg-transparent px-2 text-sm outline-none"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search colleges"
                value={query}
              />
            </form>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  className="rounded-lg px-3 py-2 font-semibold text-text-secondary hover:bg-surface"
                  href={link.href}
                  key={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-white pb-28 pt-12 md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <p className="text-lg font-bold text-primary">CollegeFind</p>
          <p className="mt-2 text-sm text-text-secondary">Discover your future.</p>
        </div>
        <FooterColumn title="Quick Links" items={["Home", "Colleges", "Compare", "Saved"]} />
        <FooterColumn title="Categories" items={["Engineering", "Management", "Medical", "Arts", "Commerce"]} />
        <FooterColumn title="Legal" items={["Privacy Policy", "Terms of Service", "Contact"]} />
      </div>
      <p className="mt-10 text-center text-sm text-text-muted">Copyright 2026 CollegeFind. All rights reserved.</p>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-semibold text-text-primary">{title}</p>
      <div className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}
