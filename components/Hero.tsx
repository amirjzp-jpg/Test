"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { tagline } from "@/lib/data";

// Bump this whenever hero.mp4 / hero-mobile.mp4 / hero-poster.jpg are
// re-encoded. Filenames don't change on re-encode, and Cache-Control on
// these assets is public/max-age=86400 — without a version query param,
// a browser or CDN edge that fetched the old bytes today would keep
// serving them under the same URL for up to a day, masking any fix.
const ASSET_VERSION = "3";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  // videoFailed starts false so every device gets the video by default;
  // it only flips true if the video actually errors or never reaches
  // HAVE_METADATA within a few seconds of mount, at which point we commit
  // to the guaranteed-working poster+fade path for the rest of the visit.
  // Checked early (before most users start scrolling) so falling back
  // doesn't yank the section height out from under an in-progress scroll.
  const [videoFailed, setVideoFailed] = useState(false);
  const useScrub = !reducedMotion && !videoFailed;

  const [simpleRevealed, setSimpleRevealed] = useState(false);

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

    // iOS Safari sometimes ignores preload="auto" and needs an explicit
    // load() call to start buffering. Other browsers already honor
    // preload="auto" on parse, so call load() only if nothing has started
    // yet — calling it unconditionally would abort and restart an
    // in-progress fetch on every other browser.
    video.pause();
    if (video.readyState === 0 && video.networkState !== video.NETWORK_LOADING) {
      video.load();
    }

    // Track real duration once metadata resolves; 8s (this file's known
    // length) is the fallback until then so the scrub math is never NaN.
    let knownDuration = 8;
    const onLoadedMetadata = () => {
      if (video.duration && !Number.isNaN(video.duration)) knownDuration = video.duration;
      clearTimeout(readyTimeout);
    };
    video.addEventListener("loadedmetadata", onLoadedMetadata);

    // Some devices (older Android hardware decoders, networks that block
    // the file, etc.) may never fire loadedmetadata at all. Give it a few
    // seconds, then commit to the poster+fade fallback rather than leaving
    // a video element that silently never scrubs.
    const onVideoError = () => {
      console.warn("[Hero] hero video failed to load — falling back to poster frame.", video.error);
      setVideoFailed(true);
    };
    video.addEventListener("error", onVideoError);
    const readyTimeout = setTimeout(() => {
      if (video.readyState === 0) setVideoFailed(true);
    }, 4000);

    // One timeline drives both the video scrub and the text overlay, bound
    // to a single ScrollTrigger — previously these were two separate
    // triggers on the same section, each running its own scroll listener
    // and measurement pass for no benefit since they always moved in
    // lockstep. `scrub: 0.2` adds a small amount of temporal smoothing:
    // raw touch-scroll deltas arrive in bursts, and a short lag irons that
    // into a steadier feel. This does NOT reintroduce easing into the
    // progress→time mapping itself — the seek tween below still uses
    // `ease: "none"` (linear), so the smoothing is purely a lag on when
    // the (still-linear) value is applied, not a curve on the value.
    const seekProxy = { t: 0 };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2,
      },
    });

    tl.to(
      seekProxy,
      {
        t: 1,
        ease: "none",
        duration: 1,
        onUpdate: () => {
          // Only seek a paused video with an actual decoded frame available
          // (readyState >= HAVE_CURRENT_DATA) — seeking earlier or while
          // playing is what causes tearing/flicker on iOS Safari. This
          // video never autoplays, so `paused` is normally always true;
          // the check is kept explicit as a guard against future changes.
          if (video.paused && video.readyState >= 2) {
            video.currentTime = seekProxy.t * knownDuration;
          }
        },
      },
      0
    )
      .fromTo(headline, { opacity: 0, y: 16 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 }, 0.15)
      .to(headline, { opacity: 0, y: -12, ease: "power2.in", duration: 0.1 }, 0.6)
      .fromTo(
        taglineEl,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 },
        0.4
      )
      .to(taglineEl, { opacity: 0, y: -10, ease: "power2.in", duration: 0.1 }, 0.6);

    const onFirstScroll = () => {
      if (cue) gsap.to(cue, { opacity: 0, duration: 0.6, ease: "power1.out" });
    };
    window.addEventListener("scroll", onFirstScroll, { passive: true, once: true });

    return () => {
      clearTimeout(readyTimeout);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("error", onVideoError);
      window.removeEventListener("scroll", onFirstScroll);
      tl.kill();
    };
  }, [useScrub]);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className={`relative w-full ${useScrub ? "h-[450vh]" : "h-screen"}`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black will-change-transform">
        {useScrub ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="auto"
            poster={`/hero-poster.jpg?v=${ASSET_VERSION}`}
            aria-hidden="true"
          >
            {/* Evaluated once at load, not reactive to resize — same
                behavior as <picture>'s media-based source selection. A
                960x540 encode is plenty of native resolution for how wide
                this ever renders on a phone, even at high DPR. */}
            <source src={`/hero-mobile.mp4?v=${ASSET_VERSION}`} type="video/mp4" media="(max-width: 767px)" />
            <source src={`/hero.mp4?v=${ASSET_VERSION}`} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={`/hero-poster.jpg?v=${ASSET_VERSION}`}
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
