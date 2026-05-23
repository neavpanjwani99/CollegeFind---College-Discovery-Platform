"use client";

import Image from "next/image";
import { useState } from "react";

export function CollegeImage({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [imageSrc, setImageSrc] = useState(src || "/placeholder-college.svg");

  return (
    <Image
      alt={alt}
      className={`object-contain bg-white p-6 ${className}`}
      fill
      onError={() => setImageSrc("/placeholder-college.svg")}
      priority={priority}
      sizes="(max-width: 768px) 100vw, 33vw"
      src={imageSrc}
    />
  );
}
