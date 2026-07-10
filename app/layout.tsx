import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import GrainOverlay from "@/components/GrainOverlay";
import CustomCursor from "@/components/CustomCursor";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VOILE NOIR — A veil of scent, worn like night.",
  description:
    "VOILE NOIR is a house of shadow and scent. Discover Voile I, Voile II, and Voile Absolute — worn, not announced.",
  metadataBase: new URL("https://voilenoir.example"),
  openGraph: {
    title: "VOILE NOIR",
    description: "A veil of scent, worn like night.",
    images: ["/hero-poster.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-ink text-bone font-body antialiased selection:bg-gold/30 selection:text-bone">
        <CustomCursor />
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}
