import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Collection from "@/components/Collection";
import Ritual from "@/components/Ritual";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main id="top" className="relative w-full bg-black">
      <Navbar />
      <Hero />
      <Manifesto />
      <Collection />
      <Ritual />
      <Footer />
    </main>
  );
}
