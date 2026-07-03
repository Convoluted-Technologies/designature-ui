import { Navbar } from "@/app/webpage/components/Navbar";
import { Hero } from "@/app/webpage/components/Hero";
import { Features } from "@/app/webpage/components/Features";
import { Workflow } from "@/app/webpage/components/Workflow";
import { Footer } from "@/app/webpage/components/Footer";

export default function LandingWebpage() {
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
