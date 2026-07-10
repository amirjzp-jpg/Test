"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { tagline } from "@/lib/data";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const useScrub = isDesktop && !reducedMotion;

  const [simpleRevealed, setSimpleRevealed] = useState(false);

  // iOS Safari: explicit load() on mount, playsInline + muted + preload=auto set in markup.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.load();
  }, []);

  // Simple fade-in path: mobile or reduced-motion.
  useEffect(() => {
    if (useScrub) return;
    const raf = requestAnimationFrame(() => setSimpleRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, [useScrub]);

  // Scroll-scrubbed desktop path.
  useEffect(() => {
    if (!useScrub) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    const headline = headlineRef.current;
    const taglineEl = taglineRef.current;
    const cue = cueRef.current;
    if (!section || !video || !headline || !taglineEl) return;

    gsap.set(headline, { opacity: 0, y: 16 });
    gsap.set(taglineEl, { opacity: 0, y: 12 });
    if (cue) gsap.set(cue, { opacity: 1 });

    // Text overlay is independent of video load state — it must animate on
    // scroll even if the video is slow to load or fails to decode.
    const scrubTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        if (video.readyState >= 1) {
          video.currentTime = self.progress * (video.duration || 8);
        }
      },
    });

    const overlayTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    overlayTl
      .fromTo(headline, { opacity: 0, y: 16 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 }, 0.15)
      .to(headline, { opacity: 0, y: -12, ease: "power2.in", duration: 0.1 }, 0.6)
      .fromTo(
        taglineEl,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 },
        0.4
      )
      .to(taglineEl, { opacity: 0, y: -10, ease: "power2.in", duration: 0.1 }, 0.6)
      .set({}, {}, 1);

    const onFirstScroll = () => {
      if (cue) gsap.to(cue, { opacity: 0, duration: 0.6, ease: "power1.out" });
    };
    window.addEventListener("scroll", onFirstScroll, { passive: true, once: true });

    return () => {
      window.removeEventListener("scroll", onFirstScroll);
      scrubTrigger.kill();
      overlayTl.kill();
    };
  }, [useScrub]);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className={`relative w-full ${useScrub ? "h-[450vh]" : "h-screen"}`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {useScrub ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="auto"
            poster="/hero-poster.jpg"
            aria-hidden="true"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/hero-poster.jpg"
            alt="Voile Noir flacon, a droplet of gold suspended above dark amber glass"
            fill
            priority
            sizes="100vw"
            className={`object-cover transition-opacity duration-[1200ms] ease-cinematic ${
              simpleRevealed ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <div className="vignette absolute inset-0" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          {useScrub ? (
            <>
              <h1
                ref={headlineRef}
                className="font-display text-5xl font-light tracking-display text-bone sm:text-6xl md:text-8xl"
              >
                VOILE NOIR
              </h1>
              <p
                ref={taglineRef}
                className="mt-6 font-display text-lg italic tracking-wide text-bone/90 md:text-2xl"
              >
                {tagline}
              </p>
            </>
          ) : (
            <div
              className={`transition-opacity duration-[1200ms] ease-cinematic ${
                simpleRevealed ? "opacity-100" : "opacity-0"
              }`}
            >
              <h1 className="font-display text-5xl font-light tracking-display text-bone sm:text-6xl">
                VOILE NOIR
              </h1>
              <p className="mt-6 font-display text-lg italic tracking-wide text-bone/90">{tagline}</p>
            </div>
          )}
        </div>

        {useScrub && (
          <div
            ref={cueRef}
            className="absolute bottom-10 left-1/2 h-16 w-px -translate-x-1/2 overflow-hidden"
            aria-hidden="true"
          >
            <div className="h-full w-full origin-top scale-y-100 bg-gradient-to-b from-gold via-gold/60 to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}
