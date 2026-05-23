import { School } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/Button";
import { CollegeDetailClient } from "@/components/CollegeDetailClient";
import { colleges, getCollegeById } from "@/data/colleges";

export function generateStaticParams() {
  return colleges.map((college) => ({ id: college.id }));
}

export default async function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const college = getCollegeById(id);

  if (!college) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-text-muted">
          <Link href="/">Home</Link> <span className="mx-2">/</span>
          <Link href="/colleges">Colleges</Link> <span className="mx-2">/</span>
          <span className="text-text-primary">Not Found</span>
        </nav>
        <div className="rounded-xl border border-border bg-white p-12 text-center shadow-card">
          <School className="mx-auto text-text-muted" size={64} />
          <h1 className="mt-5 text-3xl font-bold text-text-primary">College not found</h1>
          <p className="mt-2 text-text-secondary">The college you&apos;re looking for doesn&apos;t exist in our database.</p>
          <LinkButton className="mt-6" href="/colleges">Browse All Colleges</LinkButton>
        </div>
      </div>
    );
  }

  return <CollegeDetailClient college={college} />;
}
