"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ritualLine } from "@/lib/data";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Ritual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reducedMotion = useReducedMotion();

  return (
    <section id="ritual" className="relative w-full bg-black px-4 py-28 md:px-10 md:py-40">
      <div ref={ref} className="gold-corners relative mx-auto aspect-[4/5] max-w-5xl overflow-hidden md:aspect-[16/9]">
        <span className="corner-tl" />
        <span className="corner-br" />

        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { clipPath: "inset(0 0 0 100%)" }}
          animate={
            inView
              ? reducedMotion
                ? { opacity: 1 }
                : { clipPath: "inset(0 0 0 0%)" }
              : undefined
          }
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src="/ritual-detail.jpg"
            alt="A single gold droplet falling toward the Voile Noir flacon, caught mid-air"
            fill
            sizes="(min-width: 768px) 80vw, 100vw"
            className="object-cover"
          />
          <div className="vignette absolute inset-0" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent px-6 pb-10 pt-24 text-center md:px-16"
        >
          <p className="mx-auto max-w-2xl font-display text-2xl font-light italic leading-relaxed text-bone sm:text-3xl">
            {ritualLine}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
