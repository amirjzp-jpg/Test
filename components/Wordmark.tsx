import VeilGlyph from "./VeilGlyph";

type WordmarkProps = {
  className?: string;
  glyphClassName?: string;
  textClassName?: string;
};

/**
 * Temporary type-set lockup standing in for /public/voile-noir.png.
 * Swap this for next/image once the gold-on-transparent logo file is provided —
 * same glyph shape (VeilGlyph) is reused there for continuity.
 */
export default function Wordmark({ className = "", glyphClassName = "", textClassName = "" }: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <VeilGlyph className={`h-4 w-auto text-gold ${glyphClassName}`} />
      <span className={`font-display font-normal tracking-display ${textClassName}`}>VOILE NOIR</span>
    </span>
  );
}
