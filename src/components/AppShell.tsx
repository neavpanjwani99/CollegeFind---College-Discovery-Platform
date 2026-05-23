"use client";

import { Menu, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCompare } from "@/context/CompareContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-hidden">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-hidden"
          initial={{ opacity: 0, y: 8 }}
          key={pathname}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
      <Footer />
    </>
  );
}

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { compareList } = useCompare();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/colleges${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`);
    setMenuOpen(false);
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/colleges", label: "Colleges" },
    { href: "/saved", label: "Saved" },
    { href: "/compare", label: `Compare${compareList.length ? ` (${compareList.length})` : ""}` },
  ];

  function isActive(href: string) {
    return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 shadow-[0_1px_20px_rgba(15,23,42,0.05)] backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center" href="/">
          <Image src="/logo.png" alt="CollegeFind" width={140} height={40} />
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
              className={`relative px-3 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
              href={link.href}
              key={link.href}
            >
              {link.label}
              {isActive(link.href) ? (
                <motion.div
                  className="absolute inset-x-3 bottom-0 h-0.5 bg-primary"
                  layoutId="navbar-indicator"
                />
              ) : null}
            </Link>
          ))}
        </div>
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 text-text-primary hover:bg-surface md:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>
      <div className={`${menuOpen ? "block" : "hidden"} border-t border-border bg-white px-4 py-4 md:hidden`}>
        <form className="mb-4 flex items-center rounded-lg bg-surface px-3" onSubmit={onSubmit}>
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
              className={`relative px-3 py-2 font-medium ${
                isActive(link.href) ? "text-primary" : "text-text-secondary hover:bg-surface"
              }`}
              href={link.href}
              key={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              {isActive(link.href) ? (
                <motion.div
                  className="absolute inset-x-3 bottom-0 h-0.5 bg-primary"
                  layoutId="navbar-indicator-mobile"
                />
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const quickLinks = [
    ["Home", "/"],
    ["Colleges", "/colleges"],
    ["Compare", "/compare"],
    ["Saved", "/saved"],
  ] as const;
  const categories = ["Engineering", "Management", "Medical", "Arts", "Commerce"] as const;

  return (
    <footer className="bg-[#0F172A] pb-16 pt-8 md:pb-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div className="max-w-sm">
          <Image src="/logo.png" alt="CollegeFind" width={140} height={40} />
          <p className="mt-3 text-sm text-slate-400">Helping Indian students make smarter college decisions.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          <FooterColumn title="Quick Links">
            {quickLinks.map(([label, href]) => (
              <Link className="text-slate-400 transition-colors hover:text-white" href={href} key={href}>
                {label}
              </Link>
            ))}
          </FooterColumn>
          <FooterColumn title="Categories">
            {categories.map((category) => (
              <Link
                className="text-slate-400 transition-colors hover:text-white"
                href={`/colleges?category=${category}`}
                key={category}
              >
                {category}
              </Link>
            ))}
          </FooterColumn>
          <FooterColumn title="Contact">
            <a className="text-slate-400 transition-colors hover:text-white" href="mailto:hello@collegefind.in">
              hello@collegefind.in
            </a>
            <a className="text-slate-400 transition-colors hover:text-white" href="tel:+911234567890">
              +91 12345 67890
            </a>
          </FooterColumn>
        </div>
      </div>
      <p className="mt-8 border-t border-white/10 pt-5 text-center text-sm text-slate-400">
        2026 CollegeFind. Built for Indian students.
      </p>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-semibold text-white">{title}</p>
      <div className="mt-3 flex flex-col gap-2 text-sm">
        {children}
      </div>
    </div>
  );
}
