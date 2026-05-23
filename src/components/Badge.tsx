import type { ReactNode } from "react";

type Variant = "default" | "success" | "info" | "warning";

const variants: Record<Variant, string> = {
  default: "bg-surface text-text-secondary border-border",
  success: "bg-green-50 text-green-700 border-green-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function typeVariant(type: string): Variant {
  if (type === "Government") return "success";
  if (type === "Private") return "info";
  return "warning";
}
