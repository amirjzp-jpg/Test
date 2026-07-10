"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function CustomCursor() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const springX = useSpring(x, { damping: 28, stiffness: 320, mass: 0.4 });
  const springY = useSpring(y, { damping: 28, stiffness: 320, mass: 0.4 });

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX - 5);
      y.set(e.clientY - 5);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, x, y]);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const unsubX = springX.on("change", (v) => {
      el.style.transform = `translate3d(${v}px, ${springY.get()}px, 0)`;
    });
    const unsubY = springY.on("change", (v) => {
      el.style.transform = `translate3d(${springX.get()}px, ${v}px, 0)`;
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [reduced, springX, springY]);

  if (reduced) return null;

  return <div ref={ref} className="cursor-dot" />;
}
