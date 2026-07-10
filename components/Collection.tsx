"use client";

import { motion } from "framer-motion";
import { products } from "@/lib/data";
import ProductCard from "./ProductCard";
import VeilGlyph from "./VeilGlyph";

export default function Collection() {
  return (
    <section id="collection" className="relative w-full bg-black px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 flex flex-col items-center gap-5 text-center"
        >
          <VeilGlyph className="h-8 w-auto text-gold/60" />
          <span className="label-small">The Collection</span>
          <h2 className="font-display text-3xl font-light text-bone sm:text-4xl">
            Three shadows, one house.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-10">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
