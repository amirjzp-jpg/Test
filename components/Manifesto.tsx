"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { manifestoLines } from "@/lib/data";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import VeilGlyph from "./VeilGlyph";

type MotionValueLike = ReturnType<typeof useScroll>["scrollYProgress"];

function ManifestoLine({
  line,
  start,
  end,
  fadeEdge,
  scrollYProgress,
}: {
  line: string;
  start: number;
  end: number;
  fadeEdge: number;
  scrollYProgress: MotionValueLike;
}) {
  const opacity = useTransform(scrollYProgress, [start, start + fadeEdge, end - fadeEdge, end], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [start, start + fadeEdge, end - fadeEdge, end], [24, 0, 0, -24]);

  return (
    <motion.p
      style={{ opacity, y }}
      className="absolute max-w-4xl text-center font-display text-3xl font-light leading-snug text-bone sm:text-4xl md:text-5xl"
    >
      {line}
    </motion.p>
  );
}

function PinnedLines({ sectionRef }: { sectionRef: RefObject<HTMLElement> }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  const segment = 1 / manifestoLines.length;

  return (
    <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-6">
      {manifestoLines.map((line, i) => {
        const start = i * segment;
        const end = start + segment;
        const fadeEdge = segment * 0.28;

        return (
          <ManifestoLine
            key={line}
            line={line}
            start={start}
            end={end}
            fadeEdge={fadeEdge}
            scrollYProgress={scrollYProgress}
          />
        );
      })}
    </div>
  );
}

function StaticLines() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-32">
      {manifestoLines.map((line) => (
        <motion.p
          key={line}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center font-display text-3xl font-light leading-snug text-bone sm:text-4xl"
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="story"
      ref={sectionRef}
      className={`relative w-full bg-black ${reducedMotion ? "" : "h-[400vh]"}`}
    >
      <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 text-gold/40">
        <VeilGlyph className="h-8 w-auto" />
      </div>
      {reducedMotion ? <StaticLines /> : <PinnedLines sectionRef={sectionRef} />}
    </section>
  );
}
