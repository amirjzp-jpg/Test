"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import Wordmark from "./Wordmark";
import VeilGlyph from "./VeilGlyph";
import { footerLine } from "@/lib/data";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <footer id="footer" className="relative w-full bg-black px-6 pb-12 pt-28 md:px-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
        <Wordmark imgClassName="h-12 w-auto" />

        <motion.div
          initial={{ opacity: 0, scaleY: 0.4 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-gold/70"
        >
          <VeilGlyph className="h-10 w-auto" />
        </motion.div>

        <p className="font-display text-lg italic tracking-wide text-bone/80">{footerLine}</p>

        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col items-center gap-3">
          <div className="flex w-full items-center border-b border-gold/30 transition-colors duration-500 focus-within:border-gold">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address for the Voile Noir newsletter"
              className="w-full bg-transparent py-3 text-center text-sm font-light text-bone placeholder:text-bone/40 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="label-small mt-1 transition-opacity duration-300 hover:opacity-60"
          >
            {submitted ? "You're on the list" : "Join the list →"}
          </button>
        </form>

        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Voile Noir on Instagram"
            className="label-small text-bone/70 transition-colors duration-300 hover:text-gold"
          >
            IG
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Voile Noir on X"
            className="label-small text-bone/70 transition-colors duration-300 hover:text-gold"
          >
            X
          </a>
        </div>

        <p className="text-xs font-light text-bone/40">© {new Date().getFullYear()} Voile Noir. All rights reserved.</p>
      </div>
    </footer>
  );
}
