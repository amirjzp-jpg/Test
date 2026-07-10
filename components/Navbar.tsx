"use client";

import { useEffect, useState } from "react";
import Wordmark from "./Wordmark";

const NAV_LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Story", href: "#story" },
  { label: "Contact", href: "#footer" },
];

export default function Navbar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    let ticking = false;

    const evaluate = () => {
      const heroEl = document.getElementById("hero-section");
      if (!heroEl) {
        setSolid(window.scrollY > 40);
        ticking = false;
        return;
      }
      const rect = heroEl.getBoundingClientRect();
      setSolid(rect.bottom <= window.innerHeight * 0.98);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(evaluate);
      }
    };

    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-700 ease-cinematic ${
        solid ? "bg-black/70 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 sm:py-5 md:px-10">
        <a href="#top" className={`shrink-0 ${solid ? "" : "nav-blend"}`}>
          <Wordmark imgClassName="h-6 w-auto sm:h-7" priority />
        </a>
        <ul
          className={`flex items-center gap-4 label-small sm:gap-8 ${
            solid ? "text-bone/90" : "nav-blend text-white"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="hidden sm:block">
              <a
                href={link.href}
                className="transition-opacity duration-300 hover:opacity-60"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="sm:hidden">
            <a href="#collection" className="transition-opacity duration-300 hover:opacity-60">
              Menu
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
