/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Filenames aren't content-hashed, so avoid a long "immutable"
        // cache that would serve stale bytes if these are ever replaced —
        // a day of caching plus a week of stale-while-revalidate still
        // avoids re-fetching the hero video on every repeat visit/back-nav.
        source: "/:path*.(mp4|jpg|jpeg|png)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default nextConfig;
