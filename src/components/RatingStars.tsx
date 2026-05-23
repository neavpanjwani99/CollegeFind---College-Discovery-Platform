import { Star } from "lucide-react";

export function RatingStars({ rating, size = 16 }: { rating?: number; size?: number }) {
  if (!rating) return <span className="text-sm text-text-muted">Not rated</span>;

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index + 1 <= Math.round(rating);
        return (
          <Star
            aria-hidden="true"
            className={filled ? "fill-amber-400 text-amber-400" : "text-slate-300"}
            key={index}
            size={size}
          />
        );
      })}
    </span>
  );
}
