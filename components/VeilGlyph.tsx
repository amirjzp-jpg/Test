type VeilGlyphProps = {
  className?: string;
};

/**
 * Recurring veil-fold motif — a folded droplet shape echoing the cap silhouette.
 * Used as a divider / watermark between sections and in the footer.
 */
export default function VeilGlyph({ className = "" }: VeilGlyphProps) {
  return (
    <svg
      viewBox="0 0 40 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 1C20 1 36 22.5 36 33.5C36 43.7173 28.8366 51 20 51C11.1634 51 4 43.7173 4 33.5C4 22.5 20 1 20 1Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M20 8L20 47" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path
        d="M20 8C20 8 30 24 30 33.5C30 39.5 25.5228 44 20 44"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
    </svg>
  );
}
