# VOILE NOIR — Tech Stack

A single-page, cinematic scroll experience for a fictional luxury perfume house. This doc covers what the site is built with and how the media was produced.

## Framework & Language

- **Next.js 14** (App Router) — file-based routing, React Server Components by default, `next/image` and `next/font` for built-in optimization
- **TypeScript** — strict mode, typed throughout (components, hooks, data models)
- **React 18**

## Styling

- **Tailwind CSS 3** — utility-first, with a custom theme extension for the brand's design tokens:
  - Palette: `ink` (#000), `bone` (off-white), `gold` (#C9A961 + tints), `wine` (#5C1A2B → #2A0B12)
  - Type scale built on `Fraunces` (display serif) and `Inter` (body), both loaded via `next/font/google` — self-hosted, zero layout shift, no external font requests
- Custom utilities for the brand's recurring details: smallcaps section labels, vignette overlays, gold corner-bracket frames, film-grain texture (inline SVG turbulence, no image asset)

## Animation & Interaction

- **GSAP 3 + ScrollTrigger** — drives the scroll-scrubbed hero video (maps scroll position linearly to `video.currentTime`) and the pinned manifesto section (one line revealed per scroll segment)
- **Framer Motion 11** — product card hover states (mouse-parallax tilt via spring-smoothed motion values), scroll-triggered fade-ins across the Collection/Ritual/Footer sections, the custom cursor's lerped follow behavior, and the Ritual section's clip-path reveal
- Everywhere: `prefers-reduced-motion` is respected — scroll-scrub and parallax are disabled in favor of simple opacity fades

## Media Pipeline

- **Video**: H.264 MP4, delivered via a single `<video>` element with `playsInline`, `muted`, `preload="auto"`. Custom-encoded with `ffmpeg`:
  - Dense keyframe spacing (a keyframe every ~⅓s) so GSAP can seek to any scroll-driven timestamp without decoding forward through several frames — this was the main lever for making the scroll-scrub feel smooth rather than stuttery
  - `+faststart` so the browser can begin seeking before the whole file downloads
  - Audio track stripped (the element is always muted, so it was dead weight)
- **Images**: served through `next/image` (`sharp` as the optimizer), output as AVIF/WebP with JPEG fallback
- **Logo**: color-keyed from a black-background source into a transparent PNG via `ffmpeg`, then cropped to its content bounding box

## Deployment

- **Vercel** — zero-config for Next.js, auto-redeploys on push to the working branch

## AI-Generated Assets

- **Product photography**: generated with **Nano Banana** (Google's Gemini image model)
- **Hero video**: generated with **Google Omni**, conditioned on a seed image for visual continuity with the product stills
