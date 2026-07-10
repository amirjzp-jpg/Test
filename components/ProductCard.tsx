"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Product } from "@/lib/data";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(springY, [0, 1], [7, -7]);
  const rotateY = useTransform(springX, [0, 1], [-7, 7]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
      className="group relative"
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={reducedMotion ? undefined : { scale: 1.02 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotateX: reducedMotion ? 0 : rotateX, rotateY: reducedMotion ? 0 : rotateY }}
        className="relative overflow-hidden rounded-sm border border-gold/15 bg-gradient-to-b from-white/[0.03] to-transparent p-px transition-shadow duration-500 ease-cinematic group-hover:shadow-[0_0_40px_-8px_rgba(201,169,97,0.45)] group-hover:border-gold/50"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
          <Image
            src={product.image}
            alt={`${product.name} — ${product.concentration} flacon`}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
          <div className="vignette absolute inset-0" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-4 flex-col gap-3 border-t border-gold/20 bg-black/50 p-5 opacity-0 backdrop-blur-md transition-all duration-500 ease-cinematic group-hover:translate-y-0 group-hover:opacity-100">
            <NotePyramidRow label="Top" value={product.notes.top} />
            <NotePyramidRow label="Heart" value={product.notes.heart} />
            <NotePyramidRow label="Base" value={product.notes.base} />
          </div>
        </div>
      </motion.div>

      <div className="mt-6 text-center">
        <h3 className="font-display text-2xl font-light tracking-wide text-bone">{product.name}</h3>
        <p className="label-small mt-2">{product.concentration}</p>
      </div>
    </motion.div>
  );
}

function NotePyramidRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="label-small shrink-0 text-gold/80">{label}</span>
      <span className="text-right text-xs font-light text-bone/85">{value}</span>
    </div>
  );
}
