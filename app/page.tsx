import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Workflow } from "@/components/Workflow";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <Footer />
    </main>
  );
}
