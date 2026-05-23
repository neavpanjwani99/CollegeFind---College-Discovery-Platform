"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type MotionProps,
} from "framer-motion";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export function MotionDiv({
  children,
  className = "",
  ...props
}: MotionProps & {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  );
}

export function CountUpNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: "easeOut",
    });
    return controls.stop;
  }, [inView, motionValue, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
